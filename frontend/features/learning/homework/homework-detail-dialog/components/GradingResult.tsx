// 📁 homework-detail-dialog/components/GradingResult.tsx
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Homework } from '@/lib/types';

interface GradingResultProps {
  homework: Homework;
}

export function GradingResult({ homework }: GradingResultProps) {
  return (
    <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
      <h3 className="font-semibold text-green-900 dark:text-green-100">📊 Kết quả chấm điểm</h3>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-700 dark:text-green-300">Điểm số:</span>
        <span className="text-3xl font-bold text-green-600">{homework.score}/100</span>
      </div>

      {homework.feedback && (
        <div>
          <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">💬 Nhận xét:</p>
          <p className="text-sm text-green-600 dark:text-green-400">{homework.feedback}</p>
        </div>
      )}

      {homework.gradedAt && (
        <p className="text-xs text-green-600 dark:text-green-400">
          Chấm điểm lúc: {format(new Date(homework.gradedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
        </p>
      )}
    </div>
  );
}