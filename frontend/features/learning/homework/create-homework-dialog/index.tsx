// ============================================================================
// FILE: create-homework-dialog/index.tsx (MAIN)
// ============================================================================
'use client';

import React from 'react';
import { homeworkApi } from '@/lib/services';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import type { CreateHomeworkDialogProps } from './types';
import { useHomeworkForm } from './hooks/useHomeworkForm';
import { useFileUpload } from './hooks/useFileUpload';
import { TextField, TextAreaField, DateTimeField, PrioritySelect } from './components/FormField';
import { FileUploadSection } from './components/FileUploadSection';

export default function CreateHomeworkDialog({
  studentId,
  open,
  onClose,
  onSuccess,
}: CreateHomeworkDialogProps) {
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);

  const {
    formData,
    uploadedFiles,
    uploading,
    submitting,
    updateField,
    setUploadedFiles,
    setUploading,
    setSubmitting,
    resetForm,
    validate,
  } = useHomeworkForm(studentId);

  const { handleUpload, handleRemove } = useFileUpload(
    isAdmin,
    uploadedFiles,
    setUploadedFiles,
    setUploading
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validate();
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setSubmitting(true);
    try {
      const api = isAdmin ? homeworkApi.admin : homeworkApi.tutor;
      await api.create({
        ...formData,
        attachmentUrls: uploadedFiles.map(f => f.url),
      });

      resetForm();
      onSuccess();
    } catch (error) {
      console.error('Failed to create homework:', error);
      toast.error('Không thể tạo bài tập');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài tập mới</DialogTitle>
          <DialogDescription>Điền thông tin bài tập cho học sinh</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            id="title"
            label="Tiêu đề"
            value={formData.title}
            onChange={(v: string) => updateField('title', v)}
            placeholder="VD: Bài tập Toán - Chương 5"
            required
          />

          <TextAreaField
            id="description"
            label="Mô tả"
            value={formData.description}
            onChange={(v: string) => updateField('description', v)}
            placeholder="Làm tất cả bài tập từ 5.1 đến 5.30..."
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <DateTimeField
              id="dueDate"
              label="Hạn nộp"
              value={formData.dueDate}
              onChange={(v: string) => updateField('dueDate', v)}
              required
            />

            <PrioritySelect
              value={formData.priority}
              onChange={(v: 'LOW' | 'MEDIUM' | 'HIGH') => updateField('priority', v)}
            />
          </div>

          <TextAreaField
            id="tutorNotes"
            label="Ghi chú cho học sinh"
            value={formData.tutorNotes}
            onChange={(v: string) => updateField('tutorNotes', v)}
            placeholder="Chú ý đặc biệt bài 5.15 và 5.20..."
            rows={3}
          />

          <FileUploadSection
            uploadedFiles={uploadedFiles}
            uploading={uploading}
            onUpload={handleUpload}
            onRemove={handleRemove}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting || uploading}>
              {submitting ? 'Đang tạo...' : 'Tạo bài tập'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}