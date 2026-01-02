// ============================================================================
// FILE: document-library/components/DocumentList.tsx
// ============================================================================
import type { Document } from '@/lib/types';
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
      <div className="text-center py-16">
        <FileText className="mx-auto text-muted-foreground mb-4" size={64} />
        <p className="text-muted-foreground text-lg mb-2">
          {searchQuery ? 'Không tìm thấy tài liệu' : 'Chưa có tài liệu nào'}
        </p>
        <button onClick={onAddNew} className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2 mt-4">
          <Upload size={18} />
          Thêm tài liệu đầu tiên
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc.id} className="border border-border bg-card rounded-lg p-3 lg:p-4 hover:shadow-md transition-all group will-change-transform contain-layout">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 lg:gap-3 mb-2">
                <FileText className="text-muted-foreground flex-shrink-0 mt-0.5" size={18} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground text-sm lg:text-base truncate">{doc.title}</h3>
                  {doc.description && <p className="text-xs lg:text-sm text-muted-foreground mt-1 line-clamp-2">{doc.description}</p>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground ml-6 lg:ml-8">
                <span className="truncate max-w-[150px]">{doc.fileName}</span>
                <span>•</span>
                <span>{doc.formattedFileSize}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Download size={12} />{doc.downloadCount}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{new Date(doc.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="flex gap-2 lg:ml-4">
              <button onClick={() => onPreview(doc)} className="flex-1 lg:flex-none bg-muted hover:bg-muted/80 text-foreground px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm" title="Xem trước">
                <Eye size={16} />
                <span>Xem</span>
              </button>
              <button onClick={() => onDownload(doc)} className="flex-1 lg:flex-none bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm">
                <Download size={16} />
                <span className="hidden sm:inline">Tải</span>
              </button>
              <button onClick={() => onDelete(doc.id)} className="bg-destructive/10 hover:bg-destructive/20 text-destructive p-2 rounded-lg transition-colors" title="Xóa">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});