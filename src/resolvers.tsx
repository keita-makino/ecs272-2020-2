import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    airport(icao: String!): Airport
    flight(ident: String!): Flight
  }
  type Airport {
    icao: String
    latitude: Float
    longitude: Float
  }
  type Flight {
    ident: String
    type: String
    origin: Airport
    destination: Airport
    latitude: Float
    longitude: Float
    groundspeed: Float
    heading: Float
  }
`;

export const resolvers = {};
