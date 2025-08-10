import { connect } from "@/dbSetup/dbSetup";
import message from "@/models/message";
import User from "@/models/user";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await connect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const token = await new SignJWT({ id: user._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return Response.json({ message: "Login successful" });
  } catch (error: any) {
    return Response.json({ error: "Failed to login user." }, { status: 500 });
  }
}