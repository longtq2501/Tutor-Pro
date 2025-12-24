// ============================================================================
// 📁 unpaid-sessions/components/EmptyState.tsx
// ============================================================================
import { CheckCircle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
      <p className="text-muted-foreground text-lg">Tuyệt vời! Không có buổi học nào chưa thanh toán</p>
    </div>
  );
}