const playerResolver = require('./playerResolver');
const basketballFieldResolver = require('./basketballFieldResolver');
const pickupGameResolver = require('./pickupGameResolver');

module.exports = {
  Query: {
    ...playerResolver.queries,
    ...basketballFieldResolver.queries,
    ...pickupGameResolver.queries,
  },
  Mutation: {
    ...playerResolver.mutations,
    ...basketballFieldResolver.mutations,
    ...pickupGameResolver.mutations,
  }
};