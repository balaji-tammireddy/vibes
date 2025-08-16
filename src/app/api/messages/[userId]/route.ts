import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import message from "@/models/message";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connect();

    const currentUserId = await getDataFromToken();
    const { userId: otherUserId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    if (!otherUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const messages = await message
      .find({
        $or: [
          {
            senderId: new mongoose.Types.ObjectId(currentUserId),
            receiverId: new mongoose.Types.ObjectId(otherUserId),
          },
          {
            senderId: new mongoose.Types.ObjectId(otherUserId),
            receiverId: new mongoose.Types.ObjectId(currentUserId),
          },
        ],
      })
      .populate("senderId", "username name profilePic")
      .populate("receiverId", "username name profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    await message.updateMany(
      {
        senderId: new mongoose.Types.ObjectId(otherUserId),
        receiverId: new mongoose.Types.ObjectId(currentUserId),
        read: false,
      },
      { read: true }
    );

    return NextResponse.json({
      success: true,
      messages: messages.reverse(),
      hasMore: messages.length === limit,
      page,
    });
  } catch (error: any) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}