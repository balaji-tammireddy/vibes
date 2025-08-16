"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, ArrowLeft, Trash2 } from "lucide-react";
import { useMessages } from "./MessagesContext";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

interface ChatWindowProps {
  currentUserId?: string;
  onBack?: () => void;
}

export default function ChatWindow({ currentUserId, onBack }: ChatWindowProps) {
  const {
    currentConversation,
    messages,
    isLoading,
    isSending,
    hasMore,
    loadMessages,
    sendMessage,
    deleteConversation
  } = useMessages();

  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleScroll = async () => {
    if (!messagesContainerRef.current || !hasMore || isLoading) return;
    
    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop === 0) {
      const currentPage = Math.ceil(messages.length / 50) + 1;
      await loadMessages(currentConversation!._id, currentPage);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentConversation || isSending) return;

    const text = messageText.trim();
    setMessageText("");
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    await sendMessage(currentConversation._id, text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleDeleteConversation = async () => {
    if (!currentConversation) return;
    
    await deleteConversation(currentConversation._id);
    setShowDeleteConfirm(false);
    onBack?.();
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt);
      let dateKey = '';
      
      if (isToday(date)) {
        dateKey = 'Today';
      } else if (isYesterday(date)) {
        dateKey = 'Yesterday';
      } else {
        dateKey = format(date, 'MMM dd, yyyy');
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  if (!currentConversation) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-sm">Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
          )}
          
          <Image
            src={currentConversation.otherUser.profilePic || "/default-image.jpg"}
            alt={`${currentConversation.otherUser.username}'s profile`}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          
          <div>
            <h3 className="font-semibold text-white">
              {currentConversation.otherUser.name}
            </h3>
            <p className="text-sm text-gray-400">
              @{currentConversation.otherUser.username}
            </p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200 hover:text-red-400"
          >
            <Trash2 className="w-5 h-5 text-gray-400" />
          </button>
          {showDeleteConfirm && (
            <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg z-10 min-w-[200px]">
              <p className="text-sm text-white mb-3">Delete this conversation?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteConversation}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading messages...</span>
            </div>
          </div>
        ) : (
          Object.entries(messageGroups).map(([dateKey, groupMessages]) => (
            <div key={dateKey}>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-800 px-3 py-1 rounded-full">
                  <span className="text-xs text-gray-400">{dateKey}</span>
                </div>
              </div>
              <div className="space-y-3">
                {groupMessages.map((message, index) => {
                  const isCurrentUser = message.senderId._id === currentUserId;
                  const showAvatar = !isCurrentUser && (
                    index === 0 || 
                    groupMessages[index - 1]?.senderId._id !== message.senderId._id
                  );

                  return (
                    <div
                      key={message._id}
                      className={`flex items-end gap-2 ${
                        isCurrentUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {!isCurrentUser && (
                        <div className="w-8 h-8 flex-shrink-0">
                          {showAvatar ? (
                            <Image
                              src={message.senderId.profilePic || "/default-image.jpg"}
                              alt={`${message.senderId.username}'s profile`}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8" />
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl ${
                          isCurrentUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p
                            className={`text-xs ${
                              isCurrentUser ? 'text-blue-100' : 'text-gray-400'
                            }`}
                          >
                            {formatMessageTime(message.createdAt)}
                          </p>
                          {isCurrentUser && (
                            <span
                              className={`text-xs ml-2 ${
                                message.read ? 'text-blue-300' : 'text-gray-400'
                              }`}
                            >
                              {message.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>

                      {isCurrentUser && (
                        <div className="w-8 h-8 flex-shrink-0">
                          {showAvatar && (
                            <Image
                              src={message.senderId.profilePic || "/default-image.jpg"}
                              alt="Your profile"
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <Image
                src={currentConversation.otherUser.profilePic || "/default-image.jpg"}
                alt={`${currentConversation.otherUser.username} is typing`}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-800 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${currentConversation.otherUser.name}...`}
              rows={1}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 
                       focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-none
                       overflow-hidden"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              disabled={!messageText.trim() || isSending}
              className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
                messageText.trim() && !isSending
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              style={{ height: '48px', width: '48px' }}
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}