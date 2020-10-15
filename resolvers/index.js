const playerResolver = require('./playerResolver');
const basketballFieldResolver = require('./basketballFieldResolver');
const pickupGameResolver = require('./pickupGameResolver');
const momentScalar = require('moment');

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
  },
  Player: {
    playedGames: parent => pickupGameResolver.getPlayedGames(parent),

  },
  PickupGame: {
    host: parent => playerResolver.getPlayerById(parent.hostId),
    location: parent => basketballFieldResolver.getFieldById("" , parent.basketballFieldId),
    registeredPlayers: parent => playerResolver.getRegisteredPlayers(parent.registeredPlayers)
  },
  BasketballField: {
    pickupGames: parent => pickupGameResolver.getPickupGamesByLocationId(parent.location),
  },
  Moment: {
    end: parent => console.log(parent),
  },

};