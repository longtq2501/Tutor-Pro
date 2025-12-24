// ============================================================================
// 📁 student-modal/components/StudentModalHeader.tsx
// ============================================================================
import { X, UserCircle } from 'lucide-react';

interface StudentModalHeaderProps {
  isEdit: boolean;
  onClose: () => void;
}

export function StudentModalHeader({ isEdit, onClose }: StudentModalHeaderProps) {
  return (
    <div className="bg-card border-b border-border px-8 py-6 flex-shrink-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
            <UserCircle size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">
              {isEdit ? 'Cập Nhật Hồ Sơ' : 'Thêm Học Sinh Mới'}
            </h2>
            <p className="text-sm text-muted-foreground">Điền thông tin chi tiết bên dưới</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-all"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
