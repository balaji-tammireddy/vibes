import { connect } from "@/dbSetup/dbSetup";
import Comment from "@/models/comment";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    await connect();

    const postId = params.postId;
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5");

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "username name profilePic");

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json({ message: "Failed to fetch comments" }, { status: 500 });
  }
}
