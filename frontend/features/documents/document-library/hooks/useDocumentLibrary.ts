import { useDocuments, useCategories } from '@/features/documents/hooks/useMasterDocuments';
import { documentsApi } from '@/lib/services';
import type { Document, DocumentCategory } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { formatFileSize } from '../utils';

export const useDocumentLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10); // Fixed size for now

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(0); // Reset page on search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when category changes
  useEffect(() => {
    setPage(0);
  }, [selectedCategory]);

  // 1. Fetch Categories
  const { data: categories = [] } = useCategories();

  // 2. Decide what to fetch: Search Mode vs Browse Mode
  const isSearchMode = !!debouncedSearchQuery;

  // Query for Browse Mode (Paginated)
  const {
    data: paginatedData,
    isLoading: cancelLoading,
    refetch: loadDocuments
  } = useDocuments(page, pageSize, selectedCategory || undefined);

  // Query for Search Mode (List - Non Paginated for now as backend supports List only)
  const {
    data: searchResults
  } = useQuery({
    queryKey: ['documents', 'search', debouncedSearchQuery],
    queryFn: () => documentsApi.search(debouncedSearchQuery),
    enabled: isSearchMode,
  });

  // 3. Unify Data Shape
  const documents = isSearchMode ? (searchResults || []) : (paginatedData?.content || []);
  const totalPages = isSearchMode ? 1 : (paginatedData?.totalPages || 0);
  const totalElements = isSearchMode ? documents.length : (paginatedData?.totalElements || 0);

  // 4. Stats (Mocked or separate API call needed)
  // Since we don't have all docs, we can't calc stats client side precisely.
  // We can fetch stats from API if needed, or just show 0/estimates.
  // Ideally use the existing getStats API.
  const { data: statsData } = useQuery({
    queryKey: ['documents', 'stats'],
    queryFn: documentsApi.getStats,
    staleTime: 60000
  });

  const stats = {
    total: statsData?.totalDocuments || 0,
    downloads: statsData?.totalDownloads || 0,
    size: statsData?.formattedTotalSize || '0 B',
    categoryCounts: statsData?.categoryStats || {}
  };

  const loadCategoryDocuments = loadDocuments; // Alias

  return {
    documents,
    categories,
    selectedCategory,
    setSelectedCategory,
    categoryDocs: documents, // In unified mode, documents IS the categoryDocs
    searchQuery,
    setSearchQuery,
    loading: cancelLoading && !isSearchMode,
    stats,
    page,
    setPage,
    totalPages,
    totalElements,
    loadDocuments,
    loadCategoryDocuments,
    isSearchMode
  };
};