import React from 'react'

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="product-layout">
      {children}
      {/* Client components will be loaded after static generation */}
    </div>
  )
} 