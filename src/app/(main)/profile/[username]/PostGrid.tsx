"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

export default function PostGrid({ posts, onPostClick }: any) {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4">
      {Array.isArray(posts) &&
        posts.map((post: any) => (
          <div
            key={post._id}
            className="relative cursor-pointer group"
            onClick={() => onPostClick(post)}
          >
            <Image
              src={post.imageUrl}
              alt="post"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center gap-4 text-white font-semibold text-sm">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
