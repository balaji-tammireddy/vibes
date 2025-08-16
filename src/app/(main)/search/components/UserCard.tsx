// app/(main)/search/components/UserCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, UserPlus, UserMinus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSearch } from "./SearchContext";

interface User {
  _id: string;
  username: string;
  name: string;
  bio?: string;
  profilePic?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
}

interface UserCardProps {
  user: User;
  currentUserId?: string;
}

export default function UserCard({ user, currentUserId }: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const { updateUserFollowStatus } = useSearch();
  const router = useRouter();

  const handleFollowToggle = async () => {
    if (!currentUserId) {
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
        await axios.delete(`/api/follow`, { 
          data: { userId: user._id }
        });
        updateUserFollowStatus(user._id, false);
        toast.success(`Unfollowed ${user.username}`);
      } else {
        await axios.post(`/api/follow`, { 
          userId: user._id 
        });
        updateUserFollowStatus(user._id, true);
        toast.success(`Following ${user.username}`);
      }
    } catch (error: any) {
      console.error("Follow toggle failed:", error);
      toast.error(error.response?.data?.error || "Failed to update follow status");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!currentUserId) {
      toast.error("Please log in to send messages");
      return;
    }

    if (currentUserId === user._id) {
      toast.error("You cannot message yourself");
      return;
    }

    try {
      setIsMessageLoading(true);
      
      // Start conversation
      await axios.post("/api/messages/start", { userId: user._id });
      
      // Navigate to messages with the user
      router.push(`/messages?user=${user._id}`);
      
      toast.success(`Started conversation with ${user.username}`);
    } catch (error: any) {
      console.error("Start conversation failed:", error);
      toast.error(error.response?.data?.error || "Failed to start conversation");
    } finally {
      setIsMessageLoading(false);
    }
  };

  const handleProfileClick = () => {
    router.push(`/profile/${user.username}`);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-all duration-200">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div 
            className="cursor-pointer flex-shrink-0"
            onClick={handleProfileClick}
          >
            <Image
              src={user.profilePic || "/default-image.jpg"}
              alt={`${user.username}'s profile`}
              width={50}
              height={50}
              className="rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all duration-200"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div 
              className="cursor-pointer hover:text-blue-400 transition-colors duration-200"
              onClick={handleProfileClick}
            >
              <h3 className="font-semibold text-white truncate">{user.username}</h3>
              <p className="text-sm text-gray-400 truncate">{user.name}</p>
            </div>
            {user.bio && !isExpanded && (
              <p className="text-xs text-gray-500 truncate mt-1">{user.bio}</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {currentUserId && currentUserId !== user._id && (
              <>
                {/* Message Button */}
                <Button
                  onClick={handleMessage}
                  disabled={isMessageLoading}
                  size="sm"
                  variant="outline"
                  className="cursor-pointer min-w-[80px] text-blue-400 border-blue-400 hover:bg-blue-500 hover:text-white"
                >
                  {isMessageLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Message
                    </>
                  )}
                </Button>

                {/* Follow Button */}
                <Button
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                  size="sm"
                  variant={user.isFollowing ? "outline" : "default"}
                  className={`cursor-pointer min-w-[80px] ${
                    user.isFollowing 
                      ? "text-red-400 border-red-400 hover:bg-red-500 hover:text-white" 
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isFollowLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {user.isFollowing ? (
                        <>
                          <UserMinus className="w-3 h-3 mr-1" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3 mr-1" />
                          Follow
                        </>
                      )}
                    </>
                  )}
                </Button>
              </>
            )}
            
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="sm"
              className="text-gray-400 cursor-pointer hover:text-white hover:bg-gray-700"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-700 bg-gray-750">
          <div className="pt-4 space-y-3">
            {user.bio && (
              <div>
                <p className="text-sm text-gray-300">{user.bio}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-white">{user.postsCount}</p>
                  <p className="text-gray-400">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-white">{user.followersCount}</p>
                  <p className="text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-white">{user.followingCount}</p>
                  <p className="text-gray-400">Following</p>
                </div>
              </div>
              
              <Button
                onClick={handleProfileClick}
                variant="outline"
                size="sm"
                className="text-blue-400 cursor-pointer border-blue-400 hover:bg-blue-500 hover:text-white"
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}