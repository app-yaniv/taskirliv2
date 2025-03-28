'use client'

import { useState } from 'react'

interface LocationProps {
  location: string;
  onChange: (location: string) => void;
}

export default function Location({ location, onChange }: LocationProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Mock suggestions - in a real application, this would call an API
  const mockSearch = (term: string) => {
    if (!term) {
      setSuggestions([])
      return
    }

    // Simulate API delay
    setIsSearching(true)
    setTimeout(() => {
      const mockLocations = [
        'תל אביב, ישראל',
        'ירושלים, ישראל',
        'חיפה, ישראל',
        'באר שבע, ישראל',
        'רמת גן, ישראל',
        'הרצליה, ישראל',
        'נתניה, ישראל',
        'אשדוד, ישראל',
        'אשקלון, ישראל',
        'פתח תקווה, ישראל'
      ]

      const filtered = mockLocations.filter(
        loc => loc.includes(term)
      ).slice(0, 5)
      
      setSuggestions(filtered)
      setIsSearching(false)
    }, 300)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    mockSearch(term)
  }

  const selectLocation = (location: string) => {
    onChange(location)
    setSearchTerm(location)
    setSuggestions([])
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="text-blue-800 font-medium mb-2">מיקום מסירה:</h4>
        <p className="text-sm text-blue-700 mb-2">
          יש לבחור את המיקום בו השוכרים יוכלו לאסוף את הפריט ולהחזירו.
        </p>
      </div>
      
      <div className="relative">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          הוסף מיקום
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            id="location"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pr-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
            placeholder="הזן את כתובת המיקום"
            value={searchTerm}
            onChange={handleSearchChange}
            required
          />
          {isSearching && (
            <div className="absolute top-2.5 left-3">
              <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectLocation(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {location && (
        <div className="mt-6 border border-gray-300 rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-2">המיקום שנבחר:</h3>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <p className="text-gray-800">{location}</p>
          </div>
          <div className="mt-4 p-4 h-32 bg-gray-200 rounded-lg">
            {/* Placeholder for map - in a real app this would be a Google Maps component */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              מפה תוצג כאן
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 