import { connect } from "@/dbSetup/dbSetup";
import Post from "@/models/post";
import Comment from "@/models/comment";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await connect();
    const userId = await getDataFromToken();
    const { postId } = await params;

    if (!postId) {
      return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (!post.userId || post.userId.toString() !== userId.toString()) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Comment.deleteMany({ postId });
    await Post.findByIdAndDelete(postId);

    return NextResponse.json({ message: "Post and its comments deleted successfully" });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
