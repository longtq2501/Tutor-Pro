// ============================================================================
// FILE: add-session-modal/components/ModalHeader.tsx
// ============================================================================
import { X, Bookmark } from 'lucide-react';

export const ModalHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="bg-slate-900 px-8 py-6 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
      <Bookmark size={100} />
    </div>
    <h2 className="text-2xl font-bold relative z-10">Thêm Buổi Học</h2>
    <p className="text-slate-400 text-sm relative z-10 opacity-90">Ghi nhận lịch dạy mới</p>
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
    >
      <X size={20} />
    </button>
  </div>
);