'use client'

import Link from 'next/link'
import { Search, MapPin, User, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-[#5E3EBA] rounded-full flex items-center justify-center">
              <span className="text-white font-bold">TK</span>
            </div>
            <span className="mr-2 text-xl font-bold text-[#5E3EBA]">טסקירלי</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#5E3EBA] focus:border-[#5E3EBA] sm:text-sm"
                placeholder="חפש כל דבר..."
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/new-users" className="text-gray-600 hover:text-[#5E3EBA]">
              משתמשים חדשים
            </Link>
            <Link href="/download" className="text-gray-600 hover:text-[#5E3EBA]">
              הורדה
            </Link>
            <Link href="/faqs" className="text-gray-600 hover:text-[#5E3EBA]">
              שאלות נפוצות
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#5E3EBA]">
              צור קשר
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center text-gray-600 hover:text-[#5E3EBA]">
              <MapPin className="h-5 w-5 ml-1" />
              <span>מיקום</span>
            </button>
            <button className="hidden md:flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#5E3EBA] hover:bg-[#4A2F9E]">
              התחברות
            </button>
            <button className="hidden md:flex items-center px-4 py-2 border border-[#5E3EBA] text-sm font-medium rounded-md text-[#5E3EBA] bg-white hover:bg-gray-50">
              הרשמה
            </button>
            <button className="md:hidden">
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 