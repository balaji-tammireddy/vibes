'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Shield } from "lucide-react";

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
    <main className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Enter OTP</h1>
            <p className="text-gray-400">We sent a verification code to</p>
            <p className="text-blue-400 font-medium">{email}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 py-2 font-medium">
                Verification Code
              </Label>
              <Input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 text-center text-lg tracking-widest"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Verifying...
              </div>
            ) : (
              "Verify OTP"
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Didn't receive the code?{" "}
              <button 
                onClick={() => router.push("/forgot-password")}
                className="text-green-400 hover:text-green-300 underline"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}