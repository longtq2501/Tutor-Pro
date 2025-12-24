// ============================================================================
// FILE: create-homework-dialog/hooks/useHomeworkForm.ts
// ============================================================================
import { useState } from 'react';
import type { HomeworkRequest, UploadedFile } from '../types';

export const useHomeworkForm = (studentId: number) => {
  const [formData, setFormData] = useState<HomeworkRequest>({
    studentId,
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    tutorNotes: '',
    attachmentUrls: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof HomeworkRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      studentId,
      title: '',
      description: '',
      dueDate: '',
      priority: 'MEDIUM',
      tutorNotes: '',
      attachmentUrls: [],
    });
    setUploadedFiles([]);
  };

  const validate = () => {
    if (!formData.title || !formData.dueDate) {
      return { valid: false, error: 'Vui lòng điền đầy đủ thông tin bắt buộc' };
    }
    return { valid: true };
  };

  return {
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
  };
};