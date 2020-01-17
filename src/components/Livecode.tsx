import React, { useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { makeStyles } from '@material-ui/core/styles';

import * as RV from 'react-vis';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import * as MUI from '@material-ui/core';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import StaticMap from 'react-map-gl';

type Props = {
  code: string;
};

const useStyles = makeStyles({
  chart: {
    marginLeft: '120px',
    '& .rv-xy-plot__series--label-text': {
      textAnchor: 'middle'
    }
  },
  legend: {
    position: 'absolute',
    left: '80px',
    top: '10px',
    backgroundColor: 'white'
  }
});

const Livecode: React.FC<Props> = (props: Props) => {
  return (
    <LiveProvider
      code={props.code}
      scope={{
        RV,
        useApolloClient,
        useQuery,
        gql,
        useStyles,
        MUI,
        DeckGL,
        ScatterplotLayer,
        StaticMap
      }}
    >
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  );
};

export default Livecode;
