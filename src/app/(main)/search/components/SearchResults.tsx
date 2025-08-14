"use client";

import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import UserCard from "./UserCard";
import { useSearch } from "./SearchContext";
import axios from "axios";

interface SearchResultsProps {
  currentUserId?: string;
}

export default function SearchResults({ currentUserId }: SearchResultsProps) {
  const { users } = useSearch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId) {
      const fetchCurrentUser = async () => {
        try {
          const res = await axios.get("/api/auth/me");
        } catch (error) {
          console.error("Failed to get current user:", error);
        }
      };
      fetchCurrentUser();
    }
  }, [currentUserId]);

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Search className="w-16 h-16 mb-4 text-gray-600" />
        <h3 className="text-lg font-medium mb-2">Start typing to search</h3>
        <p className="text-sm text-center">
          Search for users by their username or name
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6 text-gray-300">
        <Users className="w-5 h-5" />
        <h2 className="text-lg font-semibold">
          {users.length} user{users.length !== 1 ? 's' : ''} found
        </h2>
      </div>
      
      <div className="space-y-4">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}