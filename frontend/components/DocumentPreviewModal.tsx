'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Download, Trash2, ExternalLink, FileText, Loader2 } from 'lucide-react';
import type { Document } from '@/lib/types';
import { documentsApi } from '@/lib/api';

interface DocumentPreviewModalProps {
  document: Document;
  onClose: () => void;
  onDownload: (doc: Document) => void;
  onDelete: (id: number) => void;
}

export default function DocumentPreviewModal({
  document: doc,
  onClose,
  onDownload,
  onDelete,
}: DocumentPreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(false);
  const downloadInProgressRef = useRef(false);

  useEffect(() => {
    loadPreview();
    
    // Cleanup blob URL
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [doc.id]);

  const loadPreview = async () => {
    try {
      setLoading(true);
      setError(false);
      
      // ✅ Use existing API function with proper axios config
      const url = await documentsApi.getPreviewUrl(doc.id);
      
      setPreviewUrl(url);
      setLoading(false);
    } catch (err) {
      console.error('Error loading preview:', err);
      setError(true);
      setLoading(false);
    }
  };

  // ✅ Download with proper isolation
  const handleDownload = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (downloadInProgressRef.current) {
      return;
    }

    try {
      downloadInProgressRef.current = true;
      setDownloading(true);
      
      // Get file as blob
      const blob = await documentsApi.download(doc.id);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = doc.fileName;
      link.style.display = 'none';
      
      window.document.body.appendChild(link);
      link.click();
      
      // Cleanup after download starts
      setTimeout(() => {
        window.document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Không thể tải file. Vui lòng thử lại.');
    } finally {
      setTimeout(() => {
        downloadInProgressRef.current = false;
        setDownloading(false);
      }, 300);
    }
  }, [doc]);

  const handleDelete = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (confirm('Xóa tài liệu này?')) {
      onDelete(doc.id);
      onClose();
    }
  }, [doc.id, onDelete, onClose]);

  const handleOpenInNewTab = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (previewUrl) {
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
    }
  }, [previewUrl]);

  const handleClose = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (downloadInProgressRef.current) {
      return;
    }
    
    onClose();
  }, [onClose]);

  const canPreview = doc.fileType === 'application/pdf';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-0 md:p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 w-full h-full md:w-[90vw] md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-border bg-muted/30 dark:bg-gray-800 gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <FileText className="text-muted-foreground dark:text-gray-400 flex-shrink-0" size={20} />
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-foreground dark:text-white truncate">
                {doc.title}
              </h2>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground dark:text-gray-400 flex-wrap">
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
              onClick={handleOpenInNewTab}
              className="p-2 hover:bg-accent dark:hover:bg-gray-700 rounded-lg transition-colors hidden sm:block"
              title="Mở tab mới"
              type="button"
            >
              <ExternalLink size={18} className="text-foreground dark:text-gray-300" />
            </button>
            
            <button
              onClick={handleDownload}
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
            
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
              title="Xóa"
              type="button"
            >
              <Trash2 size={18} />
            </button>
            
            <button
              onClick={handleClose}
              className="p-2 hover:bg-accent dark:hover:bg-gray-700 rounded-lg transition-colors"
              type="button"
            >
              <X size={20} className="text-foreground dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden bg-muted/50 dark:bg-gray-800 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
                <p className="text-muted-foreground dark:text-gray-400">Đang tải xem trước...</p>
              </div>
            </div>
          )}

          {error && (
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
                  onClick={handleDownload}
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
          )}

          {!loading && !error && canPreview && (
            <iframe
              src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              className="w-full h-full border-0"
              title={doc.title}
            />
          )}

          {!loading && !error && !canPreview && (
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
                  onClick={handleDownload}
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
          )}
        </div>

        {/* Footer Info - Responsive */}
        {doc.description && (
          <div className="p-3 sm:p-4 border-t border-border dark:border-gray-700 bg-muted/30 dark:bg-gray-800">
            <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 line-clamp-2">
              <span className="font-medium">Mô tả:</span> {doc.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}