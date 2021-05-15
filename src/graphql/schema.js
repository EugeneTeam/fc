const {ApolloServer} = require('apollo-server-express');
const {makeExecutableSchema} = require('graphql-tools')
const {resolvers, typeDefs} = require('./types');
const {GRAPHQL_ENDPOINT, GRAPHQL_SUBSCRIPTION_PATH} = require('../config/constants');
const pubSubSingleton = require('./pubsub');
const triggerNamesList = require('./subscriptionTriggersNames');
const {
    functionArgumentValidation,
    checkUserAuthorization,
    checkUserRights
} = require('../utils/utils');
const {transform} = require('../utils/converter')

const schema = makeExecutableSchema({
    resolvers,
    typeDefs
})

module.exports = {
    schema,
    apollo: new ApolloServer({
        typeDefs,
        resolvers,

        formatError: (error) => {
            return transform(null, error.extensions.errors)
        },

        context: async ({req, res}) => {
            let context = {
                pubSub: pubSubSingleton.instance,
                triggers: triggerNamesList,
                user: null,
            }

            const methodName = await functionArgumentValidation(req)
            const user = await checkUserAuthorization(req)
            await checkUserRights(methodName, user)

            context.user = {
                id: user.id,
                nickname: user.nickname,
                email: user.email,
                status: user.status,
                banReason: user.banReason,
                isUserHaveRole: user.isUserHaveRole,
                isUserHavePermission: user.isUserHavePermission,
                permissions: user.getPermissionList()
            }
            return context;
        },
        playground: {
            endpoint: GRAPHQL_ENDPOINT
        },
        subscriptions: {
            path: GRAPHQL_SUBSCRIPTION_PATH
        }
    })
}
