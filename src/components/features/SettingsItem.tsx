'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  value?: string;
  href: string;
  onClick?: () => void;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({ 
  icon, 
  title, 
  description, 
  value, 
  href,
  onClick
}) => {
  const content = (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-0 border-gray-100">
      <div className="flex items-center">
        <div className="text-gray-500 ml-4 rtl:ml-0 rtl:mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
      </div>
      <div className="flex items-center">
        {value && <span className="text-sm text-gray-500 ml-2 rtl:ml-0 rtl:mr-2">{value}</span>}
        <ChevronLeft size={18} className="text-gray-400 transform rtl:rotate-180" />
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button className="w-full text-right" onClick={onClick}>
        {content}
      </button>
    )
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  )
} 