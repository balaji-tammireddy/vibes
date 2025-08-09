import { NextResponse } from "next/server";
import { connect } from "@/dbSetup/dbSetup";
import OTPModel from "@/models/otp";
import User from "@/models/user";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connect();
    const { email, otp, newPassword } = await req.json();

    const otpDoc = await OTPModel.findOne({ email, otp, verified: true });
    if (!otpDoc) {
      return NextResponse.json({ message: "Invalid or unverified OTP" }, { status: 400 });
    }

    if (otpDoc.expiresAt < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    const hashedPassword = await hash(newPassword, 10);

    const user = await User.findOneAndUpdate({ email }, { password: hashedPassword });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await OTPModel.deleteOne({ _id: otpDoc._id });

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (error) {
    console.error("Forgot Password Reset error:", error);
    return NextResponse.json({ message: "Failed to reset password." }, { status: 500 });
  }
}
