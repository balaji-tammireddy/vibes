"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Home, Search } from "lucide-react";
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

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden md:pl-16">
          <div className="flex-1 flex justify-center items-center">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="flex flex-col md:flex-row min-h-screen bg-black text-white md:pl-16">
        <main className="flex-1 flex flex-col items-center pt-4 md:pt-6 pb-20 md:pb-6 px-4">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">No posts yet</h3>
              <p className="text-sm text-center mb-4">
                Follow some users to see their posts in your feed
              </p>
              <Link 
                href="/search"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Search className="w-4 h-4" />
                Discover People
              </Link>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </main>
      </div>
    </>
  );
}