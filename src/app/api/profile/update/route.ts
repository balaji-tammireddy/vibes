import { connect } from "@/dbSetup/dbSetup";
import User from "@/models/user";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    await connect();
    const userId = await getDataFromToken();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, username, bio, profileImage } = body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, username, bio, profileImage },
      { new: true }
    ).select("-password");

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
