// ============================================================================
// FILE: create-homework-dialog/types.ts
// ============================================================================
import type { HomeworkRequest } from '@/lib/types';

export interface CreateHomeworkDialogProps {
  studentId: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface UploadedFile {
  url: string;
  filename: string;
}

export type { HomeworkRequest };