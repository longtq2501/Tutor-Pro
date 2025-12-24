// 📁 homework-detail-dialog/hooks/useHomeworkSubmission.ts
import { useState } from 'react';
import { homeworkApi } from '@/lib/services';
import { toast } from 'sonner';

export function useHomeworkSubmission() {
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; filename: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const result = await homeworkApi.student.uploadFile(file);
      setUploadedFiles(prev => [...prev, result]);
      return result;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
    }
  };

  const uploadFiles = async (files: FileList) => {
    for (const file of Array.from(files)) {
      try {
        await uploadFile(file);
      } catch (error: any) {
        toast.error(`Không thể upload ${file.name}: ${error.message}`);
        throw error;
      }
    }
    toast.success(`Upload thành công ${files.length} file!`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(files => files.filter((_, i) => i !== index));
  };

  const submit = async (homeworkId: number, notes: string) => {
    if (uploadedFiles.length === 0) {
      toast.error('Vui lòng upload ít nhất 1 file');
      return false;
    }

    setSubmitting(true);
    try {
      await homeworkApi.student.submit(
        homeworkId,
        notes,
        uploadedFiles.map(f => f.url)
      );
      toast.success('Nộp bài thành công!');
      setUploadedFiles([]);
      return true;
    } catch (error: any) {
      toast.error(`Không thể nộp bài: ${error.response?.data?.message || error.message}`);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setUploadedFiles([]);
    setUploading(false);
    setSubmitting(false);
  };

  return { uploadedFiles, uploading, submitting, uploadFiles, removeFile, submit, reset };
}