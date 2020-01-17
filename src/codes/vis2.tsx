const code = `
  () => {
    const classes = useStyles();
    const [date, setDate] = React.useState(new Date('2006/01/01'));
    const [tooltip, setTooltip] = React.useState(0);

    const query = gql\`
      {
        laxRecords @client {
          ReportPeriod
          Terminal
          Passenger_Count
          __typedata
        }
      }
    \`;
    const client = useApolloClient();
    const { data } = useQuery(query, { client: client });

    const plotData = Object.values(
      data.laxRecords
        .map((item) => ({
          x: new Date(item.ReportPeriod.split(' ')[0]),
          t: item.Terminal,
          z: item.Passenger_Count
        }))
        .reduce((summary, current, index) => {
          const str = JSON.stringify([current.x, current.t]);
          summary[str] = Object.assign({}, current, {
            y: summary[str] ? summary[str].y + current.z : current.z
          });
          return summary;
        }, {})
    ).sort((a, b) => (a.x < b.x ? -1 : 1));

    const getThetas = (date) => {
      return plotData
        .filter(item => item.x.getTime() === date.getTime())
        .filter(item => item.y > 10000)
        .map(item => ({ theta: item.y, name: item.t }))
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((item, index) => ({ ...item, color: index*200 }));
    };

    const dates = plotData
      .map(item => item.x.getTime())
      .filter((item, index, array) => array.indexOf(item) === index)
      .map(item => new Date(item));

    const handleChange = (_event, value) => {
      setDate(dates[value]);
    };

    return (
      <>
        <RV.RadialChart
          className={classes.chart}
          radius={200}
          innerRadius={100}
          getAngle={d => d.theta}
          getLabel={d => d.name}
          data={getThetas(date)}
          onValueMouseOver={value => setTooltip(value)}
          onSeriesMouseOut={() => setTooltip(0)}
          labelsRadiusMultiplier={1.2}
          labelsStyle={{ fontSize: 14, fill: '#222', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
          width={960}
          height={600}
          showLabels
          padAngle={0.04}
        >
          {tooltip === 0 ? null : <RV.Hint value={tooltip} />}
          <RV.LabelSeries
            data={[
              {
                x: 0,
                y: 0,
                label: date.getFullYear() + '/' + (date.getMonth() + 1)
              }
            ]}
          />
          <RV.LabelSeries
            data={[
              {
                x: 0,
                y: 1.33,
                label: 'LAX Arrival + Departure Share by Terminals'
              }
            ]}
            style={{ fontSize: 18, fill: '#222', fontWeight: 700}}
          />
        </RV.RadialChart>
        <MUI.Slider
          onChange={handleChange}
          max={dates.length}
          style={{color: "#002855", width: '960px'}}
        />
        <p style={{ width: '960px' }}>
          This interactive pie chart illustrates the share of the passengers
          (departure/arrival) from each terminals at LAX. Note that a pie with
          less than 10,000 passengers per month is not shown. Using the slider,
          one can find that the share of international flights (at Tom Bradley
          International Terminal) has been slightly but continuously increasing
          over the time, and the share of other terminals has been getting more
          and more equivalent during the period. This implies that the management
          system of allocating the aviation companies and controlling the
          passenger flow has advanced so that there are less and less congested
          terminals in the airport overall. Also, the emergence of Misc. Terminal
          since early 2010s' implies the increasing popularity of private
          aviations.
        </p>
      </>
    );
  };
`;

export default code;
