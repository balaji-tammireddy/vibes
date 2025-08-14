"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  _id: string;
  username: string;
  name: string;
  bio?: string;
  profilePic?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
}

interface SearchContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  updateUserFollowStatus: (userId: string, isFollowing: boolean) => void;
  updateUserCounts: (userId: string, followersCount: number, followingCount: number) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);

  const updateUserFollowStatus = useCallback((userId: string, isFollowing: boolean) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === userId 
          ? { 
              ...user, 
              isFollowing,
              followersCount: user.followersCount + (isFollowing ? 1 : -1)
            }
          : user
      )
    );
  }, []);

  const updateUserCounts = useCallback((userId: string, followersCount: number, followingCount: number) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === userId 
          ? { ...user, followersCount, followingCount }
          : user
      )
    );
  }, []);

  return (
    <SearchContext.Provider value={{
      users,
      setUsers,
      updateUserFollowStatus,
      updateUserCounts,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}