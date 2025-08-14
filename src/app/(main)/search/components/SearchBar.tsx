"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { useSearch } from "./SearchContext";

interface SearchBarProps {
  onSearchStart?: () => void;
  onSearchEnd?: () => void;
}

export default function SearchBar({ onSearchStart, onSearchEnd }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { setUsers } = useSearch();

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (query.trim().length > 0) {
        await performSearch(query.trim());
      } else {
        setUsers([]);
      }
    }, 300); 

    return () => clearTimeout(delayedSearch);
  }, [query, setUsers]);

  const performSearch = async (searchQuery: string) => {
    try {
      setIsSearching(true);
      onSearchStart?.();
      
      const response = await axios.get(`/api/search/users?query=${encodeURIComponent(searchQuery)}`);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Search failed:", error);
      setUsers([]);
    } finally {
      setIsSearching(false);
      onSearchEnd?.();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
            isSearching ? 'text-blue-400 animate-pulse' : 'text-gray-400'
          }`} 
        />
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 
                     focus:ring-1 focus:ring-blue-500 transition-all duration-200"
        />
      </div>
      {query && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          {isSearching && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      )}
    </div>
  );
}