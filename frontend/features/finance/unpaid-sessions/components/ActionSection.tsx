// ============================================================================
// 📁 unpaid-sessions/components/ActionSection.tsx
// ============================================================================
import { Users } from 'lucide-react';
import { SelectionSummary } from './SelectionSummary';
import { ActionButtons } from './ActionButtons';

interface ActionSectionProps {
  totalSessions: number;
  selectedSessionsCount: number;
  selectedStudentsCount: number;
  selectedTotal: any;
  selectAll: boolean;
  generatingInvoice: boolean;
  sendingEmail: boolean;
  onToggleSelectAll: () => void;
  onMarkPaid: () => void;
  onGenerateInvoice: () => void;
  onSendEmail: () => void;
}

export function ActionSection({
  totalSessions,
  selectedSessionsCount,
  selectedStudentsCount,
  selectedTotal,
  selectAll,
  generatingInvoice,
  sendingEmail,
  onToggleSelectAll,
  onMarkPaid,
  onGenerateInvoice,
  onSendEmail,
}: ActionSectionProps) {
  return (
    <div className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-2xl border-2 border-orange-200 dark:border-orange-800/30">
      <div className="flex flex-col gap-4 mb-6">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Users className="text-orange-600 dark:text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
            <h3 className="text-base sm:text-lg lg:text-xl font-black text-card-foreground tracking-tight">
              Thanh toán & Gửi báo giá
            </h3>
          </div>
        </div>

        {/* Selection Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/40 dark:bg-black/20 p-3 rounded-xl border border-orange-100 dark:border-orange-800/30">
          <button
            onClick={onToggleSelectAll}
            className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
          >
            {selectAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </button>

          <div className="text-xs sm:text-sm text-muted-foreground font-medium pl-1">
            Đã chọn: <span className="font-bold text-orange-600 dark:text-orange-400">{selectedSessionsCount}/{totalSessions}</span> buổi học
          </div>
        </div>
      </div>

      {selectedSessionsCount > 0 && <SelectionSummary selectedTotal={selectedTotal} />}

      <ActionButtons
        selectedSessionsCount={selectedSessionsCount}
        selectedStudentsCount={selectedStudentsCount}
        generatingInvoice={generatingInvoice}
        sendingEmail={sendingEmail}
        onMarkPaid={onMarkPaid}
        onGenerateInvoice={onGenerateInvoice}
        onSendEmail={onSendEmail}
      />
    </div>
  );
}