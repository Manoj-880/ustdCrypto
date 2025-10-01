const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lockinPlansSchema = new Schema({
  planName: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("LockinPlans", lockinPlansSchema);
