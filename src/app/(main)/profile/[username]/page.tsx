"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navigation from "@/app/(main)/components/Navigation";
import PostGrid from "./PostGrid";

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
  likeCount: number;
  commentCount: number;
};

export default function ProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`/api/profile/${username}`),
          axios.get(`/api/profile/${username}/posts`),
        ]);
        setUser(userRes.data.user);
        setPosts(postsRes.data.posts); // No mapping or patching needed
      } catch (err) {
        console.error("Failed to load profile data:", err);
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

  return (
    <div className="flex">
      <Navigation />

      <div className="flex-1 p-4 text-white">
        {user && (
          <div className="max-w-4xl mx-auto w-full">
            {/* Responsive layout */}
            <div className="pl-0 md:pl-50 flex flex-col md:flex-row md:items-start md:gap-12 w-full">
              {/* Left side: Profile pic + bio */}
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

              {/* Right side: Name, stats, buttons */}
              <div className="flex flex-col items-center md:items-start md:w-2/3 gap-4 mt-6 md:mt-0">
                {/* Username and Name */}
                <div className="text-center md:text-left">
                  <p className="text-xl font-bold">{user.username}</p>
                  <p className="text-md text-gray-400">{user.name}</p>
                </div>

                {/* Stats */}
                <div className="flex md:justify-between justify-center gap-8 w-full">
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
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto mt-4">
                  <Button
                    onClick={() => router.push("/edit-profile")}
                    variant="outline"
                    className="w-full md:w-auto text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full md:w-auto text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="w-full border-gray-700 my-6" />

            {/* User posts */}
            {posts.length > 0 ? (
              <PostGrid
                posts={posts}
                onPostClick={(post) => {
                  console.log("Post clicked", post);
                }}
              />
            ) : (
              <p className="text-center text-gray-400">No posts yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
