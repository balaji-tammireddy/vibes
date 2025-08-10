"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
  X,
  MoreHorizontal,
  Trash2,
  Heart,
  MessageCircle,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type User = {
  _id: string;
  username: string;
  name: string;
  profilePic?: string;
};

type Comment = {
  _id: string;
  text: string;
  userId: User;
  createdAt: string;
};

type PostDetail = {
  _id: string;
  imageUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
  userId: User;
  createdAt: string;
};

type PostDetailModalProps = {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onPostDeleted?: (postId: string) => void;
  onPostUpdate?: (post: Partial<PostDetail>) => void;
  currentUserId?: string;
};

export default function PostDetailModal({
  postId,
  isOpen,
  onClose,
  onPostDeleted,
  onPostUpdate,
  currentUserId,
}: PostDetailModalProps) {
  const router = useRouter();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!isOpen || !postId) return;

    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const [postRes, commentsRes] = await Promise.all([
          axios.get(`/api/post/${postId}`),
          axios.get(`/api/post/comment/${postId}?limit=20`),
        ]);
        const fetchedPost = postRes.data.post;

        setPost(fetchedPost);
        setComments(commentsRes.data.comments);
        setIsLiked(fetchedPost.isLikedByCurrentUser);
        setLikesCount(fetchedPost.likesCount);
      } catch (error) {
        console.error("Failed to fetch post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId, isOpen]);

  const handleLikeToggle = async () => {
    if (!post) return;

    const newLikeStatus = !isLiked;
    const newLikesCount = newLikeStatus ? likesCount + 1 : likesCount - 1;

    setIsLiked(newLikeStatus);
    setLikesCount(newLikesCount);
    setPost((prev) =>
      prev
        ? {
            ...prev,
            isLikedByCurrentUser: newLikeStatus,
            likesCount: newLikesCount,
          }
        : null
    );

    onPostUpdate?.({
      _id: post._id,
      isLikedByCurrentUser: newLikeStatus,
      likesCount: newLikesCount,
    });

    try {
      await axios.post("/api/post/like", { postId: post._id });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`/api/post/delete/${postId}`);
      onPostDeleted?.(postId);
      onClose();
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post");
    }
  };

  const handleEdit = () => {
    if (!post) return;
    router.push(
      `/upload?edit=true&postId=${post._id}&caption=${encodeURIComponent(
        post.caption
      )}&imageUrl=${encodeURIComponent(post.imageUrl)}`
    );
  };

  const isOwnPost = post && currentUserId && post.userId._id === currentUserId;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-2 sm:px-6">
      <button
        onClick={() => {
          if (post) onPostUpdate?.(post);
          onClose();
        }}
        className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
      >
        <X className="w-5 cursor-pointer h-5" />
      </button>

      <div className="bg-black text-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative">
        {loading ? (
          <div className="w-full h-96 flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : !post ? (
          <div className="w-full h-96 flex items-center justify-center">
            <p className="text-gray-400">Post not found</p>
          </div>
        ) : (
          <>
            {/* Image */}
            <div className="w-full md:w-3/5 bg-black flex items-center justify-center max-h-[400px] md:max-h-full">
              <Image
                src={post.imageUrl}
                alt="Post image"
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="w-full md:w-2/5 flex flex-col border-t md:border-t-0 md:border-l border-gray-800 max-h-[60vh] md:max-h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <Image
                    src={post.userId.profilePic || "/default-image.jpg"}
                    alt={post.userId.username}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="font-semibold text-sm">
                    {post.userId.username}
                  </span>
                </div>
                {isOwnPost && (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="p-1 cursor-pointer hover:bg-gray-700 rounded-full"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 top-8 bg-white text-black border rounded shadow-lg py-1 min-w-[120px] z-10">
                        <button
                          onClick={handleEdit}
                          className="flex items-center cursor-pointer gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex cursor-pointer items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="p-4 border-b border-gray-800">
                <p className="text-sm whitespace-pre-wrap">{post.caption}</p>
              </div>

              {/* Comments */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex items-start gap-3">
                      <Image
                        src={comment.userId.profilePic || "/default-image.jpg"}
                        alt={comment.userId.username || "User"}
                        width={24}
                        height={24}
                        className="rounded-full object-cover mt-1"
                      />
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold mr-2">
                            {comment.userId.username}
                          </span>
                          {comment.text}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No comments yet</p>
                )}
              </div>

              {/* Stats */}
              <div className="border-t border-gray-800 p-4 text-sm text-white flex flex-col gap-1">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLikeToggle}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isLiked ? "fill-red-500 text-red-500" : "text-white"
                      }`}
                    />
                    <span>{likesCount}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-5 h-5 text-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}