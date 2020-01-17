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
    '& .rv-xy-plot__series--label-text': {
      textAnchor: 'middle',
      alignmentBaseline: 'middle'
    },
    '& .rv-xy-plot__series': {
      paddingTop: '48px'
    }
  },
  legend: {
    position: 'absolute',
    left: '110px',
    top: '48px',
    backgroundColor: 'rgba(255,255,255,0.6)'
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
