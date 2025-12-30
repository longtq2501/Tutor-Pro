import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ActionButtons = ({ onClose }: { onClose: () => void }) => (
  <div className="flex gap-4">
    <Button
      type="button"
      variant="ghost"
      onClick={onClose}
      className="h-14 flex-1 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-muted/50 transition-all"
    >
      Hủy bỏ
    </Button>
    <Button
      type="submit"
      className="h-14 flex-[2] rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
    >
      <Plus className="w-4 h-4 mr-2" strokeWidth={3} />
      Thêm buổi học
    </Button>
  </div>
);