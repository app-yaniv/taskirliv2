import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ההזמנות שלי | טסקירלי',
  description: 'צפייה וניהול ההזמנות שלך בפלטפורמת טסקירלי',
}

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 