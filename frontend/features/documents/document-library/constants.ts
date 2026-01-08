
// ============================================================================
// FILE: document-library/constants.ts
// ============================================================================
import type { DocumentCategory } from '@/lib/types';

export const CATEGORIES = [
  { key: 'GRAMMAR', name: 'Ngữ pháp', icon: '📚' },
  { key: 'VOCABULARY', name: 'Từ vựng', icon: '📖' },
  { key: 'EXERCISES', name: 'Bài tập', icon: '📝' },
  { key: 'TICH_HOP', name: 'Tích hợp', icon: '📋' },
  { key: 'IELTS', name: 'IELTS', icon: '🌐' },
  { key: 'FLYERS', name: 'Flyers', icon: '📄' },
] as const;