'use client'

import Lottie from 'lottie-react'
import shoppingAnimation from '@/lottie/shopping.json'

export default function LottieSection() {
  return (
    <section className="px-6 py-10 bg-blue-50 flex justify-center items-center">
      <div className="w-60">
        <Lottie animationData={shoppingAnimation} loop autoplay />
      </div>
    </section>
  )
}
