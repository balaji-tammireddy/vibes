"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 py-2 font-medium" htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label className="text-gray-300 py-2 font-medium" htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  value={form.password} 
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleLogin} 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </Button>

          <div className="text-sm text-center text-gray-400 space-y-2">
            <p>
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                Register
              </Link>
            </p>
            <p>
              Forgot your password?{" "}
              <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                Recover here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}