// ============================================================================
// 📁 unpaid-sessions/components/EmailResultModal.tsx
// ============================================================================
import { CheckCircle, XCircle } from 'lucide-react';

interface EmailResultModalProps {
  show: boolean;
  result: any;
  onClose: () => void;
}

export function EmailResultModal({ show, result, onClose }: EmailResultModalProps) {
  if (!show || !result) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-border">
        <div className={`p-6 rounded-t-2xl ${
          result.success 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-red-500 to-rose-500'
        }`}>
          <div className="flex items-center gap-3 text-white">
            {result.success ? (
              <CheckCircle size={32} />
            ) : (
              <XCircle size={32} />
            )}
            <h3 className="text-2xl font-bold">
              {result.success ? 'Gửi email thành công!' : 'Có lỗi xảy ra'}
            </h3>
          </div>
        </div>

        <div className="p-6 text-card-foreground">
          {result.summary && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Tổng số</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.summary.total}</p>
              </div>
              <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Đã gửi</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.summary.sent}</p>
              </div>
              <div className="text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Thất bại</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{result.summary.failed || 0}</p>
              </div>
            </div>
          )}

          {result.successDetails && result.successDetails.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-card-foreground mb-3">Email đã gửi:</h4>
              <div className="space-y-2">
                {result.successDetails.map((detail: any, index: number) => (
                  <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                    <p className="font-medium">{detail.student}</p>
                    <p className="text-sm text-muted-foreground">
                      {detail.parent} • {detail.email}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.errors && result.errors.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-card-foreground mb-3">Lỗi:</h4>
              <div className="space-y-2">
                {result.errors.map((error: string, index: number) => (
                  <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-400">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.message && !result.summary && (
            <div className={`p-4 rounded-lg ${
              result.success 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
            }`}>
              {result.message}
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}