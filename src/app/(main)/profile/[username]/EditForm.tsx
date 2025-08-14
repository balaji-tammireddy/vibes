"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type EditFormProps = {
  postId: string;
};

export default function EditForm({ postId }: EditFormProps) {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setFetchLoading(true);
        const response = await axios.get(`/api/post/${postId}`);
        const post = response.data.post;

        setCaption(post.caption || "");
        setCurrentImageUrl(post.imageUrl);
        setImagePreview(post.imageUrl);
      } catch (error) {
        console.error("Failed to fetch post data:", error);
        toast.error("Failed to load post data");
        router.push("/home");
      } finally {
        setFetchLoading(false);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagePreview) {
      toast.error("Please keep or select an image");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = currentImageUrl;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        // Use new image upload route
        const uploadRes = await axios.post("/api/image/upload", formData);
        imageUrl = uploadRes.data.imageUrl;
      }

      await axios.put(`/api/post/edit/${postId}`, {
        caption,
        imageUrl,
      });

      toast.success("Post updated successfully!");
      router.push("/home");
    } catch (error) {
      toast.error("Failed to update post");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="bg-black text-white border border-gray-800 rounded-md shadow-lg p-6 w-full max-w-md space-y-4">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

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
        <p className="text-xs text-gray-400">
          Leave empty to keep current image
        </p>
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

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => router.back()}
          variant="outline"
          className="flex-1 border-gray-700 text-white hover:bg-gray-800 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-white text-black hover:bg-gray-200 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}