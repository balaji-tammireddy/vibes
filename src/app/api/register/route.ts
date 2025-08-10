  import { connect } from "@/dbSetup/dbSetup";
  import User from "@/models/user";
  import OTP from "@/models/otp";
  import { generateOTP, sendOTPEmail } from "@/helpers/otp";
  import { hash } from "bcryptjs";

  export async function POST(req: Request) {
    try {
      await connect();
    const { name, username, email, password } = await req.json();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);
    const otp = generateOTP();

    await OTP.findOneAndDelete({ email });

    await OTP.create({
      email,
      otp,
      name,
      username,
      hashedPassword,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await sendOTPEmail(email, otp);

    return Response.json({ message: "OTP sent successfully" });
    } catch (error: any) {
      return Response.json({ error: "Failed to register user." }, { status: 500 });
    }
  }