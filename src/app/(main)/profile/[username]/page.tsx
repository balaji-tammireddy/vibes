// app/(main)/profile/[username]/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import PostGrid from "./PostGrid";
import Navigation from "@/app/(main)/components/Navigation";

interface UserType {
  username: string;
  name: string;
  bio?: string;
  profilePicture?: string;
  postsCount: number;
  followers: number;
  following: number;
}

interface PostType {
  _id: string;
  image: string;
  likes: number;
  comments: number;
}

export default function ProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState<UserType | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [profileRes, postsRes] = await Promise.all([
        axios.get(`/api/profile/${username}`),
        axios.get(`/api/profile/${username}/posts`),
      ]);

      setUser({
        ...profileRes.data.user,
        postsCount: postsRes.data.posts.length,
      });
      setPosts(postsRes.data.posts);
    };

    fetchData();
  }, [username]);

  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <div className="flex-1 px-4 md:px-8 py-8 text-white md:ml-20">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-12 mb-8">
          <div className="flex-shrink-0">
            <Image
              src={user.profilePicture || "/default-image.jpg"}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full object-cover w-28 h-28"
            />
          </div>
          <div className="flex-1 mt-4 md:mt-0">
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-gray-400">{user.name}</p>

            <div className="flex justify-between md:justify-start md:gap-8 mt-4 text-sm">
              <div className="text-center">
                <p className="font-semibold">{user.postsCount}</p>
                <p className="text-gray-400">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{user.followers}</p>
                <p className="text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{user.following}</p>
                <p className="text-gray-400">Following</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col md:flex-row gap-3 md:gap-4 md:items-center">
              <button className="bg-zinc-800 text-white px-4 py-2 rounded-md text-sm w-full md:w-auto text-center">
                Edit Profile
              </button>
              <button className="bg-zinc-800 text-white px-4 py-2 rounded-md text-sm w-full md:w-auto text-center">
                Log Out
              </button>
            </div>

            {user.bio && <p className="mt-4 text-gray-300">{user.bio}</p>}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-zinc-700 mb-6" />

        {/* Post Grid */}
        <PostGrid posts={posts} />
      </div>
    </div>
  );
}
