"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter(); // ✅ add router
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/register", form);
      toast.success("OTP sent to your email!");
      router.push(`/verify?email=${form.email}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-6 bg-black text-white">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-semibold text-center">Create Account</h1>

        <div className="space-y-4">
          <div>
            <Label className="p-2" htmlFor="name">Name</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} />
          </div>

          <div>
            <Label className="p-2" htmlFor="username">Username</Label>
            <Input id="username" name="username" value={form.username} onChange={handleChange} />
          </div>

          <div>
            <Label className="p-2" htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>

          <div>
            <Label className="p-2" htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Registering..." : "Register"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-white">Login</Link>
        </p>
      </div>
    </main>
  );
}