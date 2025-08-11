import { connect } from "@/dbSetup/dbSetup";
import User from "@/models/user";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    await connect();
    const userId = await getDataFromToken();
    const body = await req.json();
    const { username, name, bio, profilePic } = body;

    if (!username || !name) {
      return NextResponse.json({ message: "Username and name are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      return NextResponse.json({ message: "Username already taken" }, { status: 409 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, name, bio, profilePic },
      { new: true }
    ).select("-password");

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error("Edit profile error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
