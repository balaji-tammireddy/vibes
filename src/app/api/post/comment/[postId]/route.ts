import { connect } from "@/dbSetup/dbSetup";
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await connect();

    const { postId } = await params; 

    const limitParam = req.nextUrl.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 5;

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "username profilePic");

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json(
      { error: "Error fetching comments" },
      { status: 500 }
    );
  }
}
