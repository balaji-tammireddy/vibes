"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function Comment({
  comment,
  postAuthorId,
  onDelete,
}: {
  comment: any;
  postAuthorId: string;
  onDelete: (commentId: string) => void;
}) {
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setCurrentUserId(res.data.userId);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchCurrentUser();
  }, []);

  const canDelete = currentUserId === comment.userId._id || currentUserId === postAuthorId;

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/post/comment/delete/${comment._id}`);
      onDelete(comment._id);
      toast.success("Comment deleted");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete comment";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-between items-center text-white">
      <div className="flex gap-2 items-center">
        <Image
          src={comment.userId?.profilePic || "/default-image.jpg"}
          alt="profile"
          width={24}
          height={24}
          className="rounded-full object-cover"
        />
        <span className="text-sm font-semibold">
          {comment.userId?.username}
        </span>
        <span className="text-sm">{comment.text}</span>
      </div>

      {canDelete && (
        <Trash2
          onClick={handleDelete}
          className="w-4 h-4 text-red-500 cursor-pointer"
        />
      )}
    </div>
  );
}