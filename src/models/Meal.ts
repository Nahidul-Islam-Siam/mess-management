import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMeal extends Document {
  memberId: mongoose.Types.ObjectId;
  date: Date;
  breakfast: boolean;
  dinner: boolean;
  createdAt: Date;
}

const MealSchema: Schema<IMeal> = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    date: { type: Date, required: true },
    breakfast: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Meal: Model<IMeal> =
  mongoose.models.Meal || mongoose.model<IMeal>("Meal", MealSchema);
