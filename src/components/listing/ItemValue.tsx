'use client'

interface ItemValueProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ItemValue({ value, onChange }: ItemValueProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '')
    onChange(numericValue)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="text-blue-800 font-medium mb-2">ערך הפריט:</h4>
        <p className="text-sm text-blue-700">
          אם תמכור את הפריט היום, למשל בפייסבוק מרקטפלייס - מה יהיה שוויו? ערך זה ישמש להגנת החזרים במקרה של נזק.
        </p>
      </div>
      
      <div>
        <label htmlFor="item-value" className="block text-sm font-medium text-gray-700 mb-1">
          ערך הפריט
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">₪</span>
          </div>
          <input
            type="text"
            id="item-value"
            className="block w-full rounded-md pr-7 py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
            value={value}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      {value && parseInt(value) > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">חיוב ברירת מחדל לפיקדון:</h3>
          <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">פיקדון:</span>
              <span className="font-medium">₪{Math.min(parseInt(value) * 0.15, 5000)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              פיקדון ברירת המחדל שיוחזק במקרה של נזק הוא 15% מערך הפריט או 5,000 ₪, הנמוך מביניהם.
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-3">מדיניות נזק</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              השוכר אחראי לכל נזק שנגרם לפריט בזמן ההשכרה.
            </li>
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              במקרה של נזק, הפיקדון יוחזק עד לפתרון הבעיה.
            </li>
            <li className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              אם הפריט אבד או נהרס לחלוטין, הפיקדון יוחזק והשוכר יידרש לשלם את ההפרש עד לשווי המלא של הפריט.
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <a href="#" className="text-blue-600 hover:underline">קרא עוד על מדיניות נזק ופיקדונות</a>
      </div>
    </div>
  )
} 