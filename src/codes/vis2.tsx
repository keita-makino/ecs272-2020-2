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
        .sort((a, b) => (a.name < b.name ? -1 : 1));
    };

    const dates = plotData
      .map(item => item.x.getTime())
      .filter((item, index, array) => array.indexOf(item) === index)
      .map(item => new Date(item));
    console.log(dates);

    const handleChange = (_event, value) => {
      setDate(dates[value]);
    };

    return (
      <>
        <RV.RadialChart
          className={classes.chart}
          radius={220}
          innerRadius={100}
          getAngle={d => d.theta}
          getLabel={d => d.name}
          data={getThetas(date)}
          onValueMouseOver={value => setTooltip(value)}
          onSeriesMouseOut={() => setTooltip(0)}
          labelsRadiusMultiplier={1.3}
          labelsStyle={{ fontSize: 14, fill: '#222' }}
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
                x: -2,
                y: 1.25,
                label: 'LAX Arrival + Departure via Terminals'
              }
            ]}
            style={{ fontSize: 18, fill: '#222' }}
          />
        </RV.RadialChart>
        <MUI.Slider onChange={handleChange} max={dates.length} />
      </>
    );
  };
`;

export default code;
