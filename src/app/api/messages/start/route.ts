import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import user from "@/models/user";
import message from "@/models/message";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const currentUserId = await getDataFromToken();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (currentUserId === userId) {
      return NextResponse.json(
        { error: "Cannot start conversation with yourself" },
        { status: 400 }
      );
    }

    const otherUser = await user.findById(userId).select('username name profilePic');
    if (!otherUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const existingMessage = await message.findOne({
      $or: [
        {
          senderId: new mongoose.Types.ObjectId(currentUserId),
          receiverId: new mongoose.Types.ObjectId(userId),
        },
        {
          senderId: new mongoose.Types.ObjectId(userId),
          receiverId: new mongoose.Types.ObjectId(currentUserId),
        },
      ],
    }).sort({ createdAt: -1 });

    const conversation = {
      _id: userId,
      otherUser: {
        _id: otherUser._id,
        username: otherUser.username,
        name: otherUser.name,
        profilePic: otherUser.profilePic
      },
      lastMessage: existingMessage ? {
        text: existingMessage.text,
        createdAt: existingMessage.createdAt,
        senderId: existingMessage.senderId
      } : null,
      unreadCount: 0
    };

    return NextResponse.json({
      success: true,
      conversation
    });

  } catch (error: any) {
    console.error("Start conversation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}