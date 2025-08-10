"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

type Post = {
  _id: string;
  imageUrl: string;
  likesCount: number;
  commentsCount: number;
};

type Props = {
  posts: Post[];
  onPostClick: (post: Post) => void;
};

export default function PostGrid({ posts, onPostClick }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4">
      {posts.map((post) => (
        <div
          key={`${post._id}-${post.likesCount}-${post.commentsCount}`}
          className="relative cursor-pointer group"
          onClick={() => onPostClick(post)}
        >
          <Image
            src={post.imageUrl}
            alt="Post"
            width={300}
            height={300}
            className="w-full h-auto object-cover aspect-square"
          />
          <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center gap-4 text-white font-semibold text-sm sm:text-md">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{post.likesCount ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentsCount ?? 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
