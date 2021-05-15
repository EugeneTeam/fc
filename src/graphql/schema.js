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

const selectError = error => {
    if (error.exports && error.extensions.errors) {
        return error.extensions.errors
    }
    return [{
        code: 500,
        message: error.message,
        path: error.path
    }]
}

module.exports = {
    schema,
    apollo: new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        formatError: (error) => {
            return transform(null, selectError(error))
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
