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
        ref: "User", 
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
    }
});

module.exports = mongoose.model("transactions", transactionSchema);