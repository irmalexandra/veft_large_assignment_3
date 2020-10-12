const playerData = require('../data/db').Player;
const pickupGameData = require('../data/db').PickupGame;
const playedGames = require('../data/db').PlayedGames;
const playerSchema = require('../data/schemas/Player');

async function createPlayer (parent, args) {
    const newPlayer = {
        name: args.input.name
    };
    const player = await playerData.create(newPlayer);
    console.log(player);
    return player
}

async function updatePlayer(parent, args) {
    playerID = args.id;
    newName = args.name;
    let player = await playerData.findById(playerID);
    player.name = newName;
    await player.save();
    return player
}

async function getAllPlayers(){
    console.log("help");
    allPlayers = await playerData.find();
    let returnArr = [];

    for (player in allPlayers){
        let returnObject = {
            id: allPlayers[player].id,
            name: allPlayers[player].name,
            playedGames: []
        };
        console.log(returnObject);
        for (let i = 0; i < allPlayers[player].playedGames.length; i++){
            const pickupGame = await pickupGameData.findById(allPlayers[player].playedGames[i]);
            pickupGame.host = await playerData.findById(pickupGame.hostId);
            returnObject.playedGames.push(pickupGame)
        }
        returnArr.push(returnObject);
    }
    return returnArr;
}


module.exports = {
  queries: {
    allPlayers: getAllPlayers,
  },
  types: {

  },
  mutations: {
      createPlayer : createPlayer,
      updatePlayer : updatePlayer
  }
};


