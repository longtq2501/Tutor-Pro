// ============================================================================
// FILE: document-library/hooks/useDocumentActions.ts
// ============================================================================
import { documentsApi } from '@/lib/services';
import type { Document } from '@/lib/types';

export const useDocumentActions = (loadDocuments: () => void, loadCategoryDocuments: () => void, selectedCategory: any) => {
  const handleDownload = async (doc: Document) => {
    try {
      const response = await documentsApi.download(doc.id);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      if (selectedCategory) loadCategoryDocuments();
      loadDocuments();
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Không thể tải xuống tài liệu!');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa tài liệu này?')) return;
    try {
      await documentsApi.delete(id);
      if (selectedCategory) loadCategoryDocuments();
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Không thể xóa tài liệu!');
    }
  };

  return { handleDownload, handleDelete };
};