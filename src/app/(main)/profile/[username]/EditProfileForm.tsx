"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Upload, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EditProfileFormProps = {
  username: string;
};

export default function EditProfileForm({ username }: EditProfileFormProps) {
  const [name, setName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [currentPicUrl, setCurrentPicUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setFetchLoading(true);
        const res = await axios.get(`/api/profile/${username}`);
        const user = res.data.user;

        setName(user.name || "");
        setNewUsername(user.username || "");
        setBio(user.bio || "");
        setCurrentPicUrl(user.profilePic || "");
        setProfilePicPreview(user.profilePic || "");
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load profile");
        router.push("/home");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUser();
  }, [username, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfilePicFile(null);
    setProfilePicPreview(null);
  };

  const clearImage = () => {
    setProfilePicFile(null);
    setProfilePicPreview(currentPicUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUsername) {
      toast.error("Username is required");
      return;
    }

    setLoading(true);

    try {
      let profilePicUrl = profilePicPreview;

      if (profilePicFile) {
        const formData = new FormData();
        formData.append("image", profilePicFile);
        const uploadRes = await axios.post("/api/image/upload", formData);
        profilePicUrl = uploadRes.data.imageUrl;
      }

      if (!profilePicPreview) {
        profilePicUrl = "";
      }

      await axios.put(`/api/profile/edit`, {
        name,
        username: newUsername,
        bio,
        profilePic: profilePicUrl,
      });

      toast.success("Profile updated successfully!");
      router.refresh();
      router.push(`/profile/${newUsername}`);
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>Loading profile data...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-white">Profile Picture</label>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={
                profilePicPreview && profilePicPreview.trim() !== ""
                  ? profilePicPreview
                  : "/default-image.jpg"
              }
              alt="Profile Preview"
              width={80}
              height={80}
              className="rounded-full border border-gray-700 object-cover"
            />
            {profilePicFile && (
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 p-1 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full transition-colors duration-200"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            {!profilePicFile ? (
              <div className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-600 border-dashed rounded-lg bg-gray-800">
                <div className="flex flex-col items-center justify-center">
                  <User className="w-6 h-6 mb-1 text-gray-400" />
                  <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-lg cursor-pointer transition-colors duration-200">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-sm text-green-400">New photo selected</p>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-xs text-gray-400">
          JPG, PNG or GIF. Max size 10MB
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Username</label>
        <Input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          placeholder="Enter your username"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          placeholder="Enter your name"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Bio</label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Write something about yourself..."
          className="w-full bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-none"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Optional</span>
          <span>{bio.length}/500</span>
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