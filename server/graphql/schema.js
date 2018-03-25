import { buildSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  type Query {
    version: String!
  }
  type Mutation {
    addHighscore(user: String! score: Int): Highscore!
  }

  type Highscore {
    score: Int,
    user: String,
  }

  type Subscription {
    highscoreWasBeaten(score: Int!): Highscore
  }
`;

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
