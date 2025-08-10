'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Email is missing from URL');
      router.push('/register');
    }
  }, [email, router]);

  const handleSubmit = async () => {
    if (!otp) return toast.error('Please enter the OTP');

    try {
      setLoading(true);
      const res = await axios.post('/api/verify', { email, otp });
      if (res.status === 200) {
        toast.success('Account verified and logged in');
        router.push('/home');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      <h1 className="text-3xl font-bold mb-6">Verify Your Email</h1>

      <div className="w-full max-w-sm space-y-4">
        <div>
          <Label className='p-2'>Enter the OTP sent to your email</Label>
          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full cursor-pointer">
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </div>
    </div>
  );
}
