// ============================================================================
// 📁 document-preview-modal/components/ModalHeader.tsx
// ============================================================================

import type { Document } from '@/lib/types';
import { Download, ExternalLink, FileText, Loader2, Trash2, X } from 'lucide-react';

interface ModalHeaderProps {
  document: Document;
  downloading: boolean;
  onClose: () => void;
  onDownload: () => void;
  onDelete?: () => void;
  onOpenInNewTab: () => void;
}

export function ModalHeader({
  document: doc,
  downloading,
  onClose,
  onDownload,
  onDelete,
  onOpenInNewTab,
}: ModalHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-border/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md gap-4 z-20">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
          <FileText size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate mb-1">
            {doc.title}
          </h2>
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground flex-wrap font-medium">
            <span className="truncate max-w-[120px] sm:max-w-none">{doc.fileName}</span>
            <span className="hidden sm:inline">•</span>
            <span>{doc.formattedFileSize}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1">
              <Download size={12} />
              {doc.downloadCount} lượt
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={onOpenInNewTab}
          className="p-2 hover:bg-accent dark:hover:bg-gray-700 rounded-lg transition-colors hidden sm:block"
          title="Mở tab mới"
          type="button"
        >
          <ExternalLink size={18} className="text-foreground dark:text-gray-300" />
        </button>

        <button
          onClick={onDownload}
          disabled={downloading}
          className="px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          type="button"
        >
          {downloading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className="hidden sm:inline">Đang tải...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span className="hidden sm:inline">Tải xuống</span>
            </>
          )}
        </button>

        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
            title="Xóa"
            type="button"
          >
            <Trash2 size={18} />
          </button>
        )}

        <button
          onClick={onClose}
          className="p-2 hover:bg-accent dark:hover:bg-gray-700 rounded-lg transition-colors"
          type="button"
        >
          <X size={20} className="text-foreground dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
}
