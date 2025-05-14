// src/app/page.tsx

'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function HomePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string>('/shoes.png');

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email || null);
    };
    getUser();

    const savedBanner = localStorage.getItem('bannerImage');
    if (savedBanner) setBannerImage(savedBanner);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <main className="bg-white min-h-screen text-gray-900 relative">
      {/* 🔷 الهيدر */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-blue-900">EasyShop</h1>
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
            <Image src="/logo.png" alt="logo" width={32} height={32} className="object-contain" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/seller-login" className="text-sm text-blue-700 hover:underline">Seller Portal</Link>
          <span className="text-sm text-green-500">{userEmail ? `Welcome, ${userEmail}` : ''}</span>
          <button className="text-sm text-blue-700 hover:underline">🌐 English | عربي</button>
          {userEmail ? (
            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Logout</button>
          ) : (
            <Link href="/login" className="text-sm text-blue-700 hover:underline">Login</Link>
          )}
        </div>
      </header>

      {/* 🌟 بانر رئيسي مع الصورة جوه البانر والنصوص على الشمال */}
      <section className="relative text-white py-20 px-6 bg-gradient-to-r from-purple-800 to-blue-800">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto">
          <div className="text-left max-w-xl">
            <h2 className="text-4xl font-bold mb-4">Discover Amazing Products at EasyShop</h2>
            <p className="text-lg mb-6">Explore thousands of trendy products from our diverse range of categories.</p>
            <div className="flex gap-4">
              <Link href="/products">
                <button className="bg-white text-blue-800 font-semibold px-6 py-2 rounded-xl hover:bg-gray-100">Shop Now</button>
              </Link>
              <Link href="/signup">
                <button className="bg-white text-blue-800 font-semibold px-6 py-2 rounded-xl hover:bg-gray-100">Create Account</button>
              </Link>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 w-full max-w-sm bg-purple-900 p-6 rounded-xl shadow-lg">
            <Image src={bannerImage} alt="promo" width={400} height={240} className="mb-4 rounded object-cover w-full h-48" />
            <h4 className="text-white text-sm font-semibold">New Collection Available</h4>
            <p className="text-purple-200 text-xs mb-2">Explore our latest summer collection with amazing discounts</p>
            <button className="bg-purple-700 text-white text-xs px-3 py-1 rounded">Up to 50% OFF</button>
          </div>
        </div>
      </section>

      {/* 🟢 زر واتساب عائم */}
      <Link href="https://wa.me/201234567890" target="_blank">
        <div className="fixed bottom-6 left-6 z-50 animate-pulse">
          <Image src="/whatsapp.png" alt="WhatsApp Support" width={50} height={50} className="rounded-full shadow-lg" />
        </div>
      </Link>

      {/* 🛍️ أقسام المنتجات */}
      <section className="py-12 px-6">
        <h3 className="text-2xl font-bold mb-6 text-center">Shop by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Electronics', img: '/electronics.jpg' },
            { name: 'Clothing', img: '/clothing.jpg' },
            { name: 'Home', img: '/home.jpg' },
            { name: 'Accessories', img: '/accessories.jpg' }
          ].map(({ name, img }) => (
            <div key={name} className="rounded-xl overflow-hidden shadow hover:shadow-lg transition-all">
              <Image src={img} alt={name} width={300} height={200} className="w-full h-40 object-cover" />
              <div className="p-4 bg-white">
                <h4 className="font-semibold text-lg">{name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📢 Footer */}
      <footer className="bg-gray-900 text-white py-6 px-4 text-center">
        <p className="text-sm mb-2">&copy; 2025 EasyShop. All rights reserved.</p>
        <div className="space-x-4">
          <Link href="/privacy" className="hover:underline text-sm">Privacy Policy</Link>
          <Link href="/contact" className="hover:underline text-sm">Contact Us</Link>
          <Link href="/about" className="hover:underline text-sm">About</Link>
        </div>
      </footer>
    </main>
  );
}
