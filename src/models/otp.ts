import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    name: { type: String },
    username: { type: String },
    hashedPassword: { type: String },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const OTPModel = mongoose.models.otps || mongoose.model("otps", otpSchema);
export default OTPModel;
