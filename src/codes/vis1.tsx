const code = `
  () => {
    const classes = useStyles();

    const [tooltip, setTooltip] = React.useState([]);
  
    const query = gql\`
      {
        laxRecords @client {
          ReportPeriod
          Domestic_International
          Arrival_Departure
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
          i: item.Domestic_International,
          a: item.Arrival_Departure,
          z: item.Passenger_Count
        }))
        .reduce((summary, current, index) => {
          const str = JSON.stringify([current.x, current.i, current.a]);
          summary[str] = Object.assign({}, current, {
            y: summary[str] ? summary[str].y + current.z : current.z
          });
          return summary;
        }, {})
    ).sort((a, b) => (a.x < b.x ? -1 : 1));
  
    const onNearestXY = (value) => {
      setTooltip(plotData.filter(item => item.x.getTime() === value.x.getTime()));
    };
  
    return (
      <>
        <RV.XYPlot
          xType="time"
          width={960}
          height={600}
          margin={{ top: 48, left: 75, bottom: 55 }}
          yDomain={[0, Math.max(...plotData.map(item => item.y)) * 1.1]}
          xDomain={[new Date("2006/01/01"), Math.max(...plotData.map(item => item.x))]}
        >
          <RV.VerticalGridLines />
          <RV.HorizontalGridLines />
          <RV.XAxis title={"Year/Month"}/>
          <RV.YAxis title={"Passengers"}/>
          <RV.LineSeries
            data={plotData.filter(item => item.i === 'Domestic' && item.a === 'Arrival')}
            onNearestXY={onNearestXY}
          />
          <RV.LineSeries
            data={plotData.filter(item => item.i === 'Domestic' && item.a === 'Departure')}
            onNearestXY={onNearestXY}
          />
          <RV.LineSeries
            data={plotData.filter(item => item.i === 'International' && item.a === 'Arrival')}
            onNearestXY={onNearestXY}
          />
          <RV.LineSeries
            data={plotData.filter(item => item.i === 'International' && item.a === 'Arrival')}
            onNearestXY={onNearestXY}
          />
          <RV.Crosshair values={tooltip} />
          <RV.DiscreteColorLegend
            className={classes.legend}
            orientation="horizontal"
            items={[
              { title: 'Domestic-Arrival' },
              { title: 'Domestic-Departure' },
              { title: 'International-Arrival' },
              { title: 'International-Departure' }
            ]}
          />
          <RV.LabelSeries
            data={[
              {
                x: new Date("2009/06/01"),
                y: Math.max(...plotData.map(item => item.y)) * 1.2,
                label: 'LAX Arrivals / Departures by Flight Type'
              }
            ]}
            style={{ 
              fontSize: 18,
              fill: '#222',
              fontWeight: 700,
              transform: 'translate(75px, 56px)'
            }}
          />
        </RV.XYPlot>
        <p style={{ width: '960px' }}>
          The visualizaiton above displays the monthly number of
          international/domestic passengers from/to Los Angeles International
          Airport (LAX). It tells us that both among domestic and
          intetnational flights, there is a seasonal tendency of the passenger
          count. In detail, the flights from/to this airport seems more
          popular in summer holidays. Also, one can find that the recession in
          2008 has led to a temporal depression in the number of passengers
          at this airport. The number has been though increasing after the
          economy has boomed again. The number of arrivals and departures
          passengers seems almost identical, but oftentimes departures have
          slightly higher number in spring to summer season while the arrivals
          sometimes have a small surpass in fall to winter.
        </p>
      </>
    );
  };
`;

export default code;
