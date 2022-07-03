const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    account_name: {
        type: String,
        require: true,
    },
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
});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;