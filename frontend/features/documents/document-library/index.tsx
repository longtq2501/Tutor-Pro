// ============================================================================
// FILE: document-library/index.tsx (MAIN)
// ============================================================================
'use client';

import { useState } from 'react';
import type { Document, DocumentCategory, Category } from '@/lib/types';
import { useDocumentLibrary } from './hooks/useDocumentLibrary';
import { useDocumentActions } from './hooks/useDocumentActions';
import { StatsCards } from './components/StatsCards';
import { SearchBar } from './components/SearchBar';
import { CategoryGrid } from './components/CategoryGrid';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryView } from './components/CategoryView';
import { DocumentLibraryActions } from './components/DocumentLibraryActions';
import { CategoryFormModal } from './components/CategoryFormModal';
import DocumentUploadModal from '@/features/documents/document-upload-modal';
import DocumentPreviewModal from '@/features/documents/document-preview-modal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardHeader } from '@/contexts/UIContext';

export default function DocumentLibrary() {
  const {
    documents,
    categories,
    selectedCategory,
    setSelectedCategory,
    categoryDocs,
    searchQuery,
    setSearchQuery,
    loading,
    stats,
    loadDocuments,
    loadCategoryDocuments,
    page,
    setPage,
    totalPages,
    isCategoriesLoading,
    loadMoreCategories,
    hasMoreCategories,
    isFetchingMoreCategories
  } = useDocumentLibrary();

  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const queryClient = useQueryClient();

  const { handleDownload, handleDelete: executeDelete } = useDocumentActions(loadDocuments, loadCategoryDocuments, selectedCategory);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleDeleteTrigger = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      executeDelete(deleteConfirmId);
      setDeleteConfirmId(null);
      // If we are in preview, close it too
      if (previewDocument && previewDocument.id === deleteConfirmId) {
        setPreviewDocument(null);
      }
      // Invalidate stats to refresh counts
      queryClient.invalidateQueries({ queryKey: ['documents', 'stats'] });
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    loadDocuments();
    loadCategoryDocuments();
    // Invalidate stats to refresh counts
    queryClient.invalidateQueries({ queryKey: ['documents', 'stats'] });
  };

  if (!selectedCategory) {
    return (
      <>
        <DashboardHeader
          title="Kho Tài Liệu Tiếng Anh"
          subtitle="Quản lý tài liệu theo danh mục để dễ tìm kiếm sau này"
          actions={!isStudent && (
            <DocumentLibraryActions
              onAddCategory={() => {
                setEditingCategory(null);
                setIsCategoryFormOpen(true);
              }}
              onUpload={() => setShowUploadModal(true)}
            />
          )}
        />

        <div className="space-y-6 pb-20 sm:pb-32">
          <div data-tour="documents-stats">
            <StatsCards stats={stats} />
          </div>
          <div data-tour="documents-grid">
            <CategoryGrid
              categories={categories}
              counts={stats.categoryCounts}
              onCategoryClick={setSelectedCategory}
              isLoading={isCategoriesLoading}
              loadMoreCategories={loadMoreCategories}
              hasMoreCategories={hasMoreCategories}
              isFetchingMoreCategories={isFetchingMoreCategories}
            />
          </div>
        </div>

        {showUploadModal && (
          <DocumentUploadModal
            onClose={() => setShowUploadModal(false)}
            onSuccess={handleUploadSuccess}
          />
        )}

        <CategoryFormModal
          open={isCategoryFormOpen}
          onOpenChange={setIsCategoryFormOpen}
          initialData={editingCategory}
        />
      </>
    );
  }

  const foundCategory = categories.find(c => c.code === selectedCategory);
  const fullSelectedCategory = foundCategory || (selectedCategory as DocumentCategory);

  return (
    <>
      <CategoryView
        category={fullSelectedCategory}
        documents={categoryDocs}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBack={() => { setSelectedCategory(null); setSearchQuery(''); }}
        onUpload={() => setShowUploadModal(true)}
        onPreview={setPreviewDocument}
        onDownload={handleDownload}
        onDelete={handleDeleteTrigger}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        isLoading={loading}
      />

      {showUploadModal && (
        <DocumentUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
          defaultCategory={selectedCategory}
        />
      )}

      {previewDocument && (
        <DocumentPreviewModal
          document={previewDocument}
          onClose={() => setPreviewDocument(null)}
          onDownload={handleDownload}
          onDelete={handleDeleteTrigger}
        />
      )}

      <ConfirmDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác."
        variant="destructive"
        confirmText="Xóa tài liệu"
      />
    </>
  );
}