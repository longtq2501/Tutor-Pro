import { X } from 'lucide-react';

export const ModalHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="bg-primary/5 px-6 py-4 relative border-b border-border">
    <h2 className="text-xl font-bold text-foreground">Thêm Buổi Học</h2>
    <p className="text-muted-foreground text-sm">Ghi nhận lịch dạy mới</p>
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-transparent hover:bg-muted p-2 rounded-full transition-all"
    >
      <X size={20} />
    </button>
  </div>
);