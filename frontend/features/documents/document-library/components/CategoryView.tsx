import { Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { SearchBar } from './SearchBar';
import { DocumentList } from './DocumentList';
import { DocumentListSkeleton } from './DocumentListSkeleton';
import type { Document, DocumentCategory } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

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
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  isLoading?: boolean;
}

export const CategoryView = ({
  category, documents, searchQuery, onSearchChange, onBack, onUpload, onPreview, onDownload, onDelete,
  page, setPage, totalPages, isLoading
}: Props) => {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const categoryInfo = CATEGORIES.find(c => c.key === category);
  const icon = (categoryInfo?.icon as string) || (typeof category === 'object' ? (category as any).icon : '📁');
  const name = categoryInfo?.name || (typeof category === 'object' ? (category as any).name : category);

  return (
    <div className="bg-card rounded-2xl shadow-lg p-4 lg:p-6 transition-colors border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4 mb-6">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm lg:text-base">
          ← Quay lại
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-2xl lg:text-3xl">{icon}</span>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-card-foreground">{name}</h2>
              <p className="text-muted-foreground text-xs lg:text-sm">{documents.length} kết quả trang này</p>
            </div>
          </div>
        </div>
        {!isStudent && (
          <button onClick={onUpload} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
            <Upload size={18} />
            Thêm tài liệu
          </button>
        )}
      </div>

      <SearchBar value={searchQuery} onChange={onSearchChange} />

      <div className="mt-4">
        {isLoading ? (
          <DocumentListSkeleton />
        ) : (
          <DocumentList
            documents={documents}
            searchQuery={searchQuery}
            onPreview={onPreview}
            onDownload={onDownload}
            onDelete={onDelete}
            onAddNew={onUpload}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="p-2 border rounded-full hover:bg-muted disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium">Trang {page + 1} / {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="p-2 border rounded-full hover:bg-muted disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};