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
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
    } catch (error: any) {
      console.error("Failed to delete post:", error.response?.data || error.message);
      alert("Failed to delete post: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = () => {
    if (!post) return;
    router.push(`/profile/${post.userId.username}/post/edit/${post._id}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) setShowDropdown(false);
    };
    
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showDropdown]);

  const isOwnPost = post && currentUserId && post.userId._id === currentUserId;
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 px-2 sm:px-6">
      {/* Close Button */}
      <button
        onClick={() => {
          if (post) onPostUpdate?.(post);
          onClose();
        }}
        className="absolute top-4 right-4 z-50 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors duration-200"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Modal Content */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
        {loading ? (
          <div className="w-full h-96 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading post...</span>
            </div>
          </div>
        ) : !post ? (
          <div className="w-full h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">Post not found</p>
              <p className="text-gray-500 text-sm">This post may have been deleted</p>
            </div>
          </div>
        ) : (
          <>
            {/* Image Section */}
            <div className="w-full md:w-3/5 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              <Image
                src={post.imageUrl}
                alt="Post image"
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain rounded-l-lg"
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-2/5 flex flex-col border-t md:border-t-0 md:border-l border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center gap-3">
                  <Image
                    src={post.userId.profilePic || "/default-image.jpg"}
                    alt={post.userId.username}
                    width={32}
                    height={32}
                    className="rounded-full object-cover border border-gray-600"
                  />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {post.userId.username}
                    </p>
                    <p className="text-xs text-gray-400">{post.userId.name}</p>
                  </div>
                </div>
                {isOwnPost && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(!showDropdown);
                      }}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 top-12 bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-2 min-w-[140px] z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit();
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" /> Edit Post
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="p-4 border-b border-gray-700">
                  <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                    {post.caption}
                  </p>
                </div>
              )}

              {/* Comments */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex items-start gap-3">
                      <Image
                        src={comment.userId.profilePic || "/default-image.jpg"}
                        alt={comment.userId.username || "User"}
                        width={28}
                        height={28}
                        className="rounded-full object-cover border border-gray-600"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-800 rounded-lg p-3">
                          <p className="text-sm text-white">
                            <span className="font-semibold text-blue-400 mr-2">
                              {comment.userId.username}
                            </span>
                            {comment.text}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 ml-3">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No comments yet</p>
                    <p className="text-xs text-gray-500">Be the first to comment!</p>
                  </div>
                )}
              </div>

              {/* Stats & Actions */}
              <div className="border-t border-gray-700 p-4 bg-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleLikeToggle}
                      className="flex items-center gap-2 hover:bg-gray-700 rounded-full px-3 py-2 transition-colors duration-200"
                    >
                      <Heart
                        className={`w-6 h-6 transition-colors duration-200 ${
                          isLiked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
                        }`}
                      />
                      <span className="text-sm text-white font-medium">{likesCount}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-white font-medium">{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}