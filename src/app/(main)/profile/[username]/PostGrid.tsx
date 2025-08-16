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
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
      {posts.map((post) => (
        <div
          key={`${post._id}-${post.likesCount}-${post.commentsCount}`}
          className="relative cursor-pointer group rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-200"
          onClick={() => onPostClick(post)}
        >
          {/* Image */}
          <div className="aspect-square relative">
            <Image
              src={post.imageUrl}
              alt="Post"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-2">
                  <Heart className="w-5 h-5 fill-white" />
                  <span className="font-semibold">{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-2">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span className="font-semibold">{post.commentsCount}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle gradient at bottom for better text visibility */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      ))}
    </div>
  );
}