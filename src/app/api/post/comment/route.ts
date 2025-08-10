import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Post from "@/models/post";
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { postId, text } = await req.json();
    if (!postId || !text) {
      return NextResponse.json({ message: "Post ID and comment text are required" }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const newComment = await Comment.create({
      userId,
      postId,
      text,
    });

    post.comments.push(newComment._id);
    await post.save();

    return NextResponse.json({ message: "Comment added", comment: newComment });
  } catch (error) {
    console.error("Add comment error:", error);
    return NextResponse.json({ message: "Failed to add comment" }, { status: 500 });
  }
}
