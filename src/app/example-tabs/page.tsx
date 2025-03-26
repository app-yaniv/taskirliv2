'use client'

import { TabNavigation } from '@/components/ui/TabNavigation'

export default function ExampleTabsPage() {
  const tabs = [
    {
      id: 'tab1',
      label: 'לשונית 1',
      content: (
        <div className="p-4 bg-white rounded-md shadow">
          <h2 className="text-xl font-bold mb-4">תוכן לשונית 1</h2>
          <p className="text-gray-700">
            זהו תוכן הלשונית הראשונה. הלשונית הזו לא תגרום לרענון הדף כשתעבור בין הלשוניות.
          </p>
        </div>
      )
    },
    {
      id: 'tab2',
      label: 'לשונית 2',
      content: (
        <div className="p-4 bg-white rounded-md shadow">
          <h2 className="text-xl font-bold mb-4">תוכן לשונית 2</h2>
          <p className="text-gray-700">
            זהו תוכן הלשונית השנייה. המצב של האפליקציה נשמר בין מעברי לשוניות.
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            לחצן לדוגמה
          </button>
        </div>
      )
    },
    {
      id: 'tab3',
      label: 'לשונית 3',
      content: (
        <div className="p-4 bg-white rounded-md shadow">
          <h2 className="text-xl font-bold mb-4">תוכן לשונית 3</h2>
          <p className="text-gray-700">
            זהו תוכן הלשונית השלישית. שימוש ברכיב הלשוניות הזה מאפשר ניווט צד-לקוח ללא רענוני דף.
          </p>
          <div className="mt-4 p-4 bg-yellow-100 rounded-md">
            <p className="text-yellow-800">זוהי הודעת מידע לדוגמה</p>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">דוגמת ניווט לשוניות</h1>
      <p className="mb-6 text-gray-600">
        לחץ על הלשוניות השונות כדי לעבור בין תכנים מבלי לרענן את הדף.
      </p>
      
      <TabNavigation tabs={tabs} defaultTabId="tab1" />
    </div>
  )
} 