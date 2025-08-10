import { connect } from "@/dbSetup/dbSetup";
import Comment from "@/models/comment";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    await connect();

    const { postId } = params;

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .populate("userId", "username name profilePic");

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json({ message: "Failed to fetch comments" }, { status: 500 });
  }
}
