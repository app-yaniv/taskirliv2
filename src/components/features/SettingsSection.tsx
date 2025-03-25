'use client'

import React from 'react'

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900">{title}</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {children}
      </div>
    </div>
  )
} 