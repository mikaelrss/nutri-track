import { PubSub, withFilter } from 'graphql-subscriptions';
const pubSub = new PubSub();

const HIGHSCORE_BEATEN = 'highscore_beaten';

const rootResolver = {
  Query: {
    version: () => {
      return process.env.npm_package_version;
    },
  },

  Mutation: {
    addHighscore: (proxy, data) => {
      pubSub.publish(HIGHSCORE_BEATEN, {
        highscoreWasBeaten: { user: data.user, score: data.score },
      });
      return data;
    },
  },

  Subscription: {
    highscoreWasBeaten: {
      subscribe: withFilter(
        () => pubSub.asyncIterator(HIGHSCORE_BEATEN),
        (payload, variables) => {
          return payload.highscoreWasBeaten.score > variables.score;
        },
      ),
    },
  },
};

export default rootResolver;
