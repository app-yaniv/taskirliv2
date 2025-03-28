'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Step components
import CategorySelector from '@/components/listing/CategorySelector'
import ItemDescription from '@/components/listing/ItemDescription'
import ItemPhotos from '@/components/listing/ItemPhotos'
import PricingTiers from '@/components/listing/PricingTiers'
import Location from '@/components/listing/Location'
import CancellationPolicy from '@/components/listing/CancellationPolicy'
import ItemValue from '@/components/listing/ItemValue'
import ProgressStepper from '@/components/listing/ProgressStepper'

export default function ListItemPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    photos: [],
    pricing: {
      oneDay: '',
      threeDays: '',
      sevenDays: ''
    },
    location: '',
    cancellationPolicy: 'flexible',
    itemValue: ''
  })

  const totalSteps = 7

  const handleStepChange = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      // Here you would submit the data to your backend
      // await submitItemListing(formData)
      router.push('/listing-success')
    } catch (error) {
      console.error('Error submitting listing:', error)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CategorySelector 
                 selectedCategory={formData.category} 
                 onChange={(value) => updateFormData('category', value)} 
               />
      case 2:
        return <ItemDescription 
                 title={formData.title}
                 description={formData.description}
                 onChange={(field, value) => updateFormData(field, value)}
               />
      case 3:
        return <ItemPhotos 
                 photos={formData.photos}
                 onChange={(value: string[]) => updateFormData('photos', value)}
               />
      case 4:
        return <PricingTiers 
                 pricing={formData.pricing}
                 onChange={(value) => updateFormData('pricing', value)}
               />
      case 5:
        return <Location
                 location={formData.location}
                 onChange={(value) => updateFormData('location', value)}
               />
      case 6:
        return <CancellationPolicy
                 policy={formData.cancellationPolicy}
                 onChange={(value) => updateFormData('cancellationPolicy', value)}
               />
      case 7:
        return <ItemValue
                 value={formData.itemValue}
                 onChange={(value) => updateFormData('itemValue', value)}
               />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            פרסם את הפריט שלך
          </h1>

          <ProgressStepper 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            onStepClick={handleStepChange} 
          />

          <div className="my-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {currentStep}. {getStepTitle(currentStep)}
            </h2>
            
            {renderStep()}
          </div>

          <div className="flex justify-between mt-10">
            {currentStep > 1 && (
              <button
                onClick={() => handleStepChange(currentStep - 1)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                הקודם
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                onClick={() => handleStepChange(currentStep + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-auto"
              >
                הבא
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium mr-auto"
              >
                פרסם מודעה!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getStepTitle(step: number): string {
  switch (step) {
    case 1: return 'בחר קטגוריה'
    case 2: return 'תאר את הפריט'
    case 3: return 'תמונות'
    case 4: return 'מחיר'
    case 5: return 'מיקום מסירה'
    case 6: return 'מדיניות ביטול'
    case 7: return 'ערך הפריט'
    default: return ''
  }
} 