import { connect } from "@/dbSetup/dbSetup";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { username: string } }) {
  try {
    await connect();
    const { username } = params;

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
