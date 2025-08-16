"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "@/app/(main)/components/Navigation";
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";
import { MessagesProvider, useMessages } from "./components/MessagesContext";

function MessagesContent({ currentUserId }: { currentUserId: string | null }) {
  const { currentConversation } = useMessages();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (currentConversation) {
      setShowChat(true);
    }
  }, [currentConversation]);

  const handleConversationSelect = () => {
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
  };

  return (
    <>
      <div className={`${showChat ? 'hidden md:block' : 'block'}`}>
        <Navigation />
      </div>
      
      <div className={`flex md:flex-row h-screen bg-black text-white overflow-hidden md:pl-16`}>
        <div className="flex-1 flex h-full">
          <div className="md:hidden w-full h-full">
            {showChat ? (
              <ChatWindow
                currentUserId={currentUserId || undefined}
                onBack={handleBackToList}
              />
            ) : (
              <div className="h-full pb-16">
                <ConversationList 
                  currentUserId={currentUserId || undefined}
                  onConversationSelect={handleConversationSelect}
                />
              </div>
            )}
          </div>
          <div className="hidden md:flex w-full h-full">
            {/* Conversations list */}
            <div className="w-80 border-r border-gray-700 h-full">
              <ConversationList 
                currentUserId={currentUserId || undefined}
                onConversationSelect={handleConversationSelect}
              />
            </div>
            <div className="flex-1 h-full">
              <ChatWindow
                currentUserId={currentUserId || undefined}
                onBack={handleBackToList}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function MessagesPage() {
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
      <div className="flex h-screen bg-black text-white">
        <div className="hidden md:block md:w-16 border-r border-gray-800">
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
    <MessagesProvider>
      <MessagesContent currentUserId={currentUserId} />
    </MessagesProvider>
  );
}