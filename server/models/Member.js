const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    active: { type: Boolean, default: true },
    khalakhaFee: { type: Number, default: 700 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Member || mongoose.model("Member", MemberSchema);

