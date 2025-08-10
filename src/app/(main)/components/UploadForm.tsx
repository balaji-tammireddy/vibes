"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function UploadForm() {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const postId = searchParams.get("postId");
  const initialCaption = searchParams.get("caption") || "";
  const initialImageUrl = searchParams.get("imageUrl") || "";

  const [caption, setCaption] = useState(initialCaption);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl
  );
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setCaption(initialCaption);
    setImagePreview(initialImageUrl);
  }, [initialCaption, initialImageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile && !imagePreview) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("caption", caption || "temp");
        const uploadRes = await axios.post("/api/post/upload", formData);
        imageUrl = uploadRes.data.post.imageUrl;
      }

      if (isEdit && postId) {
        await axios.put(`/api/post/edit/${postId}`, {
          caption,
          imageUrl,
        });

        toast.success("Post edited successfully!");
      } else {
        await axios.post("/api/post/create", {
          caption,
          imageUrl,
        });

        toast.success("Post uploaded successfully!");
      }

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
            {isEdit ? "Saving..." : "Posting..."}
          </>
        ) : isEdit ? (
          "Edit"
        ) : (
          "Post"
        )}
      </Button>
    </form>
  );
}