"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

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
    const fetchMe = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setCurrentUserId(res.data._id);
      } catch {
        // fallback or leave blank
      }
    };
    fetchMe();
  }, []);

  const canDelete =
    currentUserId === comment.userId._id || currentUserId === postAuthorId;

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
        <span className="text-sm font-semibold">{comment.userId?.username}</span>
        <span className="text-sm">{comment.text}</span>
      </div>

      {canDelete && (
        <Trash2
          onClick={() => onDelete(comment._id)}
          className="w-4 h-4 text-red-500 cursor-pointer"
        />
      )}
    </div>
  );
}
