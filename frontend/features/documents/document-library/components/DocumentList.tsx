// ============================================================================
// FILE: document-library/components/DocumentList.tsx
// ============================================================================
import type { Document } from '@/lib/types';
import { Download, Eye, FileText, Trash2, Upload } from 'lucide-react';
import { memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  documents: Document[];
  searchQuery: string;
  onPreview: (doc: Document) => void;
  onDownload: (doc: Document) => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
}

export const DocumentList = memo(({ documents, searchQuery, onPreview, onDownload, onDelete, onAddNew }: Props) => {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';

  if (documents.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border/60 overflow-hidden">
        <div className="bg-card w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-border/40">
          <FileText className="text-muted-foreground" size={32} />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">
          {searchQuery ? 'Không tìm thấy tài liệu' : 'Chưa có tài liệu nào'}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
          {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Tải lên tài liệu để chia sẻ với học sinh'}
        </p>

        {!isStudent && (
          <button
            onClick={onAddNew}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-medium inline-flex items-center gap-2 transition-all shadow-md shadow-primary/20 hover:shadow-lg active:scale-95"
          >
            <Upload size={18} />
            Thêm tài liệu mới
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5 overflow-x-hidden pr-1">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group border border-border/40 bg-white dark:bg-gray-800/50 rounded-lg p-2.5 hover:shadow-md hover:border-primary/20 transition-all duration-200 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <FileText size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm md:text-base truncate group-hover:text-primary transition-colors">
                  {doc.title}
                </h3>
                {doc.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{doc.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-muted-foreground mt-1">
                  <span className="font-medium text-foreground bg-muted/50 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                    {doc.fileName}
                  </span>
                  <span className="opacity-60">{doc.formattedFileSize}</span>
                  <span className="flex items-center gap-1 opacity-60">
                    <Download size={10} /> {doc.downloadCount}
                  </span>
                  <span className="opacity-60">{new Date(doc.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onPreview(doc)}
                className="bg-blue-50/50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
              >
                <Eye size={14} />
                <span className="hidden sm:inline">Xem</span>
              </button>
              <button
                onClick={() => onDownload(doc)}
                className="bg-emerald-50/50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 dark:text-emerald-400 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Tải về</span>
              </button>
              {!isStudent && (
                <button
                  onClick={() => onDelete(doc.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

DocumentList.displayName = 'DocumentList';