import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './graphql/schema';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import logging from './logging/logger';

const app = express();
const DEFAULT_PORT = 4000;
const production = process.env.NODE_ENV === 'production';
console.log(process.env.NODE_ENV);
global.log = logging;

app.use('/api/graphql', bodyParser.json(), graphqlExpress(req => ({ schema })));
app.use(
  '/api/graphiql',
  graphiqlExpress({
    endpointURL: '/api/graphql',
    subscriptionsEndpoint: `ws://localhost:${DEFAULT_PORT}/subscriptions`,
  }),
);

if (production) {
  const staticPath = path.join(__dirname, '../../build');

  console.log('Production, serving static files from ' + staticPath);
  app.use(express.static(path.resolve('build')));
} else {
  console.log('Env is not production, not serving any static files.');
}

const server = createServer(app);
server.listen(process.env.PORT || DEFAULT_PORT, () => {
  SubscriptionServer.create(
    { execute, subscribe, schema },
    { server, path: '/subscriptions' },
  );
  log.info('Started server on port ' + (process.env.PORT || DEFAULT_PORT));
});
