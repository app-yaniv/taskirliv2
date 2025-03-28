import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'קטגוריות | טסקירלי',
  description: 'חיפוש פריטים להשכרה לפי קטגוריות - צפה במגוון הקטגוריות שלנו בפלטפורמת טסקירלי',
}

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 