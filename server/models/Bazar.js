const mongoose = require("mongoose");

const BazarSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    paidById: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Bazar || mongoose.model("Bazar", BazarSchema);

