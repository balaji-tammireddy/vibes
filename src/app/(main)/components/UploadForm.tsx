"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Navigation from "@/app/(main)/components/Navigation";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      setLoading(true);
      await axios.post("/api/post/upload", formData, {
        withCredentials: true,
      });
      toast.success("Post uploaded successfully!");
      router.push("/home");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="hidden md:block w-64">
        <Navigation />
      </div>
      <div className="flex-1 flex justify-center items-start px-4 mt-10">
        <div className="max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            {/* Image Preview */}
            {file && (
              <div className="w-full aspect-square relative overflow-hidden rounded-md border border-gray-700">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* File Input */}
            <label htmlFor="file-upload" className="w-full">
              <div className="border border-gray-700 rounded-md py-2 px-4 text-center cursor-pointer hover:bg-gray-800 transition text-white">
                {file ? "Change Image" : "Choose Image"}
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            {/* Caption */}
            <Textarea
              placeholder="Write a caption..."
              className="resize-none text-white"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            {/* Post Button */}
            <Button
              onClick={handleUpload}
              className="w-full cursor-pointer"
              disabled={loading || !file}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
