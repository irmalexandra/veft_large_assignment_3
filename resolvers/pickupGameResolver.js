const pickupGameData = require('../data/db').PickupGame;
const playerData = require('../data/db').Player;
const playedGamesData = require('../data/db').PlayedGames;
const objectId = require('mongoose').ObjectID;

async function createPickupGame(parent, args){
    const host = await playerData.findById(args.input.hostId);
    args.input.host = host;
    const createdPickupGame = await pickupGameData.create(args.input);
    return {
        id: createdPickupGame.id,
        start: createdPickupGame.start,
        end: createdPickupGame.end,
        location: {
            id: "Yes",
            name: createdPickupGame.basketballFieldId,
            capacity: 5,
            yearOfCreation: "2020-10-15T18:30",
        },
        host: {
            id: host.id,
            name: host.name
        }
    }
}

async function addPlayerToPickupGame(parent, args){
    const player = await playerData.findById(args.playerID);
    const pickupGame = await pickupGameData.findById(args.pickupGameID);

    const createdPlayedGame = await playedGamesData.create({
        playerID: player.id,
        pickupGameID: pickupGame.id
    });
    player.playedGames.push(pickupGame.id);
    player.save();
    pickupGame.registeredPlayers.push(player.id);
    pickupGame.save();

    const host = await playerData.findById(pickupGame.host);
    let returnObject = {
        id: pickupGame.id,
        start: pickupGame.start,
        end: pickupGame.end,
        location: {
            id: "Yes",
            name: pickupGame.basketballFieldId,
            capacity: 5,
            yearOfCreation: "2020-10-15T18:30",
        },
        registeredPlayers : [],
        host: {
            id: host.id,
            name: host.name
        }
    };
    for (const p in pickupGame.registeredPlayers){
        const player = playerData.findById(pickupGame.registeredPlayers[p]);
        returnObject.registeredPlayers.push(player)
    }
    return returnObject
}


module.exports = {
    queries: {

    },
    types: {

    },
    mutations: {
        createPickupGame: createPickupGame,
        addPlayerToPickupGame: addPlayerToPickupGame
    }
};


