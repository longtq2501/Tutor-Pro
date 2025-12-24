// ============================================================================
// 📁 unpaid-sessions/components/ActionButtons.tsx
// ============================================================================
import { CheckCircle, FileText, Mail, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  selectedSessionsCount: number;
  selectedStudentsCount: number;
  generatingInvoice: boolean;
  sendingEmail: boolean;
  onMarkPaid: () => void;
  onGenerateInvoice: () => void;
  onSendEmail: () => void;
}

export function ActionButtons({
  selectedSessionsCount,
  selectedStudentsCount,
  generatingInvoice,
  sendingEmail,
  onMarkPaid,
  onGenerateInvoice,
  onSendEmail,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <button
        onClick={onMarkPaid}
        disabled={selectedSessionsCount === 0}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckCircle size={20} />
        Đánh dấu đã thanh toán
      </button>

      <button
        onClick={onGenerateInvoice}
        disabled={generatingInvoice || selectedSessionsCount === 0}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generatingInvoice ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Đang tạo...
          </>
        ) : (
          <>
            <FileText size={20} />
            Tải báo giá PDF
          </>
        )}
      </button>

      <button
        onClick={onSendEmail}
        disabled={sendingEmail || selectedStudentsCount === 0}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sendingEmail ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <Mail size={20} />
            Gửi email
          </>
        )}
      </button>
    </div>
  );
}