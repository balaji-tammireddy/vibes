import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbSetup/dbSetup";
import Post from "@/models/post";
import User from "@/models/user";
import Comment from "@/models/comment";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connect();

    const userId = await getDataFromToken();
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const currentUser = await User.findById(userObjectId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const visibleUserIds = [...currentUser.following, userObjectId];

    const posts = await Post.find({ userId: { $in: visibleUserIds } })
      .populate("userId", "username profilePic")
      .sort({ createdAt: -1 });

    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const likesCount = post.likes.length;
        const isLikedByCurrentUser = post.likes.includes(userId);
        const commentsCount = await Comment.countDocuments({ postId: post._id });

        return {
          ...post.toObject(),
          likesCount,
          isLikedByCurrentUser,
          commentsCount,
        };
      })
    );

    return NextResponse.json(enrichedPosts, { status: 200 });
  } catch (error: any) {
    console.error("Feed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}