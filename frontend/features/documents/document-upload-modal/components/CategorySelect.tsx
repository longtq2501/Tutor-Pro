// 📁 document-upload-modal/components/CategorySelect.tsx
import type { DocumentCategory, Category } from '@/lib/types';
import { CATEGORIES } from '../constants'; // Fallback only

interface CategorySelectProps {
  value: DocumentCategory;
  onChange: (value: DocumentCategory) => void;
  categories: Category[]; // Dynamic list
}

export function CategorySelect({ value, onChange, categories }: CategorySelectProps) {
  // Use dynamic categories if available, otherwise fall back to constants (though parent should provide dynamic)
  // We prefer dynamic categories.
  // We need to ensure we don't have duplicates if we mix them, but ideally we just replace entirely.
  // For now, let's assume if categories are passed, we use them.

  // Helper to get display icon/color (optional, since dynamic categories might not have icons yet)
  // We can try to match with constant to get icon, or just use a default.
  const getVisual = (code: string) => {
    return CATEGORIES.find(c => c.key === code);
  };

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
          {categories.length > 0 ? (
            categories.map((cat) => {
              const visual = getVisual(cat.code);
              const icon = cat.icon || visual?.icon || '📁';
              return (
                <option key={cat.id} value={cat.code}>
                  {icon} {cat.name}
                </option>
              );
            })
          ) : (
            // Fallback to hardcoded if no dynamic categories loaded yet
            CATEGORIES.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.icon} {cat.name}
              </option>
            ))
          )}
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