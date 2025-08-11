import { connect } from "@/dbSetup/dbSetup";
import Post from "@/models/post";
import Comment from "@/models/comment";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context : { params: { postId: string } }) {
  try {
    await connect();
    const userId = await getDataFromToken();
    const { postId } = context.params;

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    if (!post.userId.equals(userId)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Post.findByIdAndDelete(postId);
    return NextResponse.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Delete post error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    await connect();
    const { postId } = await params;
    const currentUserId = await getDataFromToken();

    const post = await Post.findById(postId)
      .populate("userId", "username name profilePic")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "username profilePicture",
        },
      })
      .exec();

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const likesCount = post.likes.length;
    const isLikedByCurrentUser = currentUserId ? post.likes.includes(currentUserId) : false;
    const commentsCount = post.comments.length;

    const enrichedPost = {
      ...post.toObject(),
      likesCount,
      commentsCount,
      isLikedByCurrentUser,
    };

    return NextResponse.json({ post: enrichedPost }, { status: 200 });
  } catch (error) {
    console.error("Fetch post details error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}