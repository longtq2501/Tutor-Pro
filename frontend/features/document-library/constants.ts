
// ============================================================================
// FILE: document-library/constants.ts
// ============================================================================
import type { DocumentCategory } from '@/lib/types';

export const CATEGORIES = [
  { key: 'GRAMMAR', name: 'Ngữ pháp', icon: '📚', color: 'from-blue-400 to-blue-600' },
  { key: 'VOCABULARY', name: 'Từ vựng', icon: '📖', color: 'from-green-400 to-green-600' },
  { key: 'READING', name: 'Đọc hiểu', icon: '📰', color: 'from-yellow-400 to-yellow-600' },
  { key: 'LISTENING', name: 'Nghe hiểu', icon: '🎧', color: 'from-orange-400 to-orange-600' },
  { key: 'SPEAKING', name: 'Nói', icon: '🗣️', color: 'from-red-400 to-red-600' },
  { key: 'WRITING', name: 'Viết', icon: '✍️', color: 'from-pink-400 to-pink-600' },
  { key: 'EXERCISES', name: 'Bài tập', icon: '📝', color: 'from-cyan-400 to-cyan-600' },
  { key: 'EXAM', name: 'Đề thi', icon: '📋', color: 'from-purple-400 to-purple-600' },
  { key: 'PET', name: 'PET (B1)', icon: '🎯', color: 'from-teal-400 to-teal-600' },
  { key: 'FCE', name: 'FCE (B2)', icon: '🏆', color: 'from-rose-400 to-rose-600' },
  { key: 'IELTS', name: 'IELTS', icon: '🌐', color: 'from-indigo-400 to-indigo-600' },
  { key: 'TOEIC', name: 'TOEIC', icon: '💼', color: 'from-emerald-400 to-emerald-600' },
  { key: 'OTHER', name: 'Khác', icon: '📄', color: 'from-gray-400 to-gray-600' },
] as const;