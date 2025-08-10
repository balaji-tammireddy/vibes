import { NextResponse } from "next/server";
import { connect } from "@/dbSetup/dbSetup";
import OTPModel from "@/models/otp";
import User from "@/models/user";
import { sendOTPEmail } from "@/helpers/otp";

export async function POST(req: Request) {
  try {
    await connect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await OTPModel.deleteMany({ email });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTPModel.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
    });

    await sendOTPEmail(email, otpCode);

    return NextResponse.json({ message: "OTP sent to your email" }, { status: 200 });
  } catch (error) {
    console.error("Forgot Password Send OTP error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
