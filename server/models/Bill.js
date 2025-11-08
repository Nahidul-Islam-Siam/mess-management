const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    gas: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
    wifi: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Unique index for month and year combination
BillSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.models.Bill || mongoose.model("Bill", BillSchema);

