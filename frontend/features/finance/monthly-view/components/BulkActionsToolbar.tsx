// 📁 monthly-view/components/BulkActionsToolbar.tsx
import { Zap, FileText, Mail, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface BulkActionsToolbarProps {
  selectAll: boolean;
  selectedCount: number;
  selectedStats: {
    totalSessions: number;
    totalHours: number;
    totalAmount: number;
  };
  isGenerating: boolean;
  generatingInvoice: boolean;
  sendingEmail: boolean;
  onToggleSelectAll: () => void;
  onAutoGenerate: () => void;
  onGenerateInvoice: () => void;
  onSendEmail: () => void;
}

export function BulkActionsToolbar({
  selectAll,
  selectedCount,
  selectedStats,
  isGenerating,
  generatingInvoice,
  sendingEmail,
  onToggleSelectAll,
  onAutoGenerate,
  onGenerateInvoice,
  onSendEmail,
}: BulkActionsToolbarProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={onToggleSelectAll}
              className="w-5 h-5 text-primary rounded focus:ring-ring"
            />
            <span className="font-semibold">Chọn tất cả</span>
          </label>
          <div className="h-6 w-px bg-border"></div>
          <span className="text-sm text-muted-foreground">
            Đã chọn: <strong className="text-primary">{selectedCount}</strong> học sinh
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={onAutoGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 border border-emerald-200 dark:border-emerald-800/50"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
            Tạo Lịch Tự Động
          </button>

          <button
            onClick={onGenerateInvoice}
            disabled={selectedCount === 0 || generatingInvoice}
            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 border border-indigo-200 dark:border-indigo-800/50"
          >
            {generatingInvoice ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
            Tải Báo Giá
          </button>

          <button
            onClick={onSendEmail}
            disabled={selectedCount === 0 || sendingEmail}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {sendingEmail ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
            Gửi Email
          </button>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="mt-4 pt-4 border-t border-border flex gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Số buổi:</span>
            <span className="ml-2 font-bold">{selectedStats.totalSessions}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Thành tiền:</span>
            <span className="ml-2 font-bold text-primary">{formatCurrency(selectedStats.totalAmount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}