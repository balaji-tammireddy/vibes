"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function PostCard({ post }: { post: any }) {
  const [liked, setLiked] = useState(post.isLikedByCurrentUser);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount] = useState(post.commentsCount); 

  const handleLike = async () => {
    try {
      setLiked(!liked);
      setLikesCount((prev: number) => (liked ? prev - 1 : prev + 1));
      await axios.post("/api/post/like", { postId: post._id });
    } catch (err) {
      toast.error("Failed to like the post");
    }
  };

  return (
    <div className="bg-black border border-zinc-800 rounded-md mb-6 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        {post.userId?.profilePicture ? (
          <Image
            src={post.userId.profilePicture}
            alt="profile"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <Image
            src="/default-image.jpg"
            alt="default profile"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        )}

        <p className="text-white font-semibold">{post.userId?.username}</p>
      </div>

      {/* Post Image */}
      <Image
        src={post.imageUrl}
        alt="post"
        width={400}
        height={400}
        className="w-full aspect-square object-cover"
      />

      {/* Like & Comment Icons */}
      <div className="flex items-center gap-6 p-3 text-white text-sm">
        <div className="flex items-center gap-1 cursor-pointer" onClick={handleLike}>
          <Heart
            className={`w-6 h-6 ${liked ? "text-red-500 fill-red-500" : "text-white"}`}
          />
          <span>{likesCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-6 h-6" />
          <span>{commentsCount}</span>
        </div>
      </div>

      {/* Caption */}
      <div className="px-3 pb-4">
        <p className="text-white text-sm italic">
          <span className="font-semibold not-italic">{post.userId?.username}</span>{" "}
          {post.caption}
        </p>
      </div>
    </div>
  );
}