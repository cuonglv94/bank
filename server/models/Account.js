const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    account_no: {
        type: String,
        require: true,
    },
    bank_name: {
        type: String,
        require: true
    },
    total_balance: {
        type: String,
        require: true
    },
    userid: {
        type: String,
        require: true
    }
});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;