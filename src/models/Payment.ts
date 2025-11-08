import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  memberId: mongoose.Types.ObjectId;
  amount: number;
  description?: string;
  createdAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
