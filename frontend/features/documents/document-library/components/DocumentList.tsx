// ============================================================================
// FILE: document-library/components/DocumentList.tsx
// ============================================================================
import type { Document } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Eye, FileText, Trash2, Upload } from 'lucide-react';
import { memo } from 'react';

interface Props {
  documents: Document[];
  searchQuery: string;
  onPreview: (doc: Document) => void;
  onDownload: (doc: Document) => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
}

export const DocumentList = memo(({ documents, searchQuery, onPreview, onDownload, onDelete, onAddNew }: Props) => {
  if (documents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border"
      >
        <div className="bg-white dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <FileText className="text-muted-foreground" size={40} />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {searchQuery ? 'Không tìm thấy tài liệu' : 'Chưa có tài liệu nào'}
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8">
          {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Tải lên tài liệu để chia sẻ với học sinh'}
        </p>

        <button
          onClick={onAddNew}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
        >
          <Upload size={20} />
          Thêm tài liệu mới
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="group border border-border/50 bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
              <div className="flex-1 min-w-0 flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <FileText size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base lg:text-lg truncate group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{doc.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="font-medium text-foreground bg-muted px-2 py-0.5 rounded-md truncate max-w-[150px]">
                      {doc.fileName}
                    </span>
                    <span>{doc.formattedFileSize}</span>
                    <span className="flex items-center gap-1">
                      <Download size={12} /> {doc.downloadCount}
                    </span>
                    <span>{new Date(doc.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:ml-4 border-t lg:border-t-0 pt-3 lg:pt-0">
                <button
                  onClick={() => onPreview(doc)}
                  className="flex-1 lg:flex-none bg-blue-50/50 hover:bg-blue-100 dark:bg-blue-900/10 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Eye size={16} />
                  <span>Xem</span>
                </button>
                <button
                  onClick={() => onDownload(doc)}
                  className="flex-1 lg:flex-none bg-emerald-50/50 hover:bg-emerald-100 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Tải về</span>
                </button>
                <button
                  onClick={() => onDelete(doc.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});