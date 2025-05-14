'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// تحميل Lottie بشكل ديناميكي علشان ما يشتغلش على السيرفر
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })
import shoppingAnimation from '@/lottie/shopping.json'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
      } else {
        const { user } = session
        setUserName(user.email?.split('@')[0] || 'User')
      }

      setLoading(false)
    }

    checkSession()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-600 text-xl">
        Loading...
      </div>
    )
  }

  return (
    <main className="relative bg-gray-50 min-h-screen text-gray-800">
      {/* الهيدر */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="EasyShop Logo" className="h-8 w-8 object-contain" />
          <h1 className="text-xl font-bold text-blue-700">EasyShop</h1>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            Welcome, {userName}
          </span>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* بانر */}
      <section
        className="relative h-[250px] bg-cover bg-center text-white flex items-center justify-center mb-6"
        style={{
          backgroundImage: `url("/banners/banner1.jpg")`,
          backgroundColor: '#1e3a8a',
        }}
      >
        <h2 className="text-3xl font-bold drop-shadow-md text-white text-center">
          Everything you need... All in one place!
        </h2>
      </section>

      {/* إعلان بسيط */}
      <section className="px-6 mb-10">
        <div className="overflow-hidden rounded-lg shadow-lg">
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            transition={{ duration: 1 }}
            className="w-full h-[180px] bg-cover bg-center"
            style={{
              backgroundImage: `url("https://via.placeholder.com/1200x400?text=Big+Sale+Up+to+50%25+OFF")`,
            }}
          ></motion.div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="px-6 py-6">
        <h3 className="text-xl font-bold mb-4 text-green-700">🔥 Best Sellers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white shadow-md rounded overflow-hidden cursor-pointer hover:shadow-xl"
            >
              <img
                src={`https://via.placeholder.com/300x200?text=Top+${i + 1}`}
                alt={`Product ${i + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h4 className="font-medium text-gray-800">Top Product {i + 1}</h4>
                <p className="text-sm text-gray-500">$ {(i + 1) * 20}.00</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* أقسام منتجات */}
      <section className="px-6 py-10 space-y-10">
        {['Electronics', 'Fashion', 'Home Appliances'].map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-800">{section}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white shadow-md rounded overflow-hidden cursor-pointer hover:shadow-xl"
                >
                  <img
                    src={`https://via.placeholder.com/300x200?text=Item+${i + 1}+in+${section}`}
                    alt={`Product ${i + 1}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-medium text-gray-800">Product {i + 1}</h4>
                    <p className="text-sm text-gray-500">$ {(i + 1) * 10}.00</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Lottie Animation */}
      <section className="px-6 py-10 bg-blue-50 flex justify-center items-center">
        <div className="w-60">
          <Lottie animationData={shoppingAnimation} loop autoplay />
        </div>
      </section>

      {/* Shopping Tips */}
      <section className="px-6 py-10 bg-blue-50">
        <h3 className="text-2xl font-bold text-blue-700 mb-6">Shopping Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {['How to choose electronics', 'Best fashion hacks', 'Top home gadgets 2025'].map(
            (tip, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-5 rounded-lg shadow hover:shadow-lg"
              >
                <h4 className="font-semibold text-lg mb-2 text-blue-800">{tip}</h4>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id quam nec elit...
                </p>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* زر الواتساب */}
      <a
        href="https://wa.me/201234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 z-50 animate-bounce"
      >
        <img
          src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
          alt="WhatsApp"
          className="w-12 h-12"
        />
      </a>
    </main>
  )
}
