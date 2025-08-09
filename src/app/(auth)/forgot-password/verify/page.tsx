'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Email is missing from URL");
      router.push("/forgot-password");
    }
  }, [email, router]);

  const handleSubmit = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/forgot-password/verify", { email, otp });
      toast.success("OTP verified");
      router.push(`/forgot-password/reset?email=${email}&otp=${otp}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      <h1 className="text-3xl font-bold mb-6">Enter OTP</h1>

      <div className="w-full max-w-sm space-y-4">
        <div>
          <Label className="p-2">OTP sent to your email</Label>
          <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
}