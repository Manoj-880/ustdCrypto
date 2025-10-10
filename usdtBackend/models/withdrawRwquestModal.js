const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const withdrawRequestSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  userBalance: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
    default: "PENDING",
  },
  remarks: {
    type: String,
    default: null,
  },
  transactionId: {
    type: String,
    default: null,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
    default: null,
  },
  rejectedAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("withdrawRequest", withdrawRequestSchema);
