// 📁 monthly-view/components/AutoGenerateBanner.tsx
import { Zap, X, Loader2 } from 'lucide-react';

interface AutoGenerateBannerProps {
  count: number;
  generating: boolean;
  onGenerate: () => void;
  onDismiss: () => void;
}

export function AutoGenerateBanner({ count, generating, onGenerate, onDismiss }: AutoGenerateBannerProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-top-4">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Zap size={120} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Zap size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Thiết lập lịch tự động?</h3>
            <p className="text-indigo-100 max-w-lg">
              Hệ thống phát hiện tháng này chưa có lịch học. 
              Chúng tôi có thể tự động tạo <strong>{count}</strong> buổi học dựa trên lịch cố định.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={onGenerate}
            disabled={generating}
            className="flex-1 md:flex-none px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {generating ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            Tạo Lịch Ngay
          </button>
          <button 
            onClick={onDismiss}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}