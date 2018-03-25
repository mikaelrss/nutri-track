'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _apolloServerExpress = require('apollo-server-express');

var _schema = require('./graphql/schema');

var _schema2 = _interopRequireDefault(_schema);

var _graphql = require('graphql');

var _http = require('http');

var _subscriptionsTransportWs = require('subscriptions-transport-ws');

var _logger = require('./logging/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var DEFAULT_PORT = 4000;
var production = process.env.NODE_ENV === 'production';
console.log(process.env.NODE_ENV);
global.log = _logger2.default;

app.use('/api/graphql', _bodyParser2.default.json(), (0, _apolloServerExpress.graphqlExpress)(function (req) {
  return { schema: _schema2.default };
}));
app.use('/api/graphiql', (0, _apolloServerExpress.graphiqlExpress)({
  endpointURL: '/api/graphql',
  subscriptionsEndpoint: 'ws://localhost:' + DEFAULT_PORT + '/subscriptions'
}));

if (production) {
  var staticPath = path.join(__dirname, '../../build');

  console.log('Production, serving static files from ' + staticPath);
  app.use(_express2.default.static(path.resolve('build')));
} else {
  console.log('Env is not production, not serving any static files.');
}

var server = (0, _http.createServer)(app);
server.listen(process.env.PORT || DEFAULT_PORT, function () {
  _subscriptionsTransportWs.SubscriptionServer.create({ execute: _graphql.execute, subscribe: _graphql.subscribe, schema: _schema2.default }, { server: server, path: '/subscriptions' });
  log.info('Started server on port ' + (process.env.PORT || DEFAULT_PORT));
});