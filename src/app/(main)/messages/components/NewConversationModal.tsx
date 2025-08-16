"use client";

import { useState, useEffect } from "react";
import { X, Search, MessageCircle } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { useMessages } from "./MessagesContext";

interface User {
  _id: string;
  username: string;
  name: string;
  profilePic?: string;
}

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  onConversationStart?: () => void; 
}

export default function NewConversationModal({ 
  isOpen, 
  onClose, 
  currentUserId,
  onConversationStart 
}: NewConversationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const { selectConversation, loadMessages } = useMessages();

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        await performSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    try {
      setIsSearching(true);
      const response = await axios.get(`/api/search/users?query=${encodeURIComponent(query)}`);
      
      const users = response.data.users || [];
      const filteredUsers = users.filter((user: User) => user._id !== currentUserId);
      
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const startConversation = async (user: User) => {
    if (!currentUserId) {
      toast.error("Please log in to start conversations");
      return;
    }

    try {
      setIsStarting(true);
      
      const response = await axios.post("/api/messages/start", { userId: user._id });
      const conversation = response.data.conversation;
      
      selectConversation(conversation);
      await loadMessages(user._id);
      
      toast.success(`Started conversation with ${user.name}`);
      onClose();
      
      onConversationStart?.();
    } catch (error: any) {
      console.error("Failed to start conversation:", error);
      toast.error(error.response?.data?.error || "Failed to start conversation");
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">New Message</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-700 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 
                       focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {isSearching ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-400">
              {searchQuery ? (
                <>
                  <Search className="w-12 h-12 mb-3 text-gray-600" />
                  <p className="text-sm text-center">
                    No users found for "{searchQuery}"
                  </p>
                </>
              ) : (
                <>
                  <MessageCircle className="w-12 h-12 mb-3 text-gray-600" />
                  <p className="text-sm text-center">
                    Search for people to start a conversation
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="p-2">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => startConversation(user)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                >
                  <Image
                    src={user.profilePic || "/default-image.jpg"}
                    alt={`${user.username}'s profile`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{user.name}</h3>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                  </div>
                  {isStarting && (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}