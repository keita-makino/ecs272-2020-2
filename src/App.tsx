import React from 'react';
import { hot } from 'react-hot-loader';
import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { resolvers, typeDefs } from './resolvers';
import { Grid } from '@material-ui/core';
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

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Grid container style={{ margin: '0 3rem' }}>
        <Grid container item>
          <Livecode code={vis1} />
          <p>
            The visualizaiton above displays the monthly number of
            international/domestic passengers from/to Los Angeles International
            Airport (LAX). It tells us that both among domestic and
            intetnational flights, there is a seasonal tendency of the passenger
            count. In detail, the flights from/to this airport seems more
            popular in summer holidays. Also, one can assess that the recession
            in 2008 has lead to a temporal depression in the number of
            passengers at this airport. The number has been though increasing
            after the economy has boom again.
          </p>
        </Grid>
        <Grid container item>
          <Livecode code={vis2} />
          <p>
            This interactive pir chart illustrates the share of the passengers
            (departure/arrival) from each terminals at LAX. Note that a pie with
            less than 10,000 passengers per month is not shown. Using the
            slider, one can find that the share of international flights (at Tom
            Bradley International Terminal) has been slightly but continuously
            increasing over the time, and the share of other terminals has been
            getting more and more equivalent during the period. This implies
            that the management system of allocating the aviation companies and
            controlling the passenger flow has advanced so that there are less
            and less congested terminals in the airport overall.
          </p>
        </Grid>
        <Grid container item>
          <Livecode code={vis3} />
          <p>
            This scatterplot over the map shows the result of health-inspection
            at restaurants in Louisville, Kentucky. A cyan dot and orange dot
            respectively indicates that the restaurant has obtained a good
            (100/100) or bad (0/100) result from the inspection.
          </p>
        </Grid>
      </Grid>
    </ApolloProvider>
  );
};

export default hot(module)(App);
