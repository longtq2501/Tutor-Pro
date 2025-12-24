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
import { CategoryView } from './components/CategoryView';
import DocumentUploadModal from '@/features/document-upload-modal';
import DocumentPreviewModal from '@/features/document-preview-modal';

export default function DocumentLibrary() {
  const {
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
  } = useDocumentLibrary();

  const { handleDownload, handleDelete } = useDocumentActions(loadDocuments, loadCategoryDocuments, selectedCategory);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);

  if (loading) return <LoadingState />;

  if (!selectedCategory) {
    return (
      <>
        <div className="bg-card rounded-2xl shadow-lg p-4 lg:p-6 transition-colors border border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-card-foreground">Kho Tài Liệu Tiếng Anh</h2>
              <p className="text-muted-foreground text-xs lg:text-sm mt-1">Quản lý tài liệu theo danh mục để dễ tìm kiếm sau này</p>
            </div>
            <button onClick={() => setShowUploadModal(true)} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
              <Upload size={18} />
              Tải lên
            </button>
          </div>

          <StatsCards stats={stats} />
          <SearchBar value="" onChange={() => {}} disabled />
          <CategoryGrid documents={documents} onCategoryClick={setSelectedCategory} />
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

  return (
    <>
      <CategoryView
        category={selectedCategory}
        documents={categoryDocs}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBack={() => { setSelectedCategory(null); setSearchQuery(''); }}
        onUpload={() => setShowUploadModal(true)}
        onPreview={setPreviewDocument}
        onDownload={handleDownload}
        onDelete={handleDelete}
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
          onDelete={handleDelete}
        />
      )}
    </>
  );
}