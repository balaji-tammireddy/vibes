import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Post from "@/models/post";
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    await connect();

    const userId = await getDataFromToken();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const post = await Post.findById(params.postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.user.toString() !== userId.toString()) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Comment.deleteMany({ postId: post._id });

    await Post.findByIdAndDelete(post._id);

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Post deletion error:", error);
    return NextResponse.json({ message: "Failed to delete post" }, { status: 500 });
  }
}
