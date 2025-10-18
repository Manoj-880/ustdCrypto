const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const privacyPolicyModel = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    sections: [{
        type: {
            type: String,
            enum: ['paragraph', 'points'],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        points: [{
            type: String,
        }]
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model("privacyPolicy", privacyPolicyModel);
