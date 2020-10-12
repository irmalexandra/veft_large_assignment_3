const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;

module.exports = new Schema({

    playerID: {type: mongoose.ObjectId, require: true},
    pickupGameID: {type: mongoose.ObjectId, require: true}

});