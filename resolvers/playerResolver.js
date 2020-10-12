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
    players = await playerData.find();
    playerArr = [];
    for (player in players){
        playerObject = {
            id: players[player].id,
            name: players[player].name,
            playedGames: []
        };
        for (game in players[player].playedGames){
            host = pickupGameData.find({host: players[player].playedGames[game].host})
            playerObject.playedGames.push({
                id: players[player].playedGames[game].id,
                start: players[player].playedGames[game].start,
                end: players[player].playedGames[game].end,
                location: {
                    id: "Yes",
                    name: players[player].playedGames[game].basketballFieldId,
                    capacity: 5,
                    yearOfCreation: "2020-10-15T18:30",
                },
                host: {
                    id: host.id,
                    name: host.name
                }
            })
        }
        playerArr.push(playerObject)
    }
    return playerArr
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


