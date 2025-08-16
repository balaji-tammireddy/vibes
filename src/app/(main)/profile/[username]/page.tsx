"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navigation from "@/app/(main)/components/Navigation";
import PostGrid from "./PostGrid";
import PostDetailModal from "./PostDetailModal";
import { toast } from "sonner";
import { UserPlus, UserMinus, Settings, LogOut } from "lucide-react";

type User = {
  _id: string;
  username: string;
  name: string;
  bio?: string;
  profilePic?: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
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
  const [isFollowLoading, setIsFollowLoading] = useState(false);

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
        
        const userData = userRes.data.user;
        setUser({
          ...userData,
          followersCount: userData.followersCount || 0,
          followingCount: userData.followingCount || 0,
          isFollowing: userData.isFollowing || false,
        });

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

  const handleFollowToggle = async () => {
    if (!currentUserId || !user) {
      toast.error("Please log in to follow users");
      return;
    }

    if (currentUserId === user._id) {
      toast.error("You cannot follow yourself");
      return;
    }

    try {
      setIsFollowLoading(true);
      
      if (user.isFollowing) {
        const response = await axios.delete(`/api/follow`, { 
          data: { userId: user._id },
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        setUser(prev => prev ? {
          ...prev,
          isFollowing: false,
          followersCount: response.data.targetUser.followersCount
        } : null);
        
        toast.success(`Unfollowed ${user.username}`);
      } else {
        const response = await axios.post(`/api/follow`, { 
          userId: user._id 
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        setUser(prev => prev ? {
          ...prev,
          isFollowing: true,
          followersCount: response.data.targetUser.followersCount
        } : null);
        
        toast.success(`Following ${user.username}`);
      }
    } catch (error: any) {
      console.error("Follow toggle failed:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.error || `Server error: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("Network error - please check your connection");
      } else {
        toast.error("Failed to update follow status");
      }
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      toast.success("Logout successful!");
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

  const isOwnProfile = currentUserId === user?._id;

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-6 text-white">
        {user ? (
          <>
            {/* Profile Header */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center md:items-start">
                  <Image
                    src={user.profilePic || "/default-image.jpg"}
                    alt="profile"
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-2 border-gray-700"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold text-white mb-1">{user.username}</h1>
                    <p className="text-gray-400">{user.name}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center mb-4 max-w-md">
                    <div className="text-center flex-1">
                      <p className="font-bold text-lg text-white">{posts.length}</p>
                      <p className="text-sm text-gray-400">Posts</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="font-bold text-lg text-white">{user.followersCount}</p>
                      <p className="text-sm text-gray-400">Followers</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="font-bold text-lg text-white">{user.followingCount}</p>
                      <p className="text-sm text-gray-400">Following</p>
                    </div>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="text-gray-300 mb-4 max-w-md">{user.bio}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                    {isOwnProfile ? (
                      <>
                        <Button
                          onClick={() => router.push(`/profile/${username}/edit-profile`)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button
                          onClick={handleLogout}
                          className="flex-1 bg-gray-700 hover:bg-red-600 text-white border-gray-600 transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Log Out
                        </Button>
                      </>
                    ) : (
                      currentUserId && (
                        <Button
                          onClick={handleFollowToggle}
                          disabled={isFollowLoading}
                          className={`flex-1 transition-colors duration-200 ${
                            user.isFollowing 
                              ? "bg-gray-700 hover:bg-red-600 text-white border-gray-600" 
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {isFollowLoading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <>
                              {user.isFollowing ? (
                                <>
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  Unfollow
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Follow
                                </>
                              )}
                            </>
                          )}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Posts ({posts.length})
              </h2>
              {posts.length > 0 ? (
                <PostGrid posts={posts} onPostClick={handlePostClick} />
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="text-center space-y-4">
                    {/* Camera Icon */}
                    <div className="w-20 h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-6">
                      <svg 
                        className="w-10 h-10 text-gray-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {isOwnProfile ? "No posts yet" : `${user.username} hasn't posted yet`}
                      </h3>
                      <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">
                        {isOwnProfile 
                          ? "Start sharing your moments! Your posts will appear here once you create them." 
                          : "When they share photos and videos, you'll see them here."
                        }
                      </p>
                    </div>
                    
                    {isOwnProfile && (
                      <div className="pt-4">
                        <Button
                          onClick={() => router.push("/upload")} // Adjust the route as needed
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                        >
                          Share your first post
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-12">
            <div className="text-center">
              <p className="text-gray-400 text-lg">User not found</p>
              <p className="text-gray-500 text-sm mt-2">The profile you're looking for doesn't exist</p>
            </div>
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
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