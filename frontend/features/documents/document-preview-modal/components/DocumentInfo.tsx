// ============================================================================
// 📁 document-preview-modal/components/DocumentInfo.tsx
// ============================================================================

import type { Document } from '@/lib/types';
import { Download, FileText, Loader2 } from 'lucide-react';

interface DocumentInfoProps {
  document: Document;
  downloading: boolean;
  onDownload: () => void;
}

export function DocumentInfo({ document: doc, downloading, onDownload }: DocumentInfoProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-transparent to-muted/20">
      <div className="text-center max-w-md w-full p-5 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-border/50 dark:border-gray-700/50 backdrop-blur-sm mx-4">
        <div className="mx-auto w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-blue-500 dark:text-blue-400">
          <FileText size={48} strokeWidth={1.5} />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {doc.fileName}
        </h3>

        {doc.description && (
          <p className="text-muted-foreground dark:text-gray-400 mb-6 text-sm">{doc.description}</p>
        )}

        <div className="bg-muted/50 dark:bg-gray-700/30 rounded-xl p-4 mb-6 border border-border/50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <p className="text-muted-foreground text-xs mb-1">Loại file</p>
              <p className="font-semibold text-foreground">
                {doc.fileType.split('/')[1]?.toUpperCase() || 'Unknown'}
              </p>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground text-xs mb-1">Kích thước</p>
              <p className="font-semibold text-foreground">
                {doc.formattedFileSize}
              </p>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground text-xs mb-1">Lượt tải</p>
              <p className="font-semibold text-foreground">
                {doc.downloadCount} lượt
              </p>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground text-xs mb-1">Ngày tạo</p>
              <p className="font-semibold text-foreground">
                {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg mb-6 inline-block">
          Xem trước không khả dụng cho loại file này
        </p>

        <button
          onClick={onDownload}
          disabled={downloading}
          className="w-full px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          type="button"
        >
          {downloading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Đang tải xuống...
            </>
          ) : (
            <>
              <Download size={20} />
              Tải xuống để xem
            </>
          )}
        </button>
      </div>
    </div>
  );
}