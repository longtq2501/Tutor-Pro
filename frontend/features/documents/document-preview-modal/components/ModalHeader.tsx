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
    <div className="flex flex-row items-center justify-between p-3 sm:p-5 border-b border-border/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md gap-3 z-20">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="p-2 sm:p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
          <FileText size={20} className="sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate leading-tight">
            {doc.title}
          </h2>
          <div className="flex items-center gap-2 text-[10px] sm:text-sm text-muted-foreground flex-wrap font-medium mt-0.5 sm:mt-1">
            <span className="truncate max-w-[80px] sm:max-w-none">{doc.fileName}</span>
            <span>•</span>
            <span>{doc.formattedFileSize}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 justify-end shrink-0">
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
          className="px-2.5 py-2 sm:px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          type="button"
          title="Tải xuống"
        >
          {downloading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          <span className="hidden sm:inline">{downloading ? 'Đang tải...' : 'Tải xuống'}</span>
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
