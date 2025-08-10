import { connect } from "@/dbSetup/dbSetup";
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { postId: string } }) {
  try {
    await connect();

    const postId = context.params.postId; 
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5");

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching comments" }, { status: 500 });
  }
}
