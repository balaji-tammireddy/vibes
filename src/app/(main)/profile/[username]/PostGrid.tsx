"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

type Post = {
  _id: string;
  imageUrl: string;
  likesCount: number;     // ✅ updated name
  commentsCount: number;  // ✅ updated name
};

type PostGridProps = {
  posts: Post[];
  onPostClick: (post: Post) => void;
};

export default function PostGrid({ posts, onPostClick }: PostGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
      {posts.map((post) => (
        <div
          key={post._id}
          className="relative group cursor-pointer aspect-square overflow-hidden"
          onClick={() => onPostClick(post)}
        >
          <Image
            src={post.imageUrl}
            alt="Post"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center gap-4 text-white font-semibold text-sm sm:text-md">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{post.likesCount ?? 0}</span> {/* ✅ corrected */}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentsCount ?? 0}</span> {/* ✅ corrected */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
