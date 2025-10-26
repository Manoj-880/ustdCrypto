const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    quantity: { 
        type: Number, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "user", 
        required: true 
    },
    activeWalleteId: {
        type: String,
        required: true,
    },
    userWalletId: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["deposit", "withdraw", "claimed_profit", "transfer", "ADMIN_ADD", "TRANSFER_OUT", "TRANSFER_IN", "WITHDRAWAL_REQUEST"],
        default: "deposit"
    },
    status: {
        type: String,
        enum: ["completed", "pending", "failed"],
        default: "completed"
    },
    description: {
        type: String,
        default: ""
    },
    fee: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("transactions", transactionSchema);