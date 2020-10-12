const ApolloServer = require('apollo-server').ApolloServer;
const typeDefs = require('./schema');
const resolvers = {}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen()
    .then(({ url }) => console.log(`GraphQL Service is running on ${ url }`));
