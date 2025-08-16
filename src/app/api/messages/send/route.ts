import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import message from "@/models/message";
import user from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const senderId = await getDataFromToken();
    const { receiverId, text } = await request.json();

    if (!receiverId || !text?.trim()) {
      return NextResponse.json(
        { error: "Receiver ID and message text are required" },
        { status: 400 }
      );
    }

    const receiver = await user.findById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    const newMessage = new message({
      senderId,
      receiverId,
      text: text.trim()
    });

    await newMessage.save();

    await newMessage.populate('senderId', 'username name profilePic');
    await newMessage.populate('receiverId', 'username name profilePic');

    return NextResponse.json({
      success: true,
      message: newMessage
    });

  } catch (error: any) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}