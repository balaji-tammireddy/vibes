// /api/post/feed/route.ts

import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbSetup/dbSetup";
import Post from "@/models/post";
import User from "@/models/user";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connect();

    const userId = await getDataFromToken();

    const userObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

    const currentUser = await User.findById(userObjectId);

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const visibleUserIds = [...currentUser.following, userObjectId];

    const posts = await Post.find({ userId: { $in: visibleUserIds } })
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.error("Feed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}