import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbSetup/dbSetup";
import User from "@/models/user";

export async function GET() {
  try {
    await connect();
    const userId = await getDataFromToken();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await User.findById(userId).select("_id username");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ userId: user._id, username: user.username });
  } catch (err) {
    console.error("Auth/me error:", err);
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}
