'use client'

interface ItemDescriptionProps {
  title: string;
  description: string;
  onChange: (field: string, value: string) => void;
}

export default function ItemDescription({ title, description, onChange }: ItemDescriptionProps) {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
          כותרת
        </label>
        <input
          type="text"
          id="title"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
          placeholder="תן כותרת קצרה וממוקדת לפריט שלך"
          value={title}
          onChange={(e) => onChange('title', e.target.value)}
          required
        />
        {title && title.length > 0 && title.length < 10 && (
          <p className="mt-1 text-sm text-red-500">כותרת צריכה להיות לפחות 10 תווים</p>
        )}
        <div className="mt-1 text-xs text-gray-500 flex justify-between">
          <span>{title.length} / 80 תווים</span>
          <span>מינימום 10 תווים</span>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
          תיאור הפריט
        </label>
        <textarea
          id="description"
          rows={6}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
          placeholder="תאר את הפריט בפירוט רב ככל האפשר. כלול פרטים כמו מצב הפריט, מאפיינים מיוחדים, וכל פרט רלוונטי אחר שהשוכר עשוי לרצות לדעת."
          value={description}
          onChange={(e) => onChange('description', e.target.value)}
          required
        />
        {description && description.length > 0 && description.length < 50 && (
          <p className="mt-1 text-sm text-red-500">תיאור צריך להיות לפחות 50 תווים</p>
        )}
        <div className="mt-1 text-xs text-gray-500 flex justify-between">
          <span>{description.length} / 2000 תווים</span>
          <span>מינימום 50 תווים</span>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-blue-800 font-medium mb-2">טיפים לתיאור מוצלח:</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>כלול מידע על המותג, הדגם והפרטים הטכניים</li>
          <li>ציין את מצב הפריט והאם יש בו פגמים או שריטות</li>
          <li>הוסף פרטים על איך להשתמש בפריט או טיפים שימושיים</li>
          <li>ציין מה כלול בהשכרה (אביזרים, חלקים נלווים וכו')</li>
        </ul>
      </div>
    </div>
  );
} 