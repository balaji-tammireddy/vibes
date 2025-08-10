"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
  X,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
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
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
        setEditCaption(fetchedPost.caption);
        setImagePreview(null);
        setEditImage(null);
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

  const handlePostUpdate = (updated: Partial<PostDetail>) => {
    if (!post) return;
    const newPost = { ...post, ...updated };
    setPost(newPost);
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

  const handleEdit = async () => {
    try {
      setUploadingImage(true);
      let imageUrl = post?.imageUrl;

      if (editImage) {
        const formData = new FormData();
        formData.append("image", editImage);
        formData.append("caption", "temp");
        const uploadRes = await axios.post("/api/post/upload", formData);
        imageUrl = uploadRes.data.post.imageUrl;
      }

      await axios.put(`/api/post/edit/${postId}`, {
        caption: editCaption,
        imageUrl,
      });

      const updatedPost = {
        ...post!,
        caption: editCaption,
        imageUrl: imageUrl || post!.imageUrl,
      };

      setPost(updatedPost);
      onPostUpdate?.(updatedPost);
      setIsEditing(false);
      setShowDropdown(false);
      setEditImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("Failed to update post");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditCaption(post?.caption || "");
    setEditImage(null);
    setImagePreview(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  };

  const isOwnPost = post && currentUserId && post.userId._id === currentUserId;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        onClick={() => {
          if (post) onPostUpdate?.(post);
          onClose();
        }}
        className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="bg-black text-white rounded-lg max-w-6xl max-h-[90vh] w-full flex overflow-hidden relative">
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
            {/* Left Image */}
            <div className="w-3/5 bg-black flex items-center justify-center">
              <Image
                src={post.imageUrl}
                alt="Post image"
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Right Panel */}
            <div className="w-2/5 flex flex-col border-l border-gray-800">
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
                      className="p-1 hover:bg-gray-700 rounded-full"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 top-8 bg-white text-black border rounded shadow-lg py-1 min-w-[120px] z-10">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Caption or Edit */}
              <div className="p-4 border-b border-gray-800">
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="w-full p-3 border rounded-md resize-none focus:outline-none text-black"
                      rows={3}
                      placeholder="Write a caption..."
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleEdit}
                        size="sm"
                        disabled={uploadingImage}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        variant="outline"
                        size="sm"
                        disabled={uploadingImage}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{post.caption}</p>
                )}
              </div>

              {/* Comments */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex items-start gap-3">
                      <Image
                        src={
                          comment.userId.profilePic || "/default-image.jpg"
                        }
                        alt={comment.userId.username}
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
                    className="flex items-center gap-1"
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
