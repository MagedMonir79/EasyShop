'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })
import shoppingAnimation from '@/lottie/shopping.json'

export default function LottieSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <section className="px-6 py-10 bg-blue-50 flex justify-center items-center">
      <div className="w-60">
        <Lottie animationData={shoppingAnimation} loop autoplay />
      </div>
    </section>
  )
}
