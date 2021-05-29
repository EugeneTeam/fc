import dotEnv from 'dotenv'
dotEnv.config()
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Schema from './graphql/schema';
import {createServer} from 'http';
import {SubscriptionServer} from 'subscriptions-transport-ws';
import {execute, subscribe} from 'graphql';
import {GRAPHQL_SUBSCRIPTION_PATH} from './config/constants';
import pubSubSingleton from'./graphql/pubsub';
import triggerNamesList from './graphql/subscriptionTriggersNames';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.set('port', process.env.PORT);

Schema.apollo.applyMiddleware({ app });

const httpServer = createServer(app);

httpServer.listen(process.env.PORT, () => {
    console.log(`***server ready at http://localhost:${process.env.PORT}${Schema.apollo.graphqlPath}`)
    console.log(`***subscriptions ready at ws://localhost:${process.env.PORT}${Schema.apollo.subscriptionsPath}`)
    console.log(`***server start in port ${process.env.PORT}`)
    new SubscriptionServer({
        execute,
        subscribe,
        schema: Schema.schema,
        onConnect: () => ({
            pubSub: pubSubSingleton.instance,
            triggers: triggerNamesList
        }),
    },{
        server: httpServer,
        path: GRAPHQL_SUBSCRIPTION_PATH,

    })
})

