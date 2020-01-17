const code = `
  () => {
    const [state, setState] = React.useState({
      hoveredObject: {},
      pointerX: 0,
      pointerY: 0
    });
  
    const query = gql\`
      {
        insRecords @client {
          Score
          Latitude
          Longitude
          NameSearch
          __typedata
        }
      }
    \`;
  
    const MAPBOX_TOKEN =
      'pk.eyJ1Ijoia2VtYWtpbm8iLCJhIjoiY2s1aHJkeWVpMDZzbDNubzltem80MGdnZSJ9.Mn_8DItICHFJyiPJ2rP_0Q';
  
    const client = useApolloClient();
    const rawData = useQuery(query, { client: client });
  
    const data = rawData.data.insRecords.map(
      item => ({
        lat: item.Latitude,
        lng: item.Longitude,
        score: item.Score,
        name: item.NameSearch
      })
    );
  
    const [view, setView] = React.useState({
      latitude: 38.2141005,
      longitude: -85.69785,
      zoom: 10,
      pitch: 0,
      bearing: 0
    });
  
    const scatter = new ScatterplotLayer({
      id: 'scatter',
      data,
      pickable: true,
      filled: true,
      getRadius: 20000000 / Math.pow(view.zoom, 5),
      getPosition: obj => [obj.lng, obj.lat],
      getFillColor: obj =>
        obj.score === ''
          ? [191, 191, 191]
          : [
              255 - ((obj.score - 85) * 255) / 15,
              191,
              ((obj.score - 85) * 255) / 15
            ],
      onHover: info => {
        setState({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y
        });
      }
    });
  
    return (
      <>
        <div style={{ width: '960px', height: '600px', position: 'relative' }}>
          <DeckGL
            viewState={view}
            width={960}
            height={600}
            layers={[scatter]}
            controller
            onViewStateChange={({ viewState }) => setView(viewState)}
          >
            <StaticMap
              mapboxApiAccessToken={MAPBOX_TOKEN}
              width={960}
              height={600}
            />
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                position: 'absolute',
                padding: '1.2rem',
                zIndex: 5,
                backgroundColor: '#FFFFFF'
              }}
            >
              Restaurant Inspections in Louisville
            </div>
            {state.hoveredObject !== undefined ? (
              <div
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  left: state.pointerX + 20,
                  top: state.pointerY,
                  padding: '0.5rem',
                  backgroundColor: '#FFFFFF'
                }}
              >
                name: {state.hoveredObject.name} <br />
                score: {state.hoveredObject.score}
              </div>
            ) : null}
          </DeckGL>
        </div>
        <p style={{ width: '960px' }}>
          This scatterplot over the map shows the result of health-inspection at
          restaurants in Louisville, Kentucky. A cyan dot and orange dot
          respectively indicates that the restaurant has obtained a good (100/100)
          or bad (less than 85/100) result from the inspection. Restrants with no
          score are shown in gray point. Overall, the public health is fairly kept
          in the city as most of the dots exhibits a cyan color. There are some
          bad result from restaurants, but it seems that such businesses are
          equally distributed throughout the city. Thus, we cannot conclude that
          factors depending on the geographical location (e.g., population
          density, distance to downtown, or land price) would not affect the
          status of the restaurants in the city. It may need further analysis to
          figure out the characteristics among the non-healthy restaurants.
        </p>
      </>
    )
  };
`;

export default code;
