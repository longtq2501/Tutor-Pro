// ============================================================================
// 📁 document-preview-modal/hooks/useDocumentPreview.ts
// ============================================================================

import { useState, useEffect } from 'react';
import { documentsApi } from '@/lib/services';

export function useDocumentPreview(documentId: number) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadPreview();
    
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [documentId]);

  const loadPreview = async () => {
    try {
      setLoading(true);
      setError(false);
      const url = await documentsApi.getPreviewUrl(documentId);
      setPreviewUrl(url);
    } catch (err) {
      console.error('Error loading preview:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { previewUrl, loading, error, reload: loadPreview };
}