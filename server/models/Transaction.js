const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    action: { type: String, required: true },
    amount: { type: String, required: true },
    description: { type: String, required: true },
    acc_from: { type: String, required: true },
    acc_to: { type: String },
    bank_name_to: { type: String },
    name_to: { type: String },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
});
TransactionSchema.pre('save', (next) => {
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});
const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;