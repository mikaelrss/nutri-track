import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './graphql/schema';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import logging from './logging/logger';

const app = express();
const DEFAULT_PORT = 4000;

global.log = logging;

app.use('/api/graphql', bodyParser.json(), graphqlExpress(req => ({ schema })));
app.use(
  '/api/graphiql',
  graphiqlExpress({
    endpointURL: '/api/graphql',
    subscriptionsEndpoint: `ws://localhost:${DEFAULT_PORT}/subscriptions`,
  }),
);

const server = createServer(app);
server.listen(process.env.PORT || DEFAULT_PORT, () => {
  SubscriptionServer.create(
    { execute, subscribe, schema },
    { server, path: '/subscriptions' },
  );
  log.info('Started server on port ' + (process.env.PORT || DEFAULT_PORT));
});
