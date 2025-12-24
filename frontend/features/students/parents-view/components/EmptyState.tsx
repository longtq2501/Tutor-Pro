// 📁 parents-view/components/EmptyState.tsx
import { UserPlus } from 'lucide-react';

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <UserPlus className="mx-auto text-muted-foreground mb-4" size={64} />
      <p className="text-muted-foreground text-lg">Chưa có phụ huynh nào</p>
      <button
        onClick={onAddClick}
        className="mt-4 text-primary hover:text-primary/80 font-medium"
      >
        Thêm phụ huynh đầu tiên
      </button>
    </div>
  );
}