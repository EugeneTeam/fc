require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {apollo, schema} = require('./graphql/schema');
const {createServer} = require('http');
const {SubscriptionServer} = require('subscriptions-transport-ws');
const {execute, subscribe} = require('graphql');
const {GRAPHQL_SUBSCRIPTION_PATH} = require('./config/constants');
const pubSubSingleton = require('./graphql/pubsub');
const triggerNamesList = require('./graphql/subscriptionTriggersNames');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.set('port', process.env.PORT);

apollo.applyMiddleware({ app });

const httpServer = createServer(app);

httpServer.listen(process.env.PORT, () => {
    console.log(`***server ready at http://localhost:${process.env.PORT}${apollo.graphqlPath}`)
    console.log(`***subscriptions ready at ws://localhost:${process.env.PORT}${apollo.subscriptionsPath}`)
    console.log(`***server start in port ${process.env.PORT}`)
    new SubscriptionServer({
        execute,
        subscribe,
        schema,
        onConnect: () => ({
            pubSub: pubSubSingleton.instance,
            triggers: triggerNamesList
        }),
    },{
        server: httpServer,
        path: GRAPHQL_SUBSCRIPTION_PATH,

    })
})

