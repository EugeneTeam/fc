const {ApolloServer} = require('apollo-server-express');
const {makeExecutableSchema} = require('graphql-tools')
const {resolvers, typeDefs} = require('./types');
const {GRAPHQL_ENDPOINT, GRAPHQL_SUBSCRIPTION_PATH} = require('../config/constants');
const pubSubSingleton = require('./pubsub');
const triggerNamesList = require('./subscriptionTriggersNames');
const models = require('../models');
// const {getMethodNameFromQueryString} = require('./gqlParser');

const schema = makeExecutableSchema({
    resolvers,
    typeDefs
})

module.exports = {
    schema,
    apollo: new ApolloServer({
        typeDefs,
        resolvers,
        formatError: error => error,
        context: async ({req, res}) => {
            // const methodName = getMethodNameFromQueryString(req);
            let context = {
                pubSub: pubSubSingleton.instance,
                triggers: triggerNamesList,
                user: null
            }

            const user = await models.User.findOne({
                where: {
                    id: 1
                },
                include: {
                    model: models.LUserRole,
                    include: {
                        model: models.Role,
                        include: {
                            model: models.LRolePermission,
                            include: {
                                model: models.Permission
                            }
                        }
                    }
                }
            })
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
