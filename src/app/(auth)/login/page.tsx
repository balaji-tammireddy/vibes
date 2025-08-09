"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/login", form);
      toast.success("Logged in successfully!");
      router.push("/home");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-6 bg-black text-white">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-semibold text-center">Welcome Back</h1>
        
        <div className="space-y-4">
          <div>
            <Label className="p-2" htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>

          <div>
            <Label className="p-2" htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          </div>
        </div>

        <Button onClick={handleLogin} disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="text-sm text-center text-muted-foreground space-y-1">
          <p>
            Don’t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-white">Register</Link>
          </p>
          <p>
            Forgot your password?{" "}
            <Link href="/forgot-password" className="underline underline-offset-4 hover:text-white">Recover here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
