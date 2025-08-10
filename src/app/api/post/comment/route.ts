import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Post from "@/models/post";
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const userId = await getDataFromToken();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { postId, text } = await req.json();
    if (!postId || !text) {
      return NextResponse.json({ message: "Post ID and text are required" }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    const newComment = await Comment.create({ postId, userId, text });

    if (!post.comments) post.comments = [];
    post.comments.push(newComment._id);
    await post.save();

    const populatedComment = await Comment.findById(newComment._id).populate("userId", "username profilePic");

    return NextResponse.json({ message: "Comment added", comment: populatedComment });
  } catch (err) {
    console.error("Add comment error:", err);
    return NextResponse.json({ message: "Failed to add comment" }, { status: 500 });
  }
}