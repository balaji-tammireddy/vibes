import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import message from "@/models/message";
import mongoose from "mongoose";

export async function POST(
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
    const result = await message.updateMany(
      {
        senderId: new mongoose.Types.ObjectId(otherUserId),
        receiverId: new mongoose.Types.ObjectId(currentUserId),
        read: false,
      },
      { read: true }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (error: any) {
    console.error("Mark as read error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}