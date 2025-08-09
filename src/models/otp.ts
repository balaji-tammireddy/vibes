import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const otp = mongoose.models.otps || mongoose.model("otps", otpSchema);
export default otp;
