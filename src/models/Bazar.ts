import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBazar extends Document {
  amount: number;
  description?: string;
  paidById?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BazarSchema: Schema<IBazar> = new Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    paidById: { type: Schema.Types.ObjectId, ref: "Member" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Bazar: Model<IBazar> =
  mongoose.models.Bazar || mongoose.model<IBazar>("Bazar", BazarSchema);
