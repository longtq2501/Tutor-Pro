// 📁 monthly-view/components/EmailResultModal.tsx
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface EmailResultModalProps {
  result: {
    success: boolean;
    summary?: any;
    message?: string;
  };
  onClose: () => void;
}

export function EmailResultModal({ result, onClose }: EmailResultModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
        <div className={`p-6 text-center ${
          result.success 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : 'bg-red-50 dark:bg-red-900/20'
        }`}>
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            result.success 
              ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
          }`}>
            {result.success ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
          </div>
          <h3 className={`text-xl font-bold ${
            result.success 
              ? 'text-green-800 dark:text-green-300' 
              : 'text-red-800 dark:text-red-300'
          }`}>
            {result.success ? 'Gửi Email Thành Công' : 'Gửi Email Thất Bại'}
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">{result.message}</p>
        </div>
        
        {result.summary && (
          <div className="p-6 border-t border-border">
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="p-2 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground">Tổng</div>
                <div className="font-bold">{result.summary.total}</div>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xs text-green-600 dark:text-green-400">Thành công</div>
                <div className="font-bold text-green-700 dark:text-green-300">{result.summary.sent}</div>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-xs text-red-600 dark:text-red-400">Lỗi</div>
                <div className="font-bold text-red-700 dark:text-red-300">{result.summary.failed}</div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/30 border-t border-border">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-card border border-border font-bold rounded-xl hover:bg-muted transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}