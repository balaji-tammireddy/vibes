import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbSetup/dbSetup";
import PostModel from "@/models/post";
import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const userId = await getDataFromToken();
    const formData = await req.formData();

    const file: File | null = formData.get("image") as unknown as File;
    const caption = formData.get("caption") as string;

    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cloudinaryResponse = await uploadImageToCloudinary(buffer, "vibes");

    const newPost = await PostModel.create({
      userId,
      caption,
      imageUrl: cloudinaryResponse.secure_url,
    });

    return NextResponse.json({ message: "Post uploaded successfully", post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error("Post upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}