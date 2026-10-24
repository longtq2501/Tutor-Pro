import { Upload, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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
    <div className="space-y-4 pb-24 sm:pb-32">
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

      <div className="bg-card rounded-xl shadow-md p-3 lg:p-4 transition-colors border border-border">
        <SearchBar value={searchQuery} onChange={onSearchChange} />

        <div className="mt-2 relative min-h-[400px]">
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 top-0 left-0 w-full"
              >
                <DocumentListSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DocumentList
                  documents={documents}
                  searchQuery={searchQuery}
                  onPreview={onPreview}
                  onDownload={onDownload}
                  onDelete={onDelete}
                  onAddNew={onUpload}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
