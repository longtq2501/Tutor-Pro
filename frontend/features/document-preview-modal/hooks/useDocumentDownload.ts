// ============================================================================
// 📁 document-preview-modal/hooks/useDocumentDownload.ts
// ============================================================================

import { useState, useCallback, useRef } from 'react';
import { documentsApi } from '@/lib/services';
import type { Document } from '@/lib/types';

export function useDocumentDownload() {
  const [downloading, setDownloading] = useState(false);
  const downloadInProgressRef = useRef(false);

  const download = useCallback(async (doc: Document) => {
    if (downloadInProgressRef.current) return;

    try {
      downloadInProgressRef.current = true;
      setDownloading(true);
      
      const blob = await documentsApi.download(doc.id);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      
      link.href = url;
      link.download = doc.fileName;
      link.style.display = 'none';
      
      window.document.body.appendChild(link);
      link.click();
      
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
  }, []);

  return { 
    downloading, 
    download, 
    isDownloading: downloadInProgressRef.current 
  };
}
