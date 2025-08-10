"use client";

import { useState } from "react";
import axios from "axios";

export default function EditProfileForm({ user }: any) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    profilePicture: user.profilePicture || "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await axios.put("/api/profile/update", formData);
    window.location.reload();
  };

  return editing ? (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        className="bg-zinc-800 text-white p-2 rounded"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
      />
      <input
        className="bg-zinc-800 text-white p-2 rounded"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        placeholder="Bio"
      />
      <input
        className="bg-zinc-800 text-white p-2 rounded"
        value={formData.profilePicture}
        onChange={(e) =>
          setFormData({ ...formData, profilePicture: e.target.value })
        }
        placeholder="Profile Picture URL"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  ) : (
    <button
      onClick={() => setEditing(true)}
      className="border border-zinc-700 px-4 py-2 rounded-md hover:bg-zinc-800"
    >
      Edit Profile
    </button>
  );
}
