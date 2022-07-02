const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    access_token: {
        type: String,
        require: true,
    },
    userid: {
        type: String,
        require: true
    }
});

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;