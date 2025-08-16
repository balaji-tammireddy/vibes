"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
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

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(currentImageUrl);
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
    <div className="flex items-center justify-center h-40">
      <div className="flex items-center gap-2 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span>Loading post data...</span>
      </div>
    </div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-white">Image</label>
        
        {!imageFile ? (
          <div className="space-y-3">
            {imagePreview && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-700">
                <Image
                  src={imagePreview}
                  alt="Current image"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg bg-gray-800">
              <div className="flex flex-col items-center justify-center pt-3 pb-4">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-400 mb-2">
                  {imagePreview ? "Change image" : "Select an image"}
                </p>
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            {imagePreview && (
              <p className="text-xs text-gray-400 text-center">
                Leave unchanged to keep current image
              </p>
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-700">
              <Image
                src={imagePreview!}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full transition-colors duration-200"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Caption</label>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write your caption here..."
          rows={4}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-none"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Optional</span>
          <span>{caption.length}/2200</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border-gray-600 transition-colors duration-200"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className={`flex-1 font-medium transition-all duration-200 ${
            loading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
          }`}
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