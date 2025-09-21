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
});

module.exports = mongoose.model("withdrawRequest", withdrawRequestSchema);
