"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6">Welcome to Vibes</h1>

      <p className="max-w-md sm:max-w-xl mb-10 text-base sm:text-lg leading-relaxed">
        Vibes is your go-to social platform to share moments, connect with friends, and explore a vibrant community — all inspired by Instagram.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
        <Link href="/register" passHref>
          <Button size="lg" className="w-full cursor-pointer sm:w-auto" variant="default">
            Register
          </Button>
        </Link>

        <Link href="/login" passHref>
          <Button size="lg" className="w-full cursor-pointer sm:w-auto" variant="outline">
            Login
          </Button>
        </Link>
      </div>
    </main>
  );
}
