'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>

      <div className="w-full max-w-sm space-y-4">
        <div>
          <Label className="p-2">Enter your email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full cursor-pointer">
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      </div>
    </div>
  );
}
