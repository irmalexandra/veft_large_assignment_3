const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;

module.exports = new Schema({

    start: {type: Date, require: true},
    end: {type: Date, require: true},
    basketballFieldId: {type: String, require: true},
    host: {type: mongoose.ObjectId, require: true},
    registeredPlayers: [{type: mongoose.ObjectId}]

});
