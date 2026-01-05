// ============================================================================
// FILE: document-library/hooks/useDocumentLibrary.ts
// ============================================================================
import { useMasterDocuments } from '@/features/documents/hooks/useMasterDocuments';
import type { Document, DocumentCategory } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { formatFileSize } from '../utils';

export const useDocumentLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 1. Single source of truth (Cache all docs)
  // 1. Single source of truth (Cache all docs)
  const {
    data: allDocuments = [],
    isLoading: loading,
    refetch: loadDocuments
  } = useMasterDocuments();

  // 2. Client-side filtering (Instant UI updates)
  const categoryDocs = useMemo(() => {
    let docs = allDocuments;

    if (selectedCategory) {
      docs = docs.filter(doc => doc.category === selectedCategory);
    }

    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      docs = docs.filter(doc => doc.title.toLowerCase().includes(q));
    }

    return docs;
  }, [allDocuments, selectedCategory, debouncedSearchQuery]);

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