// src/app/login/page.tsx

'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!supabase) {
      setError('Supabase not initialized');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('❌ لم يتم تأكيد البريد الإلكتروني. يُرجى فتح الإيميل والضغط على رابط التفعيل.');
      } else if (error.message.includes('Invalid login credentials')) {
        setError('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else {
        setError('❌ حصل خطأ أثناء تسجيل الدخول: ' + error.message);
      }
    } else {
      setSuccessMessage('✅ تم تسجيل الدخول بنجاح! جاري التوجيه...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      setError('Supabase not initialized');
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://junlpdlwzzrjftfaodn.supabase.co/auth/v1/callback',
      },
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('❌ لم يتم تأكيد البريد الإلكتروني. يُرجى فتح الإيميل والضغط على رابط التفعيل.');
      } else if (error.message.includes('Invalid login credentials')) {
        setError('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else {
        setError('❌ حصل خطأ أثناء تسجيل الدخول: ' + error.message);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="mb-6 text-center">
          <Image src="/logo.png" alt="EasyShop Logo" width={50} height={50} className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-blue-900">Login to EasyShop</h1>
        </div>

        {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}
        {successMessage && <div className="text-green-600 text-sm mb-4 text-center">{successMessage}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">or</p>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border px-4 py-2 rounded shadow hover:shadow-md"
          >
            <Image src="/google-icon.png" alt="Google" width={20} height={20} />
            <span>Login with Google</span>
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span>Don&apos;t have an account? </span>
          <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </div>
      </div>
    </main>
  );
}