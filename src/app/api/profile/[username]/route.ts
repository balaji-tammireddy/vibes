import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connect } from "@/dbSetup/dbSetup";
import User from "@/models/user";
import mongoose from "mongoose";

interface JwtPayload {
  id?: string;
  userId?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    await connect();
    
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    let currentUserId = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        currentUserId = decoded.id || decoded.userId;
      }
    } catch (error) {
      console.log("Authentication error in profile:", error);
    }

    console.log("Profile request for:", username, "Current user:", currentUserId);

    const userAggregation = await User.aggregate([
      {
        $match: { username: username }
      },
      {
        $addFields: {
          followersCount: { $size: "$followers" },
          followingCount: { $size: "$following" },
          isFollowing: currentUserId ? {
            $in: [{ $toObjectId: currentUserId }, "$followers"]
          } : false
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          name: 1,
          bio: 1,
          profilePic: 1,
          followersCount: 1,
          followingCount: 1,
          isFollowing: 1,
          createdAt: 1
        }
      }
    ]);

    if (!userAggregation || userAggregation.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = userAggregation[0];

    console.log("Profile data:", {
      username: user.username,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      isFollowing: user.isFollowing
    });

    return NextResponse.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to get user profile" },
      { status: 500 }
    );
  }
}