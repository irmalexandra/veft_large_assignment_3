const playerData = require('../data/db').Player;
const pickupGameData = require('../data/db').PickupGame;
const playedGames = require('../data/db').PlayedGames;
const playerSchema = require('../data/schemas/Player');
const pickupGameResolver = require('./pickupGameResolver');
const errors = require("../errors");


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
    let allPlayers = await playerData.find({deleted: false});
    return allPlayers;
}

async function getPlayerById(id){
    console.log("in get player");
    let player = await playerData.findOne({_id: id, deleted:false})
    if (player === null) {
        throw new errors.NotFoundError();
    }
    return player;
}

async function getRegisteredPlayers(registeredPlayers){
    let regPlayersArr = [];
    for (let playerId in registeredPlayers){
        let player = await playerData.findOne({_id: registeredPlayers[playerId], deleted:false});
        if (player) {
            regPlayersArr.push(player)
        }
    }
    return regPlayersArr
}

async function removePlayer(parent, args){
    let player = await getPlayerById(args["id"]);
    if (player === null){
        throw new errors.NotFoundError()
    }
    let pickupGamesArray = await pickupGameResolver.allPickupGames();

    for (let pickupGame in pickupGamesArray){
        let hostId = pickupGamesArray[pickupGame].hostId;
        console.log(pickupGamesArray[pickupGame]._id);
        if (player.id == hostId) {

            let allPlayers = await getRegisteredPlayers(pickupGamesArray[pickupGame].registeredPlayers);

            if (allPlayers.length < 2){
                await pickupGameResolver.deletePickupGame("", {input:{id:pickupGamesArray[pickupGame]._id}})
            }
            else {
                allPlayers.sort((p_a, p_b) => (p_a.name > p_b.name) ? 1 : -1);
                pickupGamesArray[pickupGame].hostId = allPlayers[0]._id;
                pickupGamesArray[pickupGame].save()
            }
        }
    }
    player.deleted = true;
    player.save();
    return true
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
    getRegisteredPlayers: getRegisteredPlayers,
    getPlayerById: getPlayerById
};


