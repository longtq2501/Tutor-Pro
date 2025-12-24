// ============================================================================
// 📁 document-preview-modal/index.tsx
// ============================================================================

'use client';

import { useCallback } from 'react';
import type { Document } from '@/lib/types';
import { useDocumentPreview } from './hooks/useDocumentPreview';
import { useDocumentDownload } from './hooks/useDocumentDownload';
import { ModalHeader } from './components/ModalHeader';
import { PreviewLoading } from './components/PreviewLoading';
import { PreviewError } from './components/PreviewError';
import { PDFPreview } from './components/PDFPreview';
import { DocumentInfo } from './components/DocumentInfo';
import { ModalFooter } from './components/ModalFooter';

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
  const { previewUrl, loading, error } = useDocumentPreview(doc.id);
  const { downloading, download, isDownloading } = useDocumentDownload();

  const handleDownload = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await download(doc);
  }, [doc, download]);

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
    
    if (isDownloading) return;
    
    onClose();
  }, [onClose, isDownloading]);

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
        <ModalHeader
          document={doc}
          downloading={downloading}
          onClose={handleClose}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onOpenInNewTab={handleOpenInNewTab}
        />

        <div className="flex-1 overflow-hidden bg-muted/50 dark:bg-gray-800 relative">
          {loading && <PreviewLoading />}
          
          {error && (
            <PreviewError 
              downloading={downloading} 
              onDownload={handleDownload} 
            />
          )}
          
          {!loading && !error && canPreview && (
            <PDFPreview url={previewUrl} title={doc.title} />
          )}
          
          {!loading && !error && !canPreview && (
            <DocumentInfo 
              document={doc} 
              downloading={downloading} 
              onDownload={handleDownload} 
            />
          )}
        </div>

        <ModalFooter description={doc.description} />
      </div>
    </div>
  );
}