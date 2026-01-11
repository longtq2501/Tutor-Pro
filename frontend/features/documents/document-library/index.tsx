// ============================================================================
// FILE: document-library/index.tsx (MAIN)
// ============================================================================
'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import type { Document } from '@/lib/types';
import { useDocumentLibrary } from './hooks/useDocumentLibrary';
import { useDocumentActions } from './hooks/useDocumentActions';
import { LoadingState } from './components/LoadingState';
import { StatsCards } from './components/StatsCards';
import { SearchBar } from './components/SearchBar';
import { CategoryGrid } from './components/CategoryGrid';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryView } from './components/CategoryView';
import DocumentUploadModal from '@/features/documents/document-upload-modal';
import DocumentPreviewModal from '@/features/documents/document-preview-modal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

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
    isCategoriesLoading
  } = useDocumentLibrary();

  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';

  const { handleDownload, handleDelete: executeDelete } = useDocumentActions(loadDocuments, loadCategoryDocuments, selectedCategory);

  const [showUploadModal, setShowUploadModal] = useState(false);
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
    }
  };

  // if (loading) return <LoadingState />; // Removed to support Skeleton

  if (!selectedCategory) {
    return (
      <>
        <div className="bg-card rounded-2xl shadow-lg p-4 lg:p-6 transition-colors border border-border">
          {/* ... Dashboard content ... */}
          {/* We could potentially show skeleton here if needed, but dashboard data (stats/categories) usually loads fast or can have its own skeletons later. For now, we focus on CategoryView */}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-card-foreground">Kho Tài Liệu Tiếng Anh</h2>
              <p className="text-muted-foreground text-xs lg:text-sm mt-1">Quản lý tài liệu theo danh mục để dễ tìm kiếm sau này</p>
            </div>
            {!isStudent && (
              <button onClick={() => setShowUploadModal(true)} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                <Upload size={18} />
                Tải lên
              </button>
            )}
          </div>

          <StatsCards stats={stats} />
          <SearchBar value="" onChange={() => { }} disabled />
          <CategoryGrid
            categories={categories}
            counts={stats.categoryCounts}
            onCategoryClick={setSelectedCategory}
            isLoading={isCategoriesLoading}
          />
        </div>

        {showUploadModal && (
          <DocumentUploadModal
            onClose={() => setShowUploadModal(false)}
            onSuccess={() => { setShowUploadModal(false); loadDocuments(); }}
          />
        )}
      </>
    );
  }

  const fullSelectedCategory = categories.find(c => c.code === selectedCategory) || selectedCategory;

  return (
    <>
      <CategoryView
        category={fullSelectedCategory as any}
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
          onSuccess={() => { setShowUploadModal(false); loadCategoryDocuments(); loadDocuments(); }}
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