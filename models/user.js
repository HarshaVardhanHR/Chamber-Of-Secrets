const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    contact: {
        type: Number
    },
    college: {
        type: String
    },
    level: {
        type: Number,
        default: 1
    },
    franchise:{
        type: String
    },
    player1:{
        type: String
    },
    player2:{
        type: String
    },
    player3:{
        type: String
    },
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date}

});

module.exports = mongoose.model("User", userSchema);