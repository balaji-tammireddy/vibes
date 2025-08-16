"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import CommentInput from "./CommentInput";
import Comment from "./Comment";

export default function PostCard({ post }: { post: any }) {
  const [liked, setLiked] = useState(post.isLikedByCurrentUser);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showAll, setShowAll] = useState(false);

  const handleLike = async () => {
    try {
      setLiked(!liked);
      setLikesCount((prev: number) => (liked ? prev - 1 : prev + 1));
      await axios.post("/api/post/like", { postId: post._id });
    } catch (err) {
      toast.error("Failed to like the post");
    }
  };

  const fetchComments = async (limit = 5) => {
    try {
      const res = await axios.get(`/api/post/comment/${post._id}?limit=${limit}`);
      setComments(res.data.comments);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = (newComment: any) => {
    setComments((prev) => [newComment, ...prev]);
    setCommentsCount((prev: number) => prev + 1);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    setCommentsCount((prev: number) => prev - 1);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg mb-6 w-full max-w-md shadow-lg">
      <div className="flex items-center gap-3 p-4">
        <Image
          src={post.userId?.profilePic || "/default-image.jpg"}
          alt="profile"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
        <p className="text-white font-semibold">{post.userId?.username}</p>
      </div>

      <div className="relative">
        <Image
          src={post.imageUrl}
          alt="post"
          width={400}
          height={400}
          className="w-full aspect-square object-cover"
        />
      </div>

      <div className="flex items-center gap-6 p-4 text-white text-sm border-b border-gray-800">
        <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors duration-200" onClick={handleLike}>
          <Heart className={`w-6 h-6 ${liked ? "text-red-500 fill-red-500" : "text-white"}`} />
          <span>{likesCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          <span>{commentsCount}</span>
        </div>
      </div>

      {post.caption && (
        <div className="px-4 py-2">
          <p className="text-white text-sm">
            <span className="font-semibold">{post.userId?.username}</span>{" "}
            <span className="text-gray-300 italic">{post.caption}</span>
          </p>
        </div>
      )}

      <div className="px-4 pb-2 space-y-2 text-sm max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            postAuthorId={post.userId?._id}
            onDelete={handleDeleteComment}
          />
        ))}

        {commentsCount > comments.length && !showAll && (
          <button
            onClick={() => {
              setShowAll(true);
              fetchComments(100);
            }}
            className="text-blue-400 text-xs hover:text-blue-300 cursor-pointer transition-colors duration-200"
          >
            See more comments
          </button>
        )}
      </div>
      <div className="px-4 pb-4 pt-2 border-t border-gray-800">
        <CommentInput postId={post._id} onCommentAdded={handleAddComment} />
      </div>
    </div>
  );
}