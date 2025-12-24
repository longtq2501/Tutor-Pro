import { VALID_FILE_TYPES, MAX_FILE_SIZE } from "./constants";

// 📁 document-upload-modal/utils.ts
export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function validateFile(file: File) {
  if (!VALID_FILE_TYPES.includes(file.type)) {
    return 'Chỉ chấp nhận file PDF, DOC, DOCX, PPT, PPTX, TXT';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Kích thước file không được vượt quá 50MB';
  }
  return null;
}