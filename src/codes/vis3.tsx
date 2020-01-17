const code = `
  () => {
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
    console.log(MAPBOX_TOKEN);

    const client = useApolloClient();
    const rawData = useQuery(query, { client: client });

    const data = rawData.data.insRecords.map((item) => ({
      lat: item.Latitude,
      lng: item.Longitude,
      score: item.Score,
      name: item.name
    }));
    console.log(data);

    const [scatter, setScatter] = React.useState(
      new ScatterplotLayer({
        id: 'scatterplot-layer',
        data,
        filled: true,
        getRadius: 125,
        getPosition: d => [d.lng, d.lat],
        getFillColor: d => [255 - d.score * 2.55, 127, d.score * 2.55]
      })
    );

    console.log(scatter);

    const [view, setView] = React.useState({
      latitude: 38.2141005,
      longitude: -85.69785,
      zoom: 10,
      pitch: 0,
      bearing: 0
    });

    return (
      <div style={{position:"relative"}}>
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
        </DeckGL>
      </div>
    );  
  };
`;

export default code;
