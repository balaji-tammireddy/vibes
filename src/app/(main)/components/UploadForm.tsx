"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
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

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);

    try {
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
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Create New Post</h1>
        <p className="text-gray-400">Share a moment with your followers</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6 space-y-6"
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-white">Image</label>
          
          {!imagePreview ? (
            <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg bg-gray-800">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-400">
                  Select an image to upload
                </p>
                <p className="text-xs text-gray-400 mb-4">PNG, JPG, GIF up to 10MB</p>
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-700">
                <Image
                  src={imagePreview}
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
        <Button
          type="submit"
          disabled={loading || !imageFile}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
            loading || !imageFile
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            "Share Post"
          )}
        </Button>
      </form>
    </div>
  );
}