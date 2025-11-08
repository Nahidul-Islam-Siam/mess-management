const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    date: { type: Date, required: true },
    breakfast: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for faster queries
MealSchema.index({ memberId: 1, date: 1 });

module.exports = mongoose.models.Meal || mongoose.model("Meal", MealSchema);

