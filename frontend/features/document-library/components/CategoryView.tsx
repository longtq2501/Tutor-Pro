// ============================================================================
// FILE: document-library/components/CategoryView.tsx
// ============================================================================
import { Upload } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { SearchBar } from './SearchBar';
import { DocumentList } from './DocumentList';
import type { Document, DocumentCategory } from '@/lib/types';

interface Props {
  category: DocumentCategory;
  documents: Document[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
  onUpload: () => void;
  onPreview: (doc: Document) => void;
  onDownload: (doc: Document) => void;
  onDelete: (id: number) => void;
}

export const CategoryView = ({ category, documents, searchQuery, onSearchChange, onBack, onUpload, onPreview, onDownload, onDelete }: Props) => {
  const categoryInfo = CATEGORIES.find(c => c.key === category);

  return (
    <div className="bg-card rounded-2xl shadow-lg p-4 lg:p-6 transition-colors border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4 mb-6">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm lg:text-base">
          ← Quay lại
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-2xl lg:text-3xl">{categoryInfo?.icon}</span>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-card-foreground">{categoryInfo?.name}</h2>
              <p className="text-muted-foreground text-xs lg:text-sm">{documents.length} tài liệu</p>
            </div>
          </div>
        </div>
        <button onClick={onUpload} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
          <Upload size={18} />
          Thêm tài liệu
        </button>
      </div>

      <SearchBar value={searchQuery} onChange={onSearchChange} />
      <DocumentList documents={documents} searchQuery={searchQuery} onPreview={onPreview} onDownload={onDownload} onDelete={onDelete} onAddNew={onUpload} />
    </div>
  );
};