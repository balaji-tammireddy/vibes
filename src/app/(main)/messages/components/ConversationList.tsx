"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MessageCircle, Search, Plus } from "lucide-react";
import { useMessages } from "./MessagesContext";
import NewConversationModal from "./NewConversationModal";
import { formatDistanceToNow } from "date-fns";

interface ConversationListProps {
  currentUserId?: string;
  onConversationSelect?: () => void;
}

export default function ConversationList({ 
  currentUserId, 
  onConversationSelect 
}: ConversationListProps) {
  const {
    conversations,
    currentConversation,
    isLoading,
    loadConversations,
    selectConversation,
    loadMessages,
    markAsRead
  } = useMessages();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState(conversations);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conversation =>
        conversation.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [conversations, searchQuery]);

  const handleConversationClick = async (conversation: any) => {
    selectConversation(conversation);
    await loadMessages(conversation._id);
    await markAsRead(conversation._id);
    
    onConversationSelect?.();
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const handleNewMessage = () => {
    setShowNewMessageModal(true);
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading conversations...</span>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
        <MessageCircle className="w-16 h-16 mb-4 text-gray-600" />
        <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
        <p className="text-sm text-center mb-4">
          Start a conversation with someone
        </p>
        <button 
          onClick={handleNewMessage}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Start New Conversation
        </button>
        
        <NewConversationModal
          isOpen={showNewMessageModal}
          onClose={() => setShowNewMessageModal(false)}
          currentUserId={currentUserId}
          onConversationStart={onConversationSelect}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-white">Messages</h2>
          </div>
          <button 
            onClick={handleNewMessage}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
            title="Start new conversation"
          >
            <Plus className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                     text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 
                     focus:ring-1 focus:ring-blue-500 transition-all duration-200 text-sm"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {searchQuery && filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-400">
            <Search className="w-12 h-12 mb-3 text-gray-600" />
            <p className="text-sm text-center">
              No conversations found for "{searchQuery}"
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => handleConversationClick(conversation)}
              className={`flex items-center gap-3 p-4 hover:bg-gray-800 cursor-pointer transition-colors duration-200 border-b border-gray-800 ${
                currentConversation?._id === conversation._id ? 'bg-gray-800 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <Image
                  src={conversation.otherUser.profilePic || "/default-image.jpg"}
                  alt={`${conversation.otherUser.username}'s profile`}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white truncate">
                    {conversation.otherUser.name}
                  </h3>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatTime(conversation.lastMessage.createdAt)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 truncate">
                    {conversation.lastMessage.senderId === currentUserId ? 'You: ' : ''}
                    {conversation.lastMessage.text}
                  </p>
                  
                  {conversation.unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                      {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          ))
        )}
      </div>

      <NewConversationModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        currentUserId={currentUserId}
        onConversationStart={onConversationSelect}
      />
    </div>
  );
}