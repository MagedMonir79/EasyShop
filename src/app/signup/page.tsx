'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Image from 'next/image';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('❌ كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      if (error.message.includes('User already registered')) {
        setError('❌ البريد الإلكتروني مسجل بالفعل.');
      } else {
        setError('❌ حصل خطأ أثناء التسجيل: ' + error.message);
      }
    } else {
      setSuccessMessage('✅ تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. يُرجى التفعيل قبل تسجيل الدخول.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      setError('❌ Google signup failed: ' + error.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="mb-6 text-center">
          <Image src="/logo.png" alt="EasyShop Logo" width={50} height={50} className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-blue-900">Create an Account</h1>
        </div>

        {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}
        {successMessage && <div className="text-green-600 text-sm mb-4 text-center">{successMessage}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500 text-xl"
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">or</p>
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 bg-white border px-4 py-2 rounded shadow hover:shadow-md"
          >
            <Image src="/google-icon.png" alt="Google" width={20} height={20} />
            <span>Sign Up with Google</span>
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span>Already have an account? </span>
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </div>
    </main>
  );
}
