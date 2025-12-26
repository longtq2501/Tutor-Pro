// ============================================================================
// FILE: document-library/hooks/useDocumentLibrary.ts
// ============================================================================
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '@/lib/services';
import type { Document, DocumentCategory } from '@/lib/types';
import { formatFileSize } from '../utils';

export const useDocumentLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Single source of truth (Cache all docs)
  const {
    data: allDocuments = [],
    isLoading: loading,
    refetch: loadDocuments
  } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => (await documentsApi.getAll()) as unknown as Document[],
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,
  });

  // 2. Client-side filtering (Instant UI updates)
  const categoryDocs = useMemo(() => {
    let docs = allDocuments;

    if (selectedCategory) {
      docs = docs.filter(doc => doc.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(doc => doc.title.toLowerCase().includes(q));
    }

    return docs;
  }, [allDocuments, selectedCategory, searchQuery]);

  // 3. Stats calculation
  const stats = useMemo(() => {
    const total = allDocuments.length;
    const downloads = allDocuments.reduce((sum, doc) => sum + doc.downloadCount, 0);
    const totalSize = allDocuments.reduce((sum, doc) => sum + doc.fileSize, 0);
    return { total, downloads, size: formatFileSize(totalSize) };
  }, [allDocuments]);

  // Compatibility wrapper
  const loadCategoryDocuments = () => {
    // No-op: client side filtering handles this now
  };

  return {
    documents: allDocuments,
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