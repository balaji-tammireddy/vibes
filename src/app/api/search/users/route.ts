import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connect } from "@/dbSetup/dbSetup";
import User from "@/models/user";

interface JwtPayload {
  id?: string;
  userId?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ users: [] });
    }

    await connect();

    let currentUserId = null;
    try {
      const cookieStore = await cookies(); 
      const token = cookieStore.get("token")?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        currentUserId = decoded.id || decoded.userId;
      }
    } catch (error) {
      console.log("Authentication error in search:", error);
    }

    console.log("Current user ID in search:", currentUserId); 

    const searchRegex = new RegExp(query.trim(), "i");
    
    const users = await User.aggregate([
      {
        $match: {
          $or: [
            { username: { $regex: searchRegex } },
            { name: { $regex: searchRegex } }
          ]
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          as: "posts"
        }
      },
      {
        $addFields: {
          followersCount: { $size: "$followers" },
          followingCount: { $size: "$following" },
          postsCount: { $size: "$posts" },
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
          postsCount: 1,
          isFollowing: 1
        }
      },
      {
        $sort: { username: 1 }
      },
      {
        $limit: 50
      }
    ]);

    console.log("Search results with isFollowing:", users.map(u => ({ username: u.username, isFollowing: u.isFollowing }))); // Debug log

    return NextResponse.json({
      users,
      total: users.length
    });

  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}