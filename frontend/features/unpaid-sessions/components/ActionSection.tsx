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
    <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-2xl border-2 border-orange-200 dark:border-orange-800/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Users className="text-orange-600 dark:text-orange-500" size={24} />
          <h3 className="text-xl font-bold text-card-foreground">Thanh toán & Gửi báo giá</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSelectAll}
            className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-lg font-medium transition-colors border border-orange-200 dark:border-orange-800/50"
          >
            {selectAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </button>
          <div className="text-sm text-muted-foreground">
            Đã chọn: <span className="font-bold text-orange-600 dark:text-orange-400">{selectedSessionsCount}/{totalSessions}</span> buổi
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