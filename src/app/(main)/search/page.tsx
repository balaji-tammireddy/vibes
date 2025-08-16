"use client";

import { useEffect, useState } from "react";
import Navigation from "@/app/(main)/components/Navigation";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import { SearchProvider } from "./components/SearchContext";
import axios from "axios";

export default function SearchPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const { userId } = res.data;
        setCurrentUserId(userId);
      } catch (error) {
        console.error("Failed to get current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
        <div className="w-full md:w-64 border-b border-gray-800 md:border-b-0">
          <Navigation />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SearchProvider>
      <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
        <div className="w-full md:w-20 border-b border-gray-800 md:border-b-0">
          <Navigation />
        </div>
        <div className="flex-1 p-4 flex flex-col items-center">
          <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2 text-white">Discover People</h1>
              <p className="text-gray-400">Find and connect with other users</p>
            </div>
            
            <div className="mb-8">
              <SearchBar />
            </div>
            
            <SearchResults currentUserId={currentUserId || undefined} />
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}