import { connect } from "@/dbSetup/dbSetup";
import Post from "@/models/post";
import User from "@/models/user";
import Comment from "@/models/comment";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params} : { params: { username: string } }) {
  try {
    await connect();

    const { username } = await params;
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const posts = await Post.find({ userId: user._id })
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });

    const currentUserId = await getDataFromToken();

    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const likesCount = post.likes.length;
        const isLikedByCurrentUser = post.likes.includes(currentUserId);

        const commentsCount = await Comment.countDocuments({ postId: post._id });

        return {
          ...post.toObject(),
          likesCount,
          commentsCount,
          isLikedByCurrentUser,
        };
      })
    );

    return NextResponse.json({ posts: enrichedPosts }, { status: 200 });
  } catch (err) {
    console.error("Fetch posts error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
