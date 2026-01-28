import { Upload, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { SearchBar } from './SearchBar';
import { DocumentList } from './DocumentList';
import { DocumentListSkeleton } from './DocumentListSkeleton';
import type { Document, DocumentCategory } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/contexts/UIContext';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-6">
      <DashboardHeader
        title={name}
        subtitle={`${documents.length} tài liệu trong danh mục này`}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl font-bold">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
            </Button>
            {!isStudent && (
              <Button onClick={onUpload} className="rounded-xl font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Upload size={18} />
                Thêm tài liệu
              </Button>
            )}
          </div>
        }
      />

      <div className="bg-card rounded-2xl shadow-lg p-4 lg:p-6 transition-colors border border-border">
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
    </div>
  );
};