"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function UploadForm() {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);

    try {
      // For new posts, always use FormData
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", caption || "");

      await axios.post("/api/post/upload", formData);

      toast.success("Post uploaded successfully!");
      router.push("/home");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black text-white border border-gray-800 rounded-md shadow-lg p-6 w-full max-w-md space-y-4"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-white bg-black file:bg-gray-800 file:text-white file:border file:border-gray-700 file:rounded file:px-3 file:py-1"
          required
        />
        {imagePreview && (
          <div className="mt-2">
            <Image
              src={imagePreview}
              alt="Preview"
              width={500}
              height={500}
              className="rounded border border-gray-700"
            />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Caption</label>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write your caption here..."
          rows={3}
          className="bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black hover:bg-gray-200"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Posting...
          </>
        ) : (
          "Post"
        )}
      </Button>
    </form>
  );
}