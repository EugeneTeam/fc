import {ApolloServer} from 'apollo-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import {resolvers, typeDefs} from './types'
import {GRAPHQL_ENDPOINT, GRAPHQL_SUBSCRIPTION_PATH} from '../config/constants'
import pubSubSingleton from './pubsub'
import triggerNamesList from './subscriptionTriggersNames'
import {functionArgumentValidation, checkUserAuthorization, checkUserRights} from '../utils/utils'
import {transform} from '../utils/converter'

const schema = makeExecutableSchema({
    resolvers,
    typeDefs
})

const selectError = error => {
    if (error.extensions && error.extensions.errors) {
        return error.extensions.errors
    }

    return [{
        code: 500,
        message: error.message,
        path: error
    }]
}

export default {
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
