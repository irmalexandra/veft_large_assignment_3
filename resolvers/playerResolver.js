const playerData = require('../data/db').Player;
const pickupGameData = require('../data/db').PickupGame;
const playedGames = require('../data/db').PlayedGames;
const playerSchema = require('../data/schemas/Player');

async function createPlayer (parent, args) {
    const player = await playerData.create(args["input"]);
    console.log(player);
    return player
}

async function updatePlayer(parent, args) {
    playerID = args.id;
    newName = args.name;
    let player = await playerData.findOne({_id: playerID, deleted:false});
    if (player !== null){
        player.name = newName;
        await player.save();
        return player
    }
    //TODO THROW ERROR
    return null

}

async function getAllPlayers(){
    allPlayers = await playerData.find({deleted: false});
    return allPlayers;
}

async function getPlayerById(id){
    return playerData.findOne({_id: id, deleted:false});
}

async function getRegisteredPlayers(registeredPlayers){
    regPlayersArr = [];
    for (playerId in registeredPlayers){
        regPlayersArr.push(playerData.findById(registeredPlayers[playerId]))
    }
    return regPlayersArr
}

async function removePlayer(parent, args){
    let player = await playerData.findOne({_id: args["id"], deleted:false})
    if (player !== null){
        player.deleted = true;
        player.save();
        return true
    }
    // TODO THROW ERROR
    return false
}


module.exports = {
  queries: {
      allPlayers: getAllPlayers,
      player: (parent, args) => getPlayerById(args["id"]),

  },
  types: {

  },
  mutations: {
      createPlayer : createPlayer,
      updatePlayer : updatePlayer,
      removePlayer: removePlayer
  },
    getPlayerById: getPlayerById,
    getRegisteredPlayers: getRegisteredPlayers

};


