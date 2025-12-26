import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ActionButtons = ({ onClose }: { onClose: () => void }) => (
  <div className="flex gap-3 pt-2">
    <Button
      type="button"
      variant="outline"
      onClick={onClose}
      className="flex-1 h-12 text-base font-bold"
    >
      Hủy
    </Button>
    <Button
      type="submit"
      className="flex-[2] h-12 text-base font-bold group"
    >
      Xác nhận <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
    </Button>
  </div>
);