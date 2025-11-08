import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMember extends Document {
  name: string;
  phone?: string;
  active: boolean;
  khalakhaFee: number;
  createdAt: Date;
}

const MemberSchema: Schema<IMember> = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    active: { type: Boolean, default: true },
    khalakhaFee: { type: Number, default: 700 },
  },
  { timestamps: true }
);

export const Member: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);
