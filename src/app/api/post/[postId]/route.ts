import { connect } from "@/dbSetup/dbSetup";
import Post from "@/models/post";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    await connect();
    const userId = await getDataFromToken();
    const { postId } = params;

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
