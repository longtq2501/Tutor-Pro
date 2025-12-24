// ============================================================================
// 📁 document-preview-modal/components/DocumentInfo.tsx
// ============================================================================

import { Download, FileText, Loader2 } from 'lucide-react';
import type { Document } from '@/lib/types';

interface DocumentInfoProps {
  document: Document;
  downloading: boolean;
  onDownload: () => void;
}

export function DocumentInfo({ document: doc, downloading, onDownload }: DocumentInfoProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="text-center max-w-md p-6 sm:p-8 bg-card dark:bg-gray-800 rounded-xl shadow-lg border border-border dark:border-gray-700">
        <FileText className="text-primary mx-auto mb-4" size={64} />
        <h3 className="text-base sm:text-lg font-semibold text-foreground dark:text-white mb-2">
          {doc.fileName}
        </h3>
        {doc.description && (
          <p className="text-muted-foreground dark:text-gray-400 mb-4 text-sm">{doc.description}</p>
        )}
        <div className="bg-muted dark:bg-gray-700 rounded-lg p-3 sm:p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-muted-foreground dark:text-gray-400">Loại file</p>
              <p className="font-medium text-foreground dark:text-white">
                {doc.fileType.split('/')[1]?.toUpperCase() || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground dark:text-gray-400">Kích thước</p>
              <p className="font-medium text-foreground dark:text-white">
                {doc.formattedFileSize}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground dark:text-gray-400">Lượt tải</p>
              <p className="font-medium text-foreground dark:text-white">
                {doc.downloadCount} lượt
              </p>
            </div>
            <div>
              <p className="text-muted-foreground dark:text-gray-400">Ngày tạo</p>
              <p className="font-medium text-foreground dark:text-white">
                {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mb-4">
          Xem trước không khả dụng cho loại file này. Vui lòng tải xuống để xem nội dung.
        </p>
        <button
          onClick={onDownload}
          disabled={downloading}
          className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50"
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
              Tải xuống để xem
            </>
          )}
        </button>
      </div>
    </div>
  );
}