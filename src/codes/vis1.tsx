const code = `
  () => {
    const classes = useStyles();

    const [tooltip, setTooltip] = React.useState([]);
  
    const query = gql\`
      {
        laxRecords @client {
          ReportPeriod
          Domestic_International
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
          z: item.Passenger_Count
        }))
        .reduce((summary, current, index) => {
          const str = JSON.stringify([current.x, current.i]);
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
      <RV.XYPlot
        xType="time"
        width={960}
        height={600}
        margin={{ left: 75, bottom: 55 }}
        yDomain={[0, Math.max(...plotData.map(item => item.y)) * 1.1]}
      >
        <RV.VerticalGridLines style={{ stroke: '#B7E9ED' }} />
        <RV.HorizontalGridLines style={{ stroke: '#B7E9ED' }} />
        <RV.XAxis />
        <RV.YAxis />
        <RV.LineSeries
          data={plotData.filter(item => item.i === 'Domestic')}
          onNearestXY={onNearestXY}
        />
        <RV.LineSeries
          data={plotData.filter(item => item.i === 'International')}
          onNearestXY={onNearestXY}
        />
        <RV.Crosshair values={tooltip} />
        <RV.DiscreteColorLegend
          className={classes.legend}
          orientation="horizontal"
          items={[{ title: 'Domestic' }, { title: 'International' }]}
        />
      </RV.XYPlot>
    );
  };
`;

export default code;
