const {ApolloServer} = require('apollo-server-express');

const {resolvers, typeDefs} = require('./types')

module.exports = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: error => error,
    context: ({req, res}) => {
        return null
    }
})
