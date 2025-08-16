'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/forgot-password/send-otp", { email });
      toast.success("OTP sent to your email");
      router.push(`/forgot-password/verify?email=${email}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-orange-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
            <p className="text-gray-400">Enter your email to receive a reset code</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 py-2 font-medium">
                Email Address
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </div>
            ) : (
              "Send OTP"
            )}
          </Button>

          <div className="text-center">
            <Link 
              href="/login"
              className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}