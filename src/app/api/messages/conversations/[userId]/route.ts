import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import message from "@/models/message";
import mongoose from "mongoose";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connect();

    const currentUserId = await getDataFromToken();
    const { userId: otherUserId } = await params;

    if (!otherUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await message.deleteMany({
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
    });

    return NextResponse.json({
      success: true,
      message: "Conversation deleted successfully"
    });
  } catch (error: any) {
    console.error("Delete conversation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}