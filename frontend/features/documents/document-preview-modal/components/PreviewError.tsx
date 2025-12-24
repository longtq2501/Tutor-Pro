// ============================================================================
// 📁 document-preview-modal/components/PreviewError.tsx
// ============================================================================

import { Download, FileText, Loader2 } from 'lucide-react';

interface PreviewErrorProps {
  downloading: boolean;
  onDownload: () => void;
}

export function PreviewError({ downloading, onDownload }: PreviewErrorProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <FileText className="text-muted-foreground dark:text-gray-400 mx-auto mb-4" size={64} />
        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2">
          Không thể xem trước
        </h3>
        <p className="text-muted-foreground dark:text-gray-400 mb-4 text-sm">
          Không thể hiển thị xem trước cho loại file này. Vui lòng tải xuống để xem.
        </p>
        <button
          onClick={onDownload}
          disabled={downloading}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium inline-flex items-center gap-2 disabled:opacity-50"
          type="button"
        >
          {downloading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Đang tải...
            </>
          ) : (
            <>
              <Download size={18} />
              Tải xuống
            </>
          )}
        </button>
      </div>
    </div>
  );
}