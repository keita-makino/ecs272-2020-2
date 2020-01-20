import React from 'react';
import { hot } from 'react-hot-loader';
import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { resolvers, typeDefs } from './resolvers';
import { Grid, makeStyles, AppBar, Typography } from '@material-ui/core';
import dataLax from './data/LAX_Terminal_Passengers.json';
import dataIns from './data/Restaurant_Inspection.json';

import Livecode from './components/Livecode';
import vis1 from './codes/vis1';
import vis2 from './codes/vis2';
import vis3 from './codes/vis3';
import './App.css';
import '../node_modules/react-vis/dist/style.css';

const cache = new InMemoryCache();
const client = new ApolloClient({ cache, resolvers, typeDefs });

const addTypedata = (data: any, tag: string) => {
  return data.map((item: any) => ({ ...item, __typedata: tag }));
};

cache.writeData({
  data: {
    laxRecords: addTypedata(dataLax, 'lax'),
    insRecords: addTypedata(dataIns, 'ins')
  }
});

console.log(cache);

const useStyles = makeStyles({
  appBar: {
    backgroundColor: '#002855'
  },
  container: {
    fontFamily: 'roboto, Arial, Helvetica, sans-serif !important',
    color: '#222',
    backgroundColor: '#FBF6E5',
    textAlign: 'justify'
  },
  header: {
    margin: '5rem 0 1rem 0',
    padding: '0 3rem',
    borderBottom: '6px double #002855'
  },
  vis: {
    backgroundColor: '#F4E5B2',
    borderTop: '1px solid #DAAA00',
    borderBottom: '1px solid #DAAA00',
    margin: '1rem 0',
    padding: '1rem 3rem',
    '& > div:first-child': {
      width: '720px',
      maxHeight: '800px',
      backgroundColor: '#FFFFFF',
      overflow: 'auto !important',
      '& > textarea': {
        width: '720px !important',
        height: '200vh !important'
      }
    },
    '& .rv-xy-plot': {
      backgroundColor: '#FFFFFF'
    }
  }
});

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <ApolloProvider client={client}>
      <AppBar position="sticky" className={classes.appBar}>
        <Grid container justify={'space-between'} alignItems={'center'}>
          <Typography variant="h5" style={{ margin: '1rem 3rem' }}>
            ECS272-2020 Assignment 2
          </Typography>
          <Typography variant="body1" style={{ margin: '1rem 3rem' }}>
            Keita Makino
          </Typography>
        </Grid>
      </AppBar>
      <Grid container className={classes.container} justify={'center'}>
        <Typography variant="h4" className={classes.header}>
          1: LAX Arrivals / Departures by Flight Type
        </Typography>
        <Grid container item justify={'space-between'} className={classes.vis}>
          <Livecode code={vis1} />
        </Grid>
        <Typography variant="h4" className={classes.header}>
          2: LAX Arrival + Departure Share by Terminals
        </Typography>
        <Grid container item justify={'space-between'} className={classes.vis}>
          <Livecode code={vis2} />
        </Grid>
        <Typography variant="h4" className={classes.header}>
          3: Restaurant Inspections in Louisville
        </Typography>
        <Grid container item justify={'space-between'} className={classes.vis}>
          <Livecode code={vis3} />
        </Grid>
      </Grid>
    </ApolloProvider>
  );
};

export default hot(module)(App);
