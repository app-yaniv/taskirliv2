'use client'

import { Shield, Clock, Star, CreditCard, Truck, Headphones } from 'lucide-react'

const benefits = [
  {
    name: 'תשלום מאובטח',
    description: 'התשלום שלך מוחזק בצורה מאובטחת עד שתאשר שההשכרה הושלמה.',
    icon: Shield,
  },
  {
    name: 'תמיכה 24/7',
    description: 'צוות התמיכה שלנו זמין תמיד לעזור לך בכל שאלה.',
    icon: Headphones,
  },
  {
    name: 'משלוח מהיר',
    description: 'פריטים רבים זמינים למשלוח או איסוף באותו היום.',
    icon: Truck,
  },
  {
    name: 'הזמנה גמישה',
    description: 'הזמן פריטים לכל משך זמן שתרצה, עם זמני איסוף והחזרה גמישים.',
    icon: Clock,
  },
  {
    name: 'ביקורות מאומתות',
    description: 'קרא ביקורות אמיתיות מלקוחות שהשכירו פריטים.',
    icon: Star,
  },
  {
    name: 'תשלום קל',
    description: 'מגוון אפשרויות תשלום זמינות עם עיבוד מאובטח.',
    icon: CreditCard,
  },
]

export default function Benefits() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            למה לבחור טסקירלי?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            אנחנו הופכים את ההשכרה לקלה, בטוחה ונוחה
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.name}
              className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#5E3EBA] text-white">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-medium text-gray-900">{benefit.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 