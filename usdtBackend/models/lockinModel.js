const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lockinSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    // Store plan details directly instead of referencing
    planId: {
      type: Schema.Types.ObjectId,
      ref: "LockinPlans",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    planDuration: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    referralBonus: {
      type: Number,
      required: true,
      default: 0,
    },
    planDescription: {
      type: String,
      required: false,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lockin", lockinSchema);
