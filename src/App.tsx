import React from 'react';
import { hot } from 'react-hot-loader';
import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Grid } from '@material-ui/core';
import dataLax from './data/LAX_Terminal_Passengers.json';
import dataIns from './data/Restaurant_Inspection.json';

import Livecode from './components/Livecode';
import vis1 from './codes/vis1';
import './App.css';

const cache = new InMemoryCache();
const client = new ApolloClient({ cache });

const addTypedata = (data: any, tag: string) => {
  return data.map(item => ({ ...item, __typedata: tag }));
};

cache.writeData({
  data: {
    dataLax: { data: addTypedata(dataLax, 'lax'), __typedata: 'lax' },
    dataIns: { data: addTypedata(dataIns, 'ins'), __typedata: 'ins' }
  }
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Grid container>
        <Livecode code={vis1} />
      </Grid>
    </ApolloProvider>
  );
};

export default hot(module)(App);
