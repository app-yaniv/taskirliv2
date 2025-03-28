'use client'

interface CancellationPolicyProps {
  policy: string;
  onChange: (policy: string) => void;
}

export default function CancellationPolicy({ policy, onChange }: CancellationPolicyProps) {
  const policies = [
    {
      id: 'flexible',
      name: 'גמיש',
      description: 'במקרה של ביטול יומיים לפני תקופת ההשכרה, 100% מסכום ההשכרה יוחזר. במקרה של ביטול יום אחד לפני תקופת ההשכרה, 50% מסכום ההשכרה יוחזר.'
    },
    {
      id: 'medium',
      name: 'בינוני',
      description: 'במקרה של ביטול 4 ימים לפני תקופת ההשכרה, 100% מסכום ההשכרה יוחזר. במקרה של ביטול 2-3 ימים לפני תקופת ההשכרה, 50% מסכום ההשכרה יוחזר. פחות מכך, לא יינתן החזר כספי.'
    },
    {
      id: 'strict',
      name: 'מחמיר',
      description: 'במקרה של ביטול 7 ימים לפני תקופת ההשכרה, 100% מסכום ההשכרה יוחזר. במקרה של ביטול 4-6 ימים לפני תקופת ההשכרה, 50% מסכום ההשכרה יוחזר. פחות מכך, לא יינתן החזר כספי.'
    }
  ]

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="text-blue-800 font-medium mb-2">תנאי ביטול:</h4>
        <p className="text-sm text-blue-700">
          בחר את מדיניות הביטול שתחול על ההשכרה. מדיניות זו תוצג לשוכרים לפני שהם משלימים את ההזמנה.
        </p>
      </div>
      
      <div className="space-y-4">
        {policies.map((policyOption) => (
          <div key={policyOption.id} className="relative">
            <input
              type="radio"
              id={policyOption.id}
              name="cancellation-policy"
              value={policyOption.id}
              className="peer sr-only"
              checked={policy === policyOption.id}
              onChange={() => onChange(policyOption.id)}
            />
            <label 
              htmlFor={policyOption.id}
              className={`flex p-4 cursor-pointer rounded-lg border-2 ${
                policy === policyOption.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center">
                  <div className={`w-5 h-5 mr-2 rounded-full border ${
                    policy === policyOption.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {policy === policyOption.id && (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="5" />
                      </svg>
                    )}
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    {policyOption.name}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {policyOption.description}
                </p>
              </div>
            </label>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <a href="#" className="text-blue-600 hover:underline">קרא עוד על מדיניות הביטול</a>
      </div>
    </div>
  )
} 