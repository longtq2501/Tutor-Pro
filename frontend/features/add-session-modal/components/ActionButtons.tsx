// ============================================================================
// FILE: add-session-modal/components/ActionButtons.tsx
// ============================================================================
import { ChevronRight } from 'lucide-react';

export const ActionButtons = ({ onClose }: { onClose: () => void }) => (
  <div className="flex gap-4 pt-2">
    <button type="button" onClick={onClose} className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 py-3.5 rounded-xl font-bold transition-all">
      Hủy
    </button>
    <button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 flex items-center justify-center gap-2 group">
      Xác nhận <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);