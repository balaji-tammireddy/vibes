"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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

      // If image removed by user
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
        <label className="block text-sm font-medium">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-white bg-black file:bg-gray-800 file:text-white file:border file:border-gray-700 file:rounded file:px-3 file:py-1"
        />
        <p className="text-xs text-gray-400">
          Leave empty to keep current profile picture
        </p>

        <div className="mt-2 flex items-center gap-4">
          <Image
            src={
              profilePicPreview && profilePicPreview.trim() !== ""
                ? profilePicPreview
                : "/default-image.jpg"
            }
            alt="Profile Preview"
            width={100}
            height={100}
            className="rounded-full border border-gray-700 object-cover"
          />
          {profilePicPreview && (
            <Button
              type="button"
              onClick={handleRemoveImage}
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-900/10"
            >
              Remove Image
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Username</label>
        <Input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Bio</label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="Write something about yourself..."
          className="bg-black text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => router.back()}
          variant="outline"
          className="flex-1 border-gray-700 text-white hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-white text-black hover:bg-gray-200"
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