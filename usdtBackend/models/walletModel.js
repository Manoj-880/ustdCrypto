const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  walletId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
});

module.exports = mongoose.model("wallet", walletSchema);
