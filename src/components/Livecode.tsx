import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

import * as RV from 'react-vis';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

type Props = {
  code: string;
};

const Livecode: React.FC<Props> = (props: Props) => {
  return (
    <RV.XYPlot width={300} height={300}>
      <RV.VerticalGridLines />
      <RV.HorizontalGridLines />
      <RV.XAxis />
      <RV.YAxis />
      <RV.MarkSeries
        strokeWidth={2}
        opacity={0.8}
        sizeRange={[5, 15]}
        data={[
          { x: 1, y: 10, size: 30 },
          { x: 1.7, y: 12, size: 10 },
          { x: 2, y: 5, size: 1 },
          { x: 3, y: 15, size: 12 },
          { x: 2.5, y: 7, size: 4 }
        ]}
      />
    </RV.XYPlot>
  );
};

export default Livecode;
