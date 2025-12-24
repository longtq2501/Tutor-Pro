// ============================================================================
// FILE: document-library/components/CategoryGrid.tsx
// ============================================================================
import type { DocumentCategory } from '@/lib/types';
import { CATEGORIES } from '../constants';

interface Props {
  documents: any[];
  onCategoryClick: (category: DocumentCategory) => void;
}

export const CategoryGrid = ({ documents, onCategoryClick }: Props) => {
  const getCategoryCount = (category: string) => {
    return documents.filter(doc => doc.category === category as DocumentCategory).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
      {CATEGORIES.map((category) => {
        const count = getCategoryCount(category.key);
        return (
          <button
            key={category.key}
            onClick={() => onCategoryClick(category.key as DocumentCategory)}
            className={`bg-gradient-to-r ${category.color} text-white rounded-xl p-4 lg:p-6 text-left hover:shadow-lg transition-all transform hover:scale-[1.02]`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 lg:gap-3">
                <span className="text-2xl lg:text-3xl">{category.icon}</span>
                <div>
                  <h3 className="font-bold text-base lg:text-lg">{category.name}</h3>
                  <p className="text-white/80 text-xs lg:text-sm">{count} tài liệu</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg px-2 lg:px-3 py-1">
                <span className="text-xs lg:text-sm font-medium">{count}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};