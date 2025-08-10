import { connect } from "@/dbSetup/dbSetup";
import User from "@/models/user";
import OTP from "@/models/otp";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await connect();
    const { email, otp } = await req.json();

    const otpDoc = await OTP.findOne({ email });
    if (!otpDoc || otpDoc.otp !== otp || otpDoc.expiresAt < Date.now()) {
      return Response.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const { name, username, hashedPassword } = otpDoc;

    const newUser = await User.create({ name, username, email, password: hashedPassword });
    await OTP.deleteOne({ email });

    const token = await new SignJWT({ id: newUser._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return Response.json({ message: "User verified and logged in" });
  } catch (error: any) {
    return Response.json({ error: "Failed to verify user." }, { status: 500 });
  }
}