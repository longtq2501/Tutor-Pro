// ============================================================================
// 📁 student-list/components/EmptyState.tsx
// ============================================================================
import { User } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border-2 border-dashed border-border">
      <div className="bg-muted p-6 rounded-full mb-4">
        <User className="text-muted-foreground" size={48} />
      </div>
      <h3 className="text-lg font-bold text-card-foreground">Không tìm thấy học sinh nào</h3>
      <p className="text-muted-foreground mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm lại.</p>
    </div>
  );
}