// ============================================================================
// FILE: add-session-modal/components/SummaryCard.tsx
// ============================================================================
export const SummaryCard = ({ totalHours, month }: { totalHours: number; month: string }) => (
  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Tổng thời lượng</span>
      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
        {totalHours.toFixed(1)} <span className="text-sm font-medium text-slate-400 dark:text-slate-500">giờ</span>
      </span>
    </div>
    <div className="h-px bg-slate-200 dark:bg-slate-700 w-full mb-3" />
    <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
      <span>Ghi nhận cho tháng</span>
      <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">
        {month || '--/--'}
      </span>
    </div>
  </div>
);