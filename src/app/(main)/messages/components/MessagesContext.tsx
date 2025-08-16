"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

interface User {
  _id: string;
  username: string;
  name: string;
  profilePic?: string;
}

interface Message {
  _id: string;
  senderId: User;
  receiverId: User;
  text: string;
  read: boolean;
  messageType: 'text' | 'image' | 'file';
  createdAt: string;
}

interface Conversation {
  _id: string;
  otherUser: User;
  lastMessage: {
    text: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
}

interface MessagesContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  hasMore: boolean;
  
  loadConversations: () => Promise<void>;
  selectConversation: (conversation: Conversation) => void;
  loadMessages: (userId: string, page?: number) => Promise<void>;
  sendMessage: (receiverId: string, text: string) => Promise<void>;
  markAsRead: (userId: string) => Promise<void>;
  deleteConversation: (userId: string) => Promise<void>;
  
  addNewMessage: (message: Message) => void;
  updateConversation: (conversation: Conversation) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/messages/conversations");
      setConversations(response.data.conversations || []);
    } catch (error: any) {
      console.error("Failed to load conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectConversation = useCallback((conversation: Conversation) => {
    setCurrentConversation(conversation);
    setMessages([]);
    setCurrentPage(1);
    setHasMore(false);
  }, []);

  const loadMessages = useCallback(async (userId: string, page = 1) => {
    try {
      setIsLoading(page === 1);
      const response = await axios.get(`/api/messages/${userId}?page=${page}&limit=50`);
      
      if (page === 1) {
        setMessages(response.data.messages || []);
      } else {
        setMessages(prev => [...(response.data.messages || []), ...prev]);
      }
      
      setHasMore(response.data.hasMore || false);
      setCurrentPage(page);
    } catch (error: any) {
      console.error("Failed to load messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (receiverId: string, text: string) => {
    if (!text.trim()) return;

    try {
      setIsSending(true);
      const response = await axios.post("/api/messages/send", {
        receiverId,
        text: text.trim()
      });

      const newMessage = response.data.message;
      
      setMessages(prev => [...prev, newMessage]);
      
      setConversations(prev => {
        const existingIndex = prev.findIndex(conv => conv._id === receiverId);
        const updatedConversation = {
          _id: receiverId,
          otherUser: newMessage.receiverId,
          lastMessage: {
            text: newMessage.text,
            createdAt: newMessage.createdAt,
            senderId: newMessage.senderId._id
          },
          unreadCount: 0
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = updatedConversation;
          return updated.sort((a, b) => 
            new Date(b.lastMessage.createdAt).getTime() - 
            new Date(a.lastMessage.createdAt).getTime()
          );
        } else {
          return [updatedConversation, ...prev];
        }
      });

      await triggerRealTimeUpdate(receiverId, newMessage);

    } catch (error: any) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  }, []);

  const triggerRealTimeUpdate = useCallback(async (receiverId: string, message: Message) => {
    try {
      await axios.post("/api/messages/notify", {
        receiverId,
        messageId: message._id
      });
    } catch (error) {
      console.warn("Failed to trigger real-time update:", error);
    }
  }, []);

  const markAsRead = useCallback(async (userId: string) => {
    try {
      await axios.post(`/api/messages/${userId}/read`);
      setConversations(prev => 
        prev.map(conv => 
          conv._id === userId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      setMessages(prev => 
        prev.map(msg => 
          msg.senderId._id === userId 
            ? { ...msg, read: true }
            : msg
        )
      );
      
      await loadConversations();
    } catch (error: any) {
      console.error("Failed to mark as read:", error);
    }
  }, [loadConversations]);

  const deleteConversation = useCallback(async (userId: string) => {
    try {
      await axios.delete(`/api/messages/conversations/${userId}`);
      
      setConversations(prev => prev.filter(conv => conv._id !== userId));
      
      if (currentConversation?._id === userId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      
      toast.success("Conversation deleted");
    } catch (error: any) {
      console.error("Failed to delete conversation:", error);
      toast.error("Failed to delete conversation");
    }
  }, [currentConversation]);


  const addNewMessage = useCallback((message: Message) => {
    if (currentConversation && 
        (message.senderId._id === currentConversation._id || 
         message.receiverId._id === currentConversation._id)) {
      setMessages(prev => {
        const exists = prev.some(msg => msg._id === message._id);
        if (!exists) {
          return [...prev, message];
        }
        return prev;
      });
    }
    
    setConversations(prev => {
      const otherUserId = message.senderId._id === currentConversation?.otherUser._id 
        ? message.senderId._id 
        : message.receiverId._id;
      
      const existingIndex = prev.findIndex(conv => conv._id === otherUserId);
      
      const updatedConversation = {
        _id: otherUserId,
        otherUser: message.senderId._id === otherUserId ? message.senderId : message.receiverId,
        lastMessage: {
          text: message.text,
          createdAt: message.createdAt,
          senderId: message.senderId._id
        },
        unreadCount: currentConversation?._id === otherUserId ? 0 : 1
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedConversation;
        return updated.sort((a, b) => 
          new Date(b.lastMessage.createdAt).getTime() - 
          new Date(a.lastMessage.createdAt).getTime()
        );
      } else {
        return [updatedConversation, ...prev];
      }
    });
  }, [currentConversation]);

  const updateConversation = useCallback((conversation: Conversation) => {
    setConversations(prev => {
      const existingIndex = prev.findIndex(conv => conv._id === conversation._id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = conversation;
        return updated;
      }
      return [conversation, ...prev];
    });
  }, []);
  useEffect(() => {
    const pollForUpdates = async () => {
      try {
        const response = await axios.get("/api/messages/conversations");
        const newConversations = response.data.conversations || [];
      
        if (currentConversation) {
          const messageResponse = await axios.get(`/api/messages/${currentConversation._id}?page=1&limit=10`);
          const latestMessages = messageResponse.data.messages || [];
          setMessages(prev => {
            const updatedMessages = [...prev];
            let hasChanges = false;
            
            latestMessages.forEach((newMsg: Message) => {
              const existingIndex = updatedMessages.findIndex(msg => msg._id === newMsg._id);
              if (existingIndex >= 0) {
                if (updatedMessages[existingIndex].read !== newMsg.read) {
                  updatedMessages[existingIndex] = newMsg;
                  hasChanges = true;
                }
              } else {
                updatedMessages.push(newMsg);
                hasChanges = true;
              }
            });
            
            return hasChanges ? updatedMessages.sort((a, b) => 
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            ) : prev;
          });
        }
        setConversations(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(newConversations)) {
            return newConversations;
          }
          return prev;
        });
        
      } catch (error) {
      }
    };

    const interval = setInterval(pollForUpdates, 2000); 
    return () => clearInterval(interval);
  }, [currentConversation]);

  return (
    <MessagesContext.Provider value={{
      conversations,
      currentConversation,
      messages,
      isLoading,
      isSending,
      hasMore,
      loadConversations,
      selectConversation,
      loadMessages,
      sendMessage,
      markAsRead,
      deleteConversation,
      addNewMessage,
      updateConversation,
    }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
}