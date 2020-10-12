const pickupGameData = require('../data/db').PickupGame;
const playerData = require('../data/db').Player;
const playedGamesData = require('../data/db').PlayedGames;
const basketballFieldService = require('../services/basketballFieldService');

async function createPickupGame(parent, args){
    const host = await playerData.findById(args.input.hostId);
    const field = await basketballFieldService.getBasketballFieldById( "" , args.input.basketballFieldId);
    const newPickupGame = {
        start: args.input.start,
        end: args.input.end,
        basketballFieldId: args.input.basketballFieldId,
        hostId: args.input.hostId
    };
    const createdPickupGame = await pickupGameData.create(newPickupGame);

    const createdPlayedGame = await playedGamesData.create({
        playerID: host.id,
        pickupGameID: createdPickupGame.id
    });

    createdPickupGame.registeredPlayers.push(host);
    await createdPickupGame.save();
    host.playedGames.push(createdPickupGame.id);
    await host.save();

    playerArr = [];
    for (let i = 0; i < createdPickupGame.registeredPlayers.length; i++){
        playerArr.push(playerData.findById(createdPickupGame.registeredPlayers[i]))
    }

    return {
        id: createdPickupGame.id,
        start: createdPickupGame.start,
        end: createdPickupGame.end,
        location: field,
        host: host,
        registeredPlayers: playerArr
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

    const host = await playerData.findById(pickupGame.hostId);
    const field = await basketballFieldService.getBasketballFieldById( "" , pickupGame.basketballFieldId);

    playerArr = [];
    for (let i = 0; i < pickupGame.registeredPlayers.length; i++){
        playerArr.push(playerData.findById(pickupGame.registeredPlayers[i]))
    }

    return {
        id: pickupGame.id,
        start: pickupGame.start,
        end: pickupGame.end,
        location: field,
        host: host,
        registeredPlayers: playerArr
    }
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


