'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative bg-gray-900">
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/1920/1080"
          alt="תמונת רקע"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          להשכיר במקום לקנות
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
          השוק הגדול ביותר להשכרת ציוד בישראל. מצלמות, ציוד קמפינג וכל מה שתצטרכו.
        </p>
        <div className="mt-10">
          <Link
            href="/create-listing"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#5E3EBA] hover:bg-[#4A2F9E]"
          >
            התחל להשכיר
          </Link>
        </div>
      </div>
    </div>
  )
} 