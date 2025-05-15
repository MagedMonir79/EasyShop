'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

const LottieSection = dynamic(() => import('@/components/LottieSection'), { ssr: false })

type Product = {
  id: number
  name: string
  price: number
  image_url: string
  rating?: number
  is_favorite?: boolean
}

type Banner = {
  id: number
  image_url: string
}

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        const { user } = session
        setUserName(user.user_metadata?.username || user.email?.split('@')[0] || 'User')
        setCartCount(3) // مؤقتًا
      }
      setLoading(false)
    }

    const fetchData = async () => {
      const { data: productData } = await supabase.from('products').select('*').limit(20)
      const { data: bannerData } = await supabase.from('banners').select('*').limit(5)
      if (productData) setProducts(productData)
      if (bannerData) setBanners(bannerData)
    }

    checkSession()
    fetchData()
  }, [])

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-blue-600 text-xl">Loading...</div>
  }

  return (
    <main className="relative bg-gray-50 min-h-screen text-gray-800">
      {/* الهيدر */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="EasyShop Logo" width={32} height={32} />
          <h1 className="text-xl font-bold text-blue-700">EasyShop</h1>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={t('Search products...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={toggleLang} className="text-sm border border-gray-300 px-2 py-1 rounded">
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>
          {userName ? (
            <>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {t('Welcome')}, {userName}
              </span>
              <Link href="/cart" className="relative">
                <Image src="/cart-icon.svg" alt="Cart" width={28} height={28} />
                <span className="absolute -top-1 -right-2 text-xs bg-red-600 text-white px-1 rounded-full">
                  {cartCount}
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-blue-600 hover:underline">Login</Link>
              <Link href="/signup" className="text-sm text-green-600 hover:underline">Create Account</Link>
            </>
          )}
        </div>
      </header>

      {/* البانر (أول صورة من قاعدة البيانات أو بديلة) */}
      <section className="w-full overflow-hidden mb-6">
        <div className="w-full h-[250px] relative">
          {banners.length > 0 ? (
            <Image
              src={banners[0].image_url}
              alt="Main Banner"
              layout="fill"
              objectFit="cover"
              className="transition-all duration-700"
            />
          ) : (
            <Image
              src="/banners/banner1.jpg"
              alt="Fallback Banner"
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
      </section>

      {/* المنتجات */}
      <section className="px-6 py-6">
        <h3 className="text-xl font-bold mb-4 text-green-700">{t('🔥 Best Sellers')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(filteredProducts.length > 0 ? filteredProducts : Array.from({ length: 4 }, (_, i) => ({
            id: i,
            name: `Top Product ${i + 1}`,
            price: (i + 1) * 20,
            image_url: `https://via.placeholder.com/300x200?text=Top+${i + 1}`,
            rating: 4,
          }))).map((product, i) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white shadow-md rounded overflow-hidden cursor-pointer hover:shadow-xl"
            >
              <Image
                src={product.image_url}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 space-y-1">
                <h4 className="font-medium text-gray-800">{product.name}</h4>
                <p className="text-sm text-gray-500">$ {product.price}</p>
                <p className="text-yellow-500 text-sm">
                  {'⭐'.repeat(product.rating || 4)} ({product.rating || 4})
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* الرسوم المتحركة */}
      <LottieSection />

      {/* زر الواتساب */}
      <a
        href="https://wa.me/201234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 z-50 animate-bounce"
      >
        <Image src="/whatsapp.png" alt="WhatsApp" width={48} height={48} />
      </a>
    </main>
  )
}
