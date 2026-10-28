import { Upload, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { SearchBar } from './SearchBar';
import { DocumentList } from './DocumentList';
import { DocumentListSkeleton } from './DocumentListSkeleton';
import type { Document, DocumentCategory, Category } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/contexts/UIContext';
import { Button } from '@/components/ui/button';
import { HeaderActionsRow, useHeaderDensity } from '@/components/shared/ResponsiveHeaderActions';
import { cn } from '@/lib/utils';

interface Props {
  category: DocumentCategory | Category;
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
  const { atLeast } = useHeaderDensity();
  const showActionLabels = atLeast('comfortable');

  const categoryKey = typeof category === 'string' ? category : category.code;
  const categoryInfo = CATEGORIES.find(c => c.key === categoryKey);
  const name = categoryInfo?.name || (typeof category === 'object' ? category.name : category);

  return (
    <div className="bg-transparent flex-1 flex flex-col min-h-0 h-full">
      <DashboardHeader
        title={name}
        subtitle={`${documents.length} tài liệu`}
        actions={
          <HeaderActionsRow>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              title="Quay lại"
              aria-label="Quay lại"
              className={cn(
                'h-8 shrink-0 rounded-xl font-semibold text-[13px] whitespace-nowrap',
                showActionLabels ? 'px-2.5 gap-1.5' : 'w-8 p-0 justify-center'
              )}
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              {showActionLabels && <span>Quay lại</span>}
            </Button>
            {!isStudent && (
              <Button
                onClick={onUpload}
                size="sm"
                title="Thêm tài liệu"
                aria-label="Thêm tài liệu"
                className={cn(
                  'h-8 shrink-0 rounded-xl font-semibold text-[13px] shadow-lg shadow-primary/20 whitespace-nowrap',
                  showActionLabels ? 'px-3 gap-1.5' : 'w-8 p-0 justify-center'
                )}
              >
                <Upload className="h-4 w-4 shrink-0" />
                {showActionLabels && <span>Thêm tài liệu</span>}
              </Button>
            )}
          </HeaderActionsRow>
        }
      />

      <div className="bg-card rounded-2xl shadow-xl border border-border/40 overflow-hidden flex-1 flex flex-col min-h-0 h-full w-full p-3 sm:p-4 @container">
        <div className="shrink-0 mb-3">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto relative pr-1 custom-scrollbar">
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
          <div className="shrink-0 flex items-center justify-center gap-4 pt-3 border-t border-border/40 mt-auto">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="p-2 border rounded-full hover:bg-muted disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium">Trang {page + 1} / {totalPages}</span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="p-2 border rounded-full hover:bg-muted disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
