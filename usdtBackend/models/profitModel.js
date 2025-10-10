const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  claimedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["PENDING", "CLAIMED"],
    default: "PENDING",
  },
  transactionId: {
    type: String,
    required: true,
  },
  lastClaimedTime: {
    type: Date,
    default: null,
  },
  nextClaimTime: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("Profit", profitSchema);
