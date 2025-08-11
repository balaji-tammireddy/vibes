import { connect } from "@/dbSetup/dbSetup";
import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    await connect();
    const { username } = await params;

    if (!username) {
      return NextResponse.json({ message: "Username is required" }, { status: 400 });
    }

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
