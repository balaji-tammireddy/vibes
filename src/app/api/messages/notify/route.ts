import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbSetup/dbSetup";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const senderId = await getDataFromToken();
    const { receiverId, messageId } = await request.json();

    if (!receiverId || !messageId) {
      return NextResponse.json(
        { error: "Receiver ID and message ID are required" },
        { status: 400 }
      );
    }

    console.log(`New message notification: ${messageId} from ${senderId} to ${receiverId}`);

    return NextResponse.json({
      success: true,
      message: "Notification sent"
    });

  } catch (error: any) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}