'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#5E3EBA] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">TS</span>
              </div>
              <span className="ml-2 text-xl font-bold">טסקירלי</span>
            </div>
            <p className="text-gray-400 text-sm">
              השוק הגדול ביותר להשכרת ציוד בישראל.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">קישורים מהירים</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  אודות
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white">
                  דרושים
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-400 hover:text-white">
                  עיתונות
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white">
                  בלוג
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">תמיכה</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white">
                  מרכז עזרה
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-400 hover:text-white">
                  בטיחות
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  תנאי שימוש
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  מדיניות פרטיות
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">צור קשר</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                אימייל: support@taskirli.co.il
              </li>
              <li className="text-gray-400">
                טלפון: +972 (3) 123-4567
              </li>
              <li className="text-gray-400">
                כתובת: רחוב הרצל 1, תל אביב, ישראל
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} טסקירלי. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  )
} 