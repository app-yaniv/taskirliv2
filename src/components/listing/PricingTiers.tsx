'use client'

import { useState, useEffect } from 'react'

interface PricingProps {
  pricing: {
    oneDay: string;
    threeDays: string;
    sevenDays: string;
  };
  onChange: (pricing: { oneDay: string; threeDays: string; sevenDays: string }) => void;
}

export default function PricingTiers({ pricing, onChange }: PricingProps) {
  const [localPricing, setLocalPricing] = useState(pricing)
  const [errors, setErrors] = useState({
    oneDay: '',
    threeDays: '',
    sevenDays: ''
  })

  // Update local state when props change
  useEffect(() => {
    setLocalPricing(pricing)
  }, [pricing])

  const handleChange = (field: keyof typeof localPricing, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    
    // Create a copy of the current pricing
    const newPricing = { ...localPricing, [field]: numericValue }
    
    // Validate that longer rental periods have lower or equal prices
    let newErrors = { ...errors, [field]: '' }
    
    if (field === 'oneDay' && numericValue) {
      const oneDayValue = parseInt(numericValue)
      
      if (newPricing.threeDays && parseInt(newPricing.threeDays) > oneDayValue * 3) {
        newErrors.threeDays = 'המחיר ל-3 ימים צריך להיות שווה או נמוך יותר מהמחיר היומי × 3'
      } else {
        newErrors.threeDays = ''
      }
      
      if (newPricing.sevenDays && parseInt(newPricing.sevenDays) > oneDayValue * 7) {
        newErrors.sevenDays = 'המחיר ל-7 ימים צריך להיות שווה או נמוך יותר מהמחיר היומי × 7'
      } else {
        newErrors.sevenDays = ''
      }
    }
    
    if (field === 'threeDays' && numericValue && newPricing.oneDay) {
      const threeDayValue = parseInt(numericValue)
      const oneDayValue = parseInt(newPricing.oneDay)
      
      if (threeDayValue > oneDayValue * 3) {
        newErrors.threeDays = 'המחיר ל-3 ימים צריך להיות שווה או נמוך יותר מהמחיר היומי × 3'
      }
    }
    
    if (field === 'sevenDays' && numericValue && newPricing.oneDay) {
      const sevenDayValue = parseInt(numericValue)
      const oneDayValue = parseInt(newPricing.oneDay)
      
      if (sevenDayValue > oneDayValue * 7) {
        newErrors.sevenDays = 'המחיר ל-7 ימים צריך להיות שווה או נמוך יותר מהמחיר היומי × 7'
      }
    }
    
    setLocalPricing(newPricing)
    setErrors(newErrors)
    
    // Only update parent if there are no errors
    if (!newErrors.oneDay && !newErrors.threeDays && !newErrors.sevenDays) {
      onChange(newPricing)
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="text-blue-800 font-medium mb-2">תמחור:</h4>
        <p className="text-sm text-blue-700 mb-2">
          אתה יכול להציע מחירים נמוכים יותר להשכרות ארוכות. מחיר ההשכרה מחושב לפי רמת המחיר הנמוכה ביותר האפשרית.
        </p>
      </div>
      
      <div className="grid gap-6">
        <div>
          <label htmlFor="price-one-day" className="block text-sm font-medium text-gray-700 mb-1">
            מחיר ליום אחד (חובה)
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">₪</span>
            </div>
            <input
              type="text"
              id="price-one-day"
              className={`block w-full rounded-md pr-7 pl-12 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.oneDay ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
              value={localPricing.oneDay}
              onChange={(e) => handleChange('oneDay', e.target.value)}
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">ליום</span>
            </div>
          </div>
          {errors.oneDay && <p className="mt-1 text-sm text-red-600">{errors.oneDay}</p>}
        </div>
        
        <div>
          <label htmlFor="price-three-days" className="block text-sm font-medium text-gray-700 mb-1">
            מחיר ל-3 ימים
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">₪</span>
            </div>
            <input
              type="text"
              id="price-three-days"
              className={`block w-full rounded-md pr-7 pl-12 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.threeDays ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
              value={localPricing.threeDays}
              onChange={(e) => handleChange('threeDays', e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">סה"כ</span>
            </div>
          </div>
          {errors.threeDays && <p className="mt-1 text-sm text-red-600">{errors.threeDays}</p>}
          {localPricing.oneDay && !errors.oneDay && !localPricing.threeDays && (
            <p className="mt-1 text-sm text-gray-500">
              מחיר רגיל: ₪{parseInt(localPricing.oneDay) * 3}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="price-seven-days" className="block text-sm font-medium text-gray-700 mb-1">
            מחיר ל-7 ימים
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">₪</span>
            </div>
            <input
              type="text"
              id="price-seven-days"
              className={`block w-full rounded-md pr-7 pl-12 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.sevenDays ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
              value={localPricing.sevenDays}
              onChange={(e) => handleChange('sevenDays', e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">סה"כ</span>
            </div>
          </div>
          {errors.sevenDays && <p className="mt-1 text-sm text-red-600">{errors.sevenDays}</p>}
          {localPricing.oneDay && !errors.oneDay && !localPricing.sevenDays && (
            <p className="mt-1 text-sm text-gray-500">
              מחיר רגיל: ₪{parseInt(localPricing.oneDay) * 7}
            </p>
          )}
        </div>
      </div>
      
      {localPricing.oneDay && parseInt(localPricing.oneDay) > 0 && (
        <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-3">סיכום מחירים:</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>יום אחד:</span>
              <span className="font-medium">₪{localPricing.oneDay} / יום</span>
            </div>
            
            <div className="flex justify-between">
              <span>3 ימים:</span>
              <span className="font-medium">
                {localPricing.threeDays 
                  ? `₪${localPricing.threeDays} סה"כ (₪${Math.round(parseInt(localPricing.threeDays) / 3)} / יום)`
                  : `₪${parseInt(localPricing.oneDay) * 3} סה"כ (₪${localPricing.oneDay} / יום)`
                }
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>7 ימים:</span>
              <span className="font-medium">
                {localPricing.sevenDays 
                  ? `₪${localPricing.sevenDays} סה"כ (₪${Math.round(parseInt(localPricing.sevenDays) / 7)} / יום)`
                  : `₪${parseInt(localPricing.oneDay) * 7} סה"כ (₪${localPricing.oneDay} / יום)`
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 