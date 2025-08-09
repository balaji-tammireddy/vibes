import { NextResponse } from "next/server";
import { connect } from "@/dbSetup/dbSetup";
import OTPModel from "@/models/otp";

export async function POST(req: Request) {
  try {
    await connect();
    const { email, otp } = await req.json();

    const otpDoc = await OTPModel.findOne({ email, otp });
    if (!otpDoc) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (otpDoc.expiresAt < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    if (otpDoc.verified) {
      return NextResponse.json({ message: "OTP already verified" }, { status: 400 });
    }

    otpDoc.verified = true;
    await otpDoc.save();

    return NextResponse.json({ message: "OTP verified" }, { status: 200 });
  } catch (error) {
    console.error("Forgot Password Verify OTP error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
