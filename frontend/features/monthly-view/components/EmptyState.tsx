// 📁 monthly-view/components/EmptyState.tsx
import { Calendar, Zap } from 'lucide-react';

interface EmptyStateProps {
  onAutoGenerate: () => void;
}

export function EmptyState({ onAutoGenerate }: EmptyStateProps) {
  return (
    <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
      <Calendar className="mx-auto text-muted-foreground mb-4" size={64} />
      <p className="text-muted-foreground text-lg">Không có dữ liệu buổi học cho tháng này.</p>
      <button 
        onClick={onAutoGenerate}
        className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
      >
        <Zap size={18} />
        Tạo Lịch Tự Động Ngay
      </button>
    </div>
  );
}