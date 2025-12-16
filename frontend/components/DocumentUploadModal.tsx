
'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { documentsApi } from '@/lib/api';
import type { DocumentCategory, DocumentUploadRequest } from '@/lib/types';

interface DocumentUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
  defaultCategory?: DocumentCategory;
}

const CATEGORIES = [
  { key: 'GRAMMAR', name: 'Ngữ pháp', icon: '📚' },
  { key: 'VOCABULARY', name: 'Từ vựng', icon: '📖' },
  { key: 'READING', name: 'Đọc hiểu', icon: '📰' },
  { key: 'LISTENING', name: 'Nghe hiểu', icon: '🎧' },
  { key: 'SPEAKING', name: 'Nói', icon: '🗣️' },
  { key: 'WRITING', name: 'Viết', icon: '✍️' },
  { key: 'EXERCISES', name: 'Bài tập', icon: '📝' },
  { key: 'EXAM', name: 'Đề thi', icon: '📋' },
  { key: 'PET', name: 'PET (B1)', icon: '🎯' },
  { key: 'FCE', name: 'FCE (B2)', icon: '🏆' },
  { key: 'IELTS', name: 'IELTS', icon: '🌐' },
  { key: 'TOEIC', name: 'TOEIC', icon: '💼' },
  { key: 'OTHER', name: 'Khác', icon: '📄' },
];

export default function DocumentUploadModal({
  onClose,
  onSuccess,
  defaultCategory,
}: DocumentUploadModalProps) {
  const [formData, setFormData] = useState<DocumentUploadRequest>({
    title: '',
    category: defaultCategory || 'GRAMMAR',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
      ];

      if (!validTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file PDF, DOC, DOCX, PPT, PPTX, TXT');
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 50MB');
        return;
      }

      setSelectedFile(file);

      if (!formData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        setFormData({ ...formData, title: fileName });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Vui lòng chọn file!');
      return;
    }

    if (!formData.title) {
      alert('Vui lòng nhập tiêu đề!');
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await documentsApi.upload(selectedFile, formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Không thể tải lên tài liệu!');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full p-6 flex-shrink-0 border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-card-foreground">Tải lên tài liệu</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Chọn file *
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  selectedFile
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary hover:bg-muted'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="text-primary" size={32} />
                    <div className="text-left">
                      <p className="font-medium text-card-foreground text-sm">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto text-muted-foreground mb-2" size={32} />
                    <p className="text-muted-foreground text-sm mb-1">
                      Click để chọn file hoặc kéo thả file vào đây
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX, PPT, PPTX, TXT (Max 50MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Tiêu đề *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Tên tài liệu"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Danh mục *
              </label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as DocumentCategory })
                  }
                  className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none pr-10"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Mô tả ngắn về tài liệu..."
                rows={3}
              />
            </div>

            {/* Upload Progress */}
            {loading && (
              <div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Đang tải lên...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Upload size={20} />
              {loading ? 'Đang tải lên...' : 'Tải lên'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-secondary hover:bg-secondary/80 disabled:opacity-50 text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
