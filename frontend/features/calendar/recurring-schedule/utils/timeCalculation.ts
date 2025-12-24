// ============================================================================
// 📁 recurring-schedule/utils/timeCalculation.ts
// ============================================================================
export const calculateHours = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  let diff = (new Date(0, 0, 0, endH, endM).getTime() - new Date(0, 0, 0, startH, startM).getTime()) / 3600000;
  if (diff < 0) diff += 24;
  return Math.round(diff * 10) / 10;
};

export const DAYS_OF_WEEK = [
  { value: 1, label: 'T2', full: 'Thứ 2' },
  { value: 2, label: 'T3', full: 'Thứ 3' },
  { value: 3, label: 'T4', full: 'Thứ 4' },
  { value: 4, label: 'T5', full: 'Thứ 5' },
  { value: 5, label: 'T6', full: 'Thứ 6' },
  { value: 6, label: 'T7', full: 'Thứ 7' },
  { value: 7, label: 'CN', full: 'Chủ Nhật' },
];