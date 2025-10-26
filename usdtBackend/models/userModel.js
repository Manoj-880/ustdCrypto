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
    referralCode: {
        type: String,
        unique: true,
        sparse: true,
    },
    referredBy: {
        type: String, // stores referralCode of the referrer
        default: null,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("user", userSchema);