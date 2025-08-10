import { connect } from "@/dbSetup/dbSetup";
import Post from "@/models/post";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { postId: string } }) {
  try {
    await connect();
    const userId = await getDataFromToken();
    const { postId } = params;
    const body = await req.json();

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    if (!post.userId.equals(userId)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { caption, image } = body;
    post.caption = caption || post.caption;
    post.image = image || post.image;
    await post.save();

    return NextResponse.json({ message: "Post updated", post });
  } catch (err) {
    console.error("Update post error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
