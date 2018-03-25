'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _graphqlTools = require('graphql-tools');

var _resolvers = require('./resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeDefs = '\n  type Query {\n    version: String!\n  }\n  type Mutation {\n    addHighscore(user: String! score: Int): Highscore!\n  }\n\n  type Highscore {\n    score: Int,\n    user: String,\n  }\n\n  type Subscription {\n    highscoreWasBeaten(score: Int!): Highscore\n  }\n';

exports.default = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: typeDefs,
  resolvers: _resolvers2.default
});