// ============================================================================
// 📁 student-modal/components/StudentModalFooter.tsx
// ============================================================================
import { Save } from 'lucide-react';

interface StudentModalFooterProps {
  isEdit: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function StudentModalFooter({ isEdit, loading, onClose, onSubmit }: StudentModalFooterProps) {
  return (
    <div className="bg-card border-t border-border px-8 py-5 flex gap-4 flex-shrink-0">
      <button
        onClick={onClose}
        disabled={loading}
        className="flex-1 px-6 py-3.5 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-all disabled:opacity-50"
      >
        Hủy Bỏ
      </button>
      <button
        onClick={onSubmit}
        disabled={loading}
        className="flex-1 px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/> : <Save size={20} />}
        {isEdit ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ'}
      </button>
    </div>
  );
}