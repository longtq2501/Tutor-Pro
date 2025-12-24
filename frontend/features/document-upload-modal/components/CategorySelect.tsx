// 📁 document-upload-modal/components/CategorySelect.tsx
import type { DocumentCategory } from '@/lib/types';
import { CATEGORIES } from '../constants';

interface CategorySelectProps {
  value: DocumentCategory;
  onChange: (value: DocumentCategory) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-card-foreground mb-2">
        Danh mục *
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as DocumentCategory)}
          className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none pr-10"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}