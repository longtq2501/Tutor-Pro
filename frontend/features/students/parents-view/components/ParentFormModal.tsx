// 📁 parents-view/components/ParentFormModal.tsx
import type { ParentRequest } from '@/lib/types';

interface ParentFormModalProps {
  isEdit: boolean;
  formData: ParentRequest;
  onFormChange: (data: ParentRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ParentFormModal({
  isEdit,
  formData,
  onFormChange,
  onSubmit,
  onClose,
}: ParentFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="text-2xl font-bold text-card-foreground">
            {isEdit ? 'Sửa thông tin phụ huynh' : 'Thêm phụ huynh mới'}
          </h3>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Họ tên <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none text-foreground placeholder:text-muted-foreground transition-all"
              placeholder="Nhập họ tên phụ huynh"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none text-foreground placeholder:text-muted-foreground transition-all"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none text-foreground placeholder:text-muted-foreground transition-all"
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Ghi chú
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => onFormChange({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none resize-none text-foreground placeholder:text-muted-foreground transition-all"
              placeholder="Ghi chú về phụ huynh..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-bold py-3 px-6 rounded-xl transition-all border border-border"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}