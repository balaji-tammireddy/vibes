import { connect } from "@/dbSetup/dbSetup";
import Post from "@/models/post";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    await connect();
    const { username } = params;

    const user = await User.findOne({ username });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("Fetch posts error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
