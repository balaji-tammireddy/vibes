"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navigation from "@/app/(main)/components/Navigation";
import PostGrid from "./PostGrid";
import PostDetailModal from "./PostDetailModal";

type User = {
  _id: string;
  username: string;
  name: string;
  bio?: string;
  profilePicture?: string;
};

type Post = {
  _id: string;
  imageUrl: string;
  likesCount: number;
  commentsCount: number;
};

export default function ProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const { userId } = res.data;
        setCurrentUserId(userId);
      } catch (error) {
        console.error("Failed to get current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, postsRes] = await Promise.all([
          axios.get(`/api/profile/${username}`),
          axios.get(`/api/profile/${username}/posts`),
        ]);
        setUser(userRes.data.user);

        const postsData = postsRes.data.posts || [];
        const mappedPosts = postsData.map((post: any) => ({
          ...post,
          likesCount: post.likeCount || post.likesCount || 0,
          commentsCount: post.commentCount || post.commentsCount || 0,
        }));
        setPosts(mappedPosts);
      } catch (err) {
        console.error("Failed to load profile data:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchData();
  }, [username]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPostId(post._id);
  };

  const handleCloseModal = () => {
    setSelectedPostId(null);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const handlePostUpdate = (updatedPost: Partial<Post>) => {
    if (!updatedPost._id) return;
    setPosts((prev) =>
      prev.map((p) =>
        p._id === updatedPost._id ? { ...p, ...updatedPost } : p
      )
    );
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Navigation />
      <div className="flex-1 p-4 text-white">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : user ? (
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-start md:gap-12 w-full">
              <div className="flex flex-col items-center md:items-start md:w-1/3 gap-4">
                <Image
                  src={user.profilePicture || "/default-image.jpg"}
                  alt="profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
                <p className="text-sm italic text-gray-400 text-center md:text-left">
                  {user.bio || "No bio added"}
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start md:w-2/3 gap-4 mt-6 md:mt-0">
                <div className="text-center md:text-left">
                  <p className="text-xl font-bold">{user.username}</p>
                  <p className="text-md text-gray-400">{user.name}</p>
                </div>
                {/* Stats */}
                <div className="flex justify-center md:justify-between gap-8 w-full flex-wrap">
                  <div className="text-center">
                    <p className="font-bold text-lg">{posts.length}</p>
                    <p className="text-sm text-gray-400">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">0</p>
                    <p className="text-sm text-gray-400">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">0</p>
                    <p className="text-sm text-gray-400">Following</p>
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <Button
                    onClick={() => router.push("/edit-profile")}
                    variant="outline"
                    className="w-full cursor-pointer sm:w-auto text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full cursor-pointer sm:w-auto text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
            <hr className="w-full border-gray-700 my-6" />
            {posts.length > 0 ? (
              <PostGrid posts={posts} onPostClick={handlePostClick} />
            ) : (
              <p className="text-center text-gray-400">No posts yet.</p>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-gray-400">User not found</p>
          </div>
        )}
      </div>
      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          isOpen={!!selectedPostId}
          onClose={handleCloseModal}
          onPostDeleted={handlePostDeleted}
          onPostUpdate={handlePostUpdate}
          currentUserId={currentUserId ?? undefined}
        />
      )}
    </div>
  );
}
