"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";
import PostCard from "../components/PostCard";
import { toast } from "sonner";

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get("/api/post/feed", {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (error) {
        toast.error("Failed to load feed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 flex flex-col items-center mt-4 md:mt-6 pb-20 md:pb-0">
        {loading ? (
          <p className="text-white text-sm">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-white text-sm">No posts to show</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </main>
    </div>
  );
}