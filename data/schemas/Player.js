const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;

module.exports = new Schema({
    name: {type: String, require: true},
    playedGames: [{type: mongoose.ObjectId}]
});