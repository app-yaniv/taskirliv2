'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUserAuth } from '@/context/UserAuthContext'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'

const Header = () => {
  const { user, profile, signOut, isAuthenticated } = useUserAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Add ref for the dropdown
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent any default button behavior
    if (isLoggingOut) return // Prevent multiple clicks
    
    setIsLoggingOut(true)
    try {
      await signOut()
      setIsProfileMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
      alert('התנתקות נכשלה. אנא נסה שוב.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Get the display name or fallback to email
  const getUserDisplayName = () => {
    // If display_name is available, use it
    if (profile?.display_name) {
      return profile.display_name;
    }
    
    // Otherwise fallback to truncated email
    return truncateEmail(user?.email || '');
  }

  // Helper function to truncate email if it's too long
  const truncateEmail = (email: string) => {
    if (!email) return ''
    return email.length > 15 ? `${email.substring(0, 15)}...` : email
  }

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">טסקירלי</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4 sm:space-x-reverse">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600">
              בית
            </Link>
            <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600">
              לוח בקרה
            </Link>
            <Link href="/bookings" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600">
              הזמנות
            </Link>
            
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative ml-3 sm:mr-4" ref={dropdownRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-800 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                >
                  <User className="h-4 w-4 ml-2" />
                  <span>{getUserDisplayName()}</span>
                  <ChevronDown className="h-4 w-4 mr-1" />
                </button>
                
                {/* Profile dropdown */}
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      הפרופיל שלי
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      הגדרות
                    </Link>
                    <button
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4 ml-2" />
                      <span className="flex-1 text-right">{isLoggingOut ? 'מתנתק...' : 'התנתק'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link 
                  href="/auth/signin" 
                  className="px-4 py-1.5 text-sm font-medium text-gray-800 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  התחברות
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  הרשמה
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">פתח תפריט ראשי</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600"
            >
              בית
            </Link>
            <Link 
              href="/dashboard" 
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600"
            >
              לוח בקרה
            </Link>
            <Link 
              href="/bookings" 
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600"
            >
              הזמנות
            </Link>
            
            {/* Mobile auth options */}
            {isAuthenticated ? (
              <>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600"
                >
                  הפרופיל שלי
                </Link>
                <Link 
                  href="/settings" 
                  className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600"
                >
                  הגדרות
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="flex w-full items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-50"
                >
                  <LogOut className="h-5 w-5 ml-2" />
                  <span className="flex-1 text-right">{isLoggingOut ? 'מתנתק...' : 'התנתק'}</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600"
                >
                  התחברות
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-600"
                >
                  הרשמה
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header 