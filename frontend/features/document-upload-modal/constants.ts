// 📁 document-upload-modal/constants.ts
export const CATEGORIES = [
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

export const VALID_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
