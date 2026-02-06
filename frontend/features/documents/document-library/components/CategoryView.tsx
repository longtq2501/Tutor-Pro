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

  const categoryKey = typeof category === 'string' ? category : category.code;
  const categoryInfo = CATEGORIES.find(c => c.key === categoryKey);
  const name = categoryInfo?.name || (typeof category === 'object' ? category.name : category);

  return (
    <div className="space-y-4 pb-24 sm:pb-32">
      <DashboardHeader
        title={name}
        subtitle={`${documents.length} tài liệu`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl h-8 text-xs">
              <ArrowLeft className="mr-1 h-3 w-3" /> Quay lại
            </Button>
            {!isStudent && (
              <Button onClick={onUpload} size="sm" className="rounded-xl h-8 text-xs shadow-lg shadow-primary/20">
                <Upload size={14} className="mr-1" />
                Thêm tài liệu
              </Button>
            )}
          </div>
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
