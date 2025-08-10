"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, MessageCircle, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const navItems = [
  { href: "/home", icon: Home },
  { href: "/upload", icon: PlusSquare },
  { href: "/search", icon: Search },
  { href: "/messages", icon: MessageCircle },
];

export default function Navigation() {
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsername() {
      try {
        const res = await axios.get("/api/auth/me");
        setUsername(res.data.username);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    }

    fetchUsername();
  }, []);

  return (
    <nav className="fixed bottom-0 md:top-0 md:left-0 w-full md:w-20 bg-black border-t md:border-r border-zinc-800 flex md:flex-col justify-around md:justify-start items-center py-2 md:py-6 z-50">
      {navItems.map(({ href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`p-2 md:mb-6 rounded-md transition ${
            pathname === href ? "bg-zinc-800" : "hover:bg-zinc-900"
          }`}
        >
          <Icon className="w-6 h-6 text-white" />
        </Link>
      ))}

      {username && (
        <Link
          href={`/profile/${username}`}
          className={`p-2 md:mb-6 rounded-md transition ${
            pathname === `/profile/${username}` ? "bg-zinc-800" : "hover:bg-zinc-900"
          }`}
        >
          <User className="w-6 h-6 text-white" />
        </Link>
      )}
    </nav>
  );
}