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

// Follow a user
export async function POST(request: NextRequest) {
  console.log("POST /api/follow called"); // Debug log
  
  try {
    await connect();
    console.log("Database connected"); // Debug log

    // Get target user ID from request body
    const body = await request.json();
    const { userId: targetUserId } = body;
    console.log("Target user ID:", targetUserId); // Debug log

    if (!targetUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get current user from JWT
    const cookieStore = await cookies(); // ✅ Fixed: await cookies() directly
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("No token found"); // Debug log
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const currentUserId = decoded.id || decoded.userId; // ✅ Consistent JWT field handling
    console.log("Current user ID:", currentUserId); // Debug log

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Validate user IDs
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }

    // Prevent self-following
    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already following
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    }

    const isAlreadyFollowing = currentUser.following.some(
      (id: any) => id.toString() === targetUserId
    );
    
    if (isAlreadyFollowing) {
      return NextResponse.json(
        { error: "Already following this user" },
        { status: 400 }
      );
    }

    // Update both users
    await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: new mongoose.Types.ObjectId(targetUserId) } }
    );

    await User.findByIdAndUpdate(
      targetUserId,
      { $addToSet: { followers: new mongoose.Types.ObjectId(currentUserId) } }
    );

    // Get updated counts
    const updatedTargetUser = await User.findById(targetUserId);
    const updatedCurrentUser = await User.findById(currentUserId);

    console.log("Follow successful"); // Debug log

    return NextResponse.json({
      success: true,
      message: "Successfully followed user",
      isFollowing: true,
      targetUser: {
        followersCount: updatedTargetUser?.followers.length || 0,
        followingCount: updatedTargetUser?.following.length || 0,
      },
      currentUser: {
        followersCount: updatedCurrentUser?.followers.length || 0,
        followingCount: updatedCurrentUser?.following.length || 0,
      }
    });

  } catch (error) {
    console.error("Follow user error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}

// Unfollow a user
export async function DELETE(request: NextRequest) {
  console.log("DELETE /api/follow called"); // Debug log
  
  try {
    await connect();

    // Get target user ID from request body
    const body = await request.json();
    const { userId: targetUserId } = body;
    console.log("Target user ID for unfollow:", targetUserId); // Debug log

    if (!targetUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get current user from JWT
    const cookieStore = await cookies(); // ✅ Fixed: await cookies() directly
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const currentUserId = decoded.id || decoded.userId; // ✅ Consistent JWT field handling

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Validate user IDs
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if currently following
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    }

    const isFollowing = currentUser.following.some(
      (id: any) => id.toString() === targetUserId
    );
    
    if (!isFollowing) {
      return NextResponse.json(
        { error: "Not following this user" },
        { status: 400 }
      );
    }

    // Update both users
    await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: new mongoose.Types.ObjectId(targetUserId) } }
    );

    await User.findByIdAndUpdate(
      targetUserId,
      { $pull: { followers: new mongoose.Types.ObjectId(currentUserId) } }
    );

    // Get updated counts
    const updatedTargetUser = await User.findById(targetUserId);
    const updatedCurrentUser = await User.findById(currentUserId);

    console.log("Unfollow successful"); // Debug log

    return NextResponse.json({
      success: true,
      message: "Successfully unfollowed user",
      isFollowing: false,
      targetUser: {
        followersCount: updatedTargetUser?.followers.length || 0,
        followingCount: updatedTargetUser?.following.length || 0,
      },
      currentUser: {
        followersCount: updatedCurrentUser?.followers.length || 0,
        followingCount: updatedCurrentUser?.following.length || 0,
      }
    });

  } catch (error) {
    console.error("Unfollow user error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}