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
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-4">
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
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white font-semibold text-sm sm:text-lg">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{post.likesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{post.commentsCount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
