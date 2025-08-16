"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, MessageCircle, Search, User } from "lucide-react";
import { useEffect, useState, type ElementType } from "react";
import axios from "axios";

type NavItem = { href: string; icon: ElementType };

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

  const navItems: NavItem[] = [
    { href: "/home", icon: Home },
    { href: "/messages", icon: MessageCircle },
    { href: "/upload", icon: PlusSquare },
    { href: "/search", icon: Search },
    ...(username ? [{ href: `/profile/${username}`, icon: User }] : []),
  ];

  return (
    <nav className="fixed bottom-0 md:top-0 md:left-0 w-full md:w-16 bg-black border-t md:border-r border-gray-800 flex md:flex-col justify-around md:justify-start items-center py-2 md:py-6 z-50">
      {navItems.map(({ href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`p-2 md:mb-6 rounded-md transition-colors duration-200 ${
            pathname === href ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-900 hover:text-white"
          }`}
        >
          <Icon className="w-6 h-6" />
        </Link>
      ))}
    </nav>
  );
}