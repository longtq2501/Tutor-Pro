// ============================================================================
// FILE: document-library/hooks/useDocumentLibrary.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { documentsApi } from '@/lib/services';
import type { Document, DocumentCategory } from '@/lib/types';
import { formatFileSize } from '../utils';

export const useDocumentLibrary = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);
  const [categoryDocs, setCategoryDocs] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, downloads: 0, size: '0 B' });

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentsApi.getAll();
      setDocuments(response as unknown as Document[]);
      
      const total = response.length;
      const downloads = response.reduce((sum, doc) => sum + (doc as unknown as Document).downloadCount, 0);
      const totalSize = response.reduce((sum, doc) => sum + (doc as unknown as Document).fileSize, 0);
      
      setStats({ total, downloads, size: formatFileSize(totalSize) });
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryDocuments = async () => {
    if (!selectedCategory) return;
    try {
      const response = await documentsApi.getByCategory(selectedCategory);
      setCategoryDocs(response as unknown as Document[]);
    } catch (error) {
      console.error('Error loading category documents:', error);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    if (selectedCategory) loadCategoryDocuments();
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory && searchQuery) {
      setCategoryDocs(prev => prev.filter(doc => doc.title.toLowerCase().includes(searchQuery.toLowerCase())));
    } else if (selectedCategory) {
      loadCategoryDocuments();
    }
  }, [searchQuery]);

  return {
    documents,
    selectedCategory,
    setSelectedCategory,
    categoryDocs,
    searchQuery,
    setSearchQuery,
    loading,
    stats,
    loadDocuments,
    loadCategoryDocuments,
  };
};