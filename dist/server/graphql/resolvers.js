'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlSubscriptions = require('graphql-subscriptions');

var pubSub = new _graphqlSubscriptions.PubSub();

var HIGHSCORE_BEATEN = 'highscore_beaten';

var rootResolver = {
  Query: {
    version: function version() {
      return process.env.npm_package_version;
    }
  },

  Mutation: {
    addHighscore: function addHighscore(proxy, data) {
      pubSub.publish(HIGHSCORE_BEATEN, {
        highscoreWasBeaten: { user: data.user, score: data.score }
      });
      return data;
    }
  },

  Subscription: {
    highscoreWasBeaten: {
      subscribe: (0, _graphqlSubscriptions.withFilter)(function () {
        return pubSub.asyncIterator(HIGHSCORE_BEATEN);
      }, function (payload, variables) {
        return payload.highscoreWasBeaten.score > variables.score;
      })
    }
  }
};

exports.default = rootResolver;