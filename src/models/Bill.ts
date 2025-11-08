import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBill extends Document {
  month: number;
  year: number;
  gas: number;
  current: number;
  wifi: number;
  createdAt: Date;
}

const BillSchema: Schema<IBill> = new Schema(
  {
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    gas: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
    wifi: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Bill: Model<IBill> =
  mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema);
