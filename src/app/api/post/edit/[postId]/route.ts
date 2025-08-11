import { connect } from "@/dbSetup/dbSetup";
import Post from "@/models/post";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(req: NextRequest, {params}: { params: { postId: string } }) {
  try {
    await connect();
    const userId = await getDataFromToken();
    const { postId } = await params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    const body = await req.json();
    const { caption, imageUrl } = body;

    if (caption === undefined && imageUrl === undefined) {
      return NextResponse.json({ 
        message: "At least one field (caption or imageUrl) must be provided" 
      }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (!post.userId.equals(userId)) {
      return NextResponse.json({ message: "Forbidden: You can only edit your own posts" }, { status: 403 });
    }

    if (caption !== undefined) {
      post.caption = caption;
    }
    if (imageUrl !== undefined) {
      post.imageUrl = imageUrl;
    }
    
    post.updatedAt = new Date();
    
    await post.save();

    return NextResponse.json({ 
      message: "Post updated successfully", 
      post: {
        _id: post._id,
        caption: post.caption,
        imageUrl: post.imageUrl,
        updatedAt: post.updatedAt
      }
    });
  } catch (err) {
    console.error("Update post error:", err);
    
    if (err instanceof mongoose.Error.CastError) {
      return NextResponse.json({ message: "Invalid post ID format" }, { status: 400 });
    }
    
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}