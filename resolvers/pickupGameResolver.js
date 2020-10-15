const pickupGameData = require('../data/db').PickupGame;
const playerData = require('../data/db').Player;
const playedGamesData = require('../data/db').PlayedGames;
const basketballFieldService = require('../services/basketballFieldService');
const errors = require("../errors");

async function createPickupGame(parent, args){
    const location = await basketballFieldService.getBasketballFieldById("", args["input"]["basketballFieldId"])
    const pickupGames = await getPickupGamesByLocationId(args["input"]["basketballFieldId"]);
    const start_date = new Date(args["input"]["start"])
    const end_date = new Date(args["input"]["end"])
    console.log(end_date - start_date)

    if(end_date - start_date <= 300000 || end_date - start_date >= 7200000 ){
        throw new errors.DurationNotAllowedError;
    }
    if(start_date < Date.now()){
        throw new errors.TimeHasPassedError;
    }
    if(start_date > end_date){
        throw new errors.MixedDatesError;
    }

    for(game in pickupGames){
        if(end_date >= pickupGames[game].start && start_date <= pickupGames[game].end ){
            throw new errors.PickupGameOverlapError;
        }
        // console.log(pickupGames[game])
    }
    if(location["status"] === 'OPEN'){

        newPickupGame = await pickupGameData.create(args["input"]);
        newPickupGame.registeredPlayers.push(args["input"]["hostId"]);
        newPickupGame.save();
        return newPickupGame
    }else{
        throw new errors.BasketballFieldClosedError;
    }

}

async function addPlayerToPickupGame(parent, args){
    pickupGame = await pickupGameData.findOne({_id: args["input"]["pickupGameId"], deleted:false});
    if (pickupGame !== null){
        pickupGame.registeredPlayers.push(args["input"]["playerId"]);
        pickupGame.save();
        return pickupGame
    }
    // TODO THROW ERROR
    return null
}

async function getPlayedGames(parent){
    playedArr = [];
    for (gameId in parent.playedGames){
        pickupGame = pickupGameData.findOne({_id: parent.playedGames[gameId], deleted:false});
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
    return pickupGameData.findOne({_id: args["id"], deleted:false})
}

async function removePlayerFromPickupGame(parent, args){
    pickupGame = await pickupGameData.findOne({_id: args["input"]["pickupGameId"], deleted:false});
    if (pickupGame !== null){
        if (pickupGame.registeredPlayers.includes(args["input"]["playerId"])) {
            pickupGame.registeredPlayers.splice(
                pickupGame.registeredPlayers.indexOf(args["input"]["playerId"])
            );
            pickupGame.save();
            return true
        }
    }
    // TODO THROW ERROR
    return false

}



async function deletePickupGame(parent, args){
    let game = await pickupGameData.findOne({_id: args["id"], deleted:false});
    if (game !== null){
        game.deleted = true;
        game.save();
        return true
    }
    // TODO THROW ERROR
    return false
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


};


