const pickupGameData = require('../data/db').PickupGame;
const playerData = require('../data/db').Player;
const playedGamesData = require('../data/db').PlayedGames;
const basketballFieldService = require('../services/basketballFieldService');
const playerResolver = require("./playerResolver")
const errors = require("../errors");


const MINLENGTH = 300000;
const MAXLENGTH = 7200000

async function createPickupGame(parent, args){

    await validatePickupGame(args["input"])

    let newPickupGame = await pickupGameData.create(args["input"]);
    newPickupGame.registeredPlayers.push(args["input"]["hostId"]);
    newPickupGame.save();
    let playedGame = {
        playerID: args["input"]["hostId"],
        pickupGameID : newPickupGame.id
    }
    await playedGamesData.create(playedGame)

    return newPickupGame
}

async function validatePickupGame(input){
    const location = await basketballFieldService.getBasketballFieldById("", input["basketballFieldId"])
    if (location === null) {
        throw new errors.NotFoundError()
    }
    const pickupGames = await getPickupGamesByLocationId(input["basketballFieldId"]);
    console.log("right before get player")
    const host = await playerResolver.getPlayerById(input["hostId"])
    console.log("right after get player")

    if (host === null){
        throw new errors.NotFoundError()
    }

    const start_date = new Date(input["start"])
    const end_date = new Date(input["end"])
    console.log(end_date - start_date)

    if(end_date - start_date <= MINLENGTH || end_date - start_date >= MAXLENGTH ){
        throw new errors.DurationNotAllowedError;
    }
    if(start_date < Date.now()){
        throw new errors.TimeHasPassedError;
    }
    if(start_date > end_date){
        throw new errors.MixedDatesError;
    }

    for(let game in pickupGames){
        if(end_date >= pickupGames[game].start && start_date <= pickupGames[game].end ){
            throw new errors.PickupGameOverlapError;
        }
    }
    if(location["status"] === 'CLOSED'){
        throw new errors.BasketballFieldClosedError;
    }
}

async function addPlayerToPickupGame(parent, args){

    let pickupGame = await pickupGameData.findOne({_id: args['input']["pickupGameId"], deleted: false});

    await validateAddPlayerToPickupGame(pickupGame, args["input"]["playerId"])

    pickupGame.registeredPlayers.push(args["input"]["playerId"]);
    pickupGame.save();
    return pickupGame
}

async function validateAddPlayerToPickupGame(pickupGame, playerId){
    if (pickupGame === null){
        throw new errors.NotFoundError()
    }
    if (pickupGame.registeredPlayers.includes(playerId)) {
        throw new errors.PlayerAlreadyRegisteredError()
    }
    console.log(pickupGame.registeredPlayers.length)


    const location = await basketballFieldService.getBasketballFieldById("", pickupGame["basketballFieldId"])
    console.log(location)
    if (pickupGame.registeredPlayers.length + 1 > location.capacity){
        throw new errors.PickupGameExceedMaximumError()
    }
}

async function getPlayedGames(parent){
    let playedArr = [];
    let pickupGame;
    for (let gameId in parent.playedGames) {
        pickupGame = pickupGameData.findOne({_id: parent.playedGames[gameId], deleted: false});
        playedArr.push(pickupGame)
    }
    return playedArr
}

async function getPickupGamesByLocationId(locationId){
    return pickupGameData.find({basketballFieldId : locationId})
}

async function allPickupGames(){
    return pickupGameData.find({deleted:false})
}

async function getPickupGameById(parent, args){
    let pickupGame = await pickupGameData.findOne({_id: args["id"], deleted:false})
    if (pickupGame === null) {
        throw new errors.NotFoundError()
    }
    return pickupGame
}

async function removePlayerFromPickupGame(parent, args){
    let pickupGame = await pickupGameData.findOne({_id: args["input"]["pickupGameId"], deleted: false});

    await validateRemovePlayerFromPickupGame(pickupGame, args["input"]["playerId"]);

    pickupGame.registeredPlayers.splice(
        pickupGame.registeredPlayers.indexOf(args["input"]["playerId"])
    );
    pickupGame.save();
    return true

}

async function validateRemovePlayerFromPickupGame(pickupGame, playerId){
    if (pickupGame === null){
        throw new errors.NotFoundError()
    }
    if(pickupGame.start < Date.now()){
        throw new errors.TimeHasPassedError;
    }
    if (!pickupGame.registeredPlayers.includes(playerId)) {
        throw new errors.NotFoundError()
    }

}

async function deletePickupGame(parent, args){
    console.log(args)
    let game = await pickupGameData.findOne({_id: args, deleted:false});
    if (game === null){
        throw new errors.NotFoundError();
    }
    game.deleted = true;
    game.save();
    return true;
}



module.exports = {
    queries: {
        allPickupGames: allPickupGames,
        pickupGame: getPickupGameById
    },
    types: {

    },
    mutations: {
        createPickupGame: createPickupGame,
        addPlayerToPickupGame: addPlayerToPickupGame,
        removePlayerFromPickupGame: removePlayerFromPickupGame,
        removePickupGame: deletePickupGame
    },
    getPlayedGames: getPlayedGames,
    getPickupGamesByLocationId: getPickupGamesByLocationId,
    allPickupGames: allPickupGames,
    deletePickupGame: deletePickupGame




};


