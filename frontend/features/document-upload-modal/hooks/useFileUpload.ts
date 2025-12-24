// 📁 document-upload-modal/hooks/useFileUpload.ts
import { useState } from 'react';
import { documentsApi } from '@/lib/services';
import type { DocumentUploadRequest } from '@/lib/types';

export function useFileUpload() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, data: DocumentUploadRequest) => {
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => p >= 90 ? 90 : p + 10);
    }, 200);

    try {
      await documentsApi.upload(file, data);
      clearInterval(interval);
      setProgress(100);
    } catch (error) {
      clearInterval(interval);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, progress };
}