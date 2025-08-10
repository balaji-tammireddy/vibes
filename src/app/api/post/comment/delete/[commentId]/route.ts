import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Post from "@/models/post";
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_: NextRequest, context: { params: { commentId: string } }) {
  try {
    await connect();
    const userId = await getDataFromToken();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { commentId } = context.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });

    const post = await Post.findById(comment.postId);
    const isAuthorOrPostOwner = comment.userId.equals(userId) || post?.userId.equals(userId);
    if (!isAuthorOrPostOwner) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await Comment.findByIdAndDelete(commentId);

    if (post) {
      post.comments = post.comments?.filter((c: { toString: () => string; }) => c.toString() !== commentId);
      await post.save();
    }

    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json({ message: "Failed to delete comment" }, { status: 500 });
  }
}