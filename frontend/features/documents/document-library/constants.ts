
// ============================================================================
// FILE: document-library/constants.ts
// ============================================================================
import type { DocumentCategory } from '@/lib/types';

export const CATEGORIES = [
  { key: 'GRAMMAR', name: 'Ngữ pháp', icon: '📚', color: 'from-blue-400 to-blue-600' },
  { key: 'VOCABULARY', name: 'Từ vựng', icon: '📖', color: 'from-green-400 to-green-600' },
  { key: 'EXERCISES', name: 'Bài tập', icon: '📝', color: 'from-cyan-400 to-cyan-600' },
  { key: 'TICH_HOP', name: 'Tích hợp', icon: '📋', color: 'from-purple-400 to-purple-600' },
  { key: 'IELTS', name: 'IELTS', icon: '🌐', color: 'from-indigo-400 to-indigo-600' },
  { key: 'FLYERS', name: 'Flyers', icon: '📄', color: 'from-rose-400 to-rose-600' },
] as const;