const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    walletId: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: String,
        default: "0",
    },
    profit: {
        type: String,
        default: "0",
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("user", userSchema);