import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      <h1 className="text-5xl font-bold mb-6">Welcome to Vibes</h1>
      <p className="max-w-xl mb-10 text-lg sm:text-xl leading-relaxed">
        Vibes is your go-to social platform to share moments, connect with friends, and explore a vibrant community — all inspired by Instagram.
      </p>
      
      <div className="flex gap-6">
        <Link href="/register" passHref>
          <Button size="lg" className="cursor-pointer" variant="default">
            Register
          </Button>
        </Link>

        <Link href="/login" passHref>
          <Button size="lg" className="cursor-pointer" variant="outline">
            Login
          </Button>
        </Link>
      </div>
    </main>
  );
}
