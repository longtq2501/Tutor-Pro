// ============================================================================
// FILE: create-homework-dialog/hooks/useFileUpload.ts
// ============================================================================
import { homeworkApi } from '@/lib/services';
import { toast } from 'sonner';
import type { UploadedFile } from '../types';

export const useFileUpload = (
  isAdmin: boolean,
  uploadedFiles: UploadedFile[],
  setUploadedFiles: (files: UploadedFile[]) => void,
  setUploading: (uploading: boolean) => void
) => {
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const api = isAdmin ? homeworkApi.admin : homeworkApi.tutor;
      const uploadPromises = Array.from(files).map(file => api.uploadFile(file));
      const results = await Promise.all(uploadPromises);
      setUploadedFiles([...uploadedFiles, ...results]);
      toast.success('Upload file thành công!');
    } catch (error) {
      console.error('Failed to upload files:', error);
      toast.error('Không thể upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return { handleUpload, handleRemove };
};