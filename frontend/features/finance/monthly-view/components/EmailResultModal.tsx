// 📁 monthly-view/components/EmailResultModal.tsx
import React from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmailResultModalProps {
  result: {
    success: boolean;
    summary?: any;
    message?: string;
  };
  onClose: () => void;
}

export function EmailResultModal({ result, onClose }: EmailResultModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-card rounded-[3rem] shadow-2xl max-w-md w-full overflow-hidden border-none"
      >
        {/* Header with Gradient */}
        <div className={cn(
          "relative p-8 sm:p-10 pb-16 transition-all duration-500",
          result.success
            ? "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700"
            : "bg-gradient-to-br from-rose-500 via-red-600 to-orange-700"
        )}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] pointer-events-none" />

          <div className="relative flex flex-col items-center text-center text-white">
            <div className="w-20 h-20 rounded-[1.75rem] bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center mb-6 shadow-lg">
              {result.success ? <CheckCircle size={40} strokeWidth={2.5} /> : <AlertTriangle size={40} strokeWidth={2.5} />}
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-2">
              {result.success ? 'Gửi thành công!' : 'Có lỗi xảy ra'}
            </h3>
            <p className="text-white/70 text-sm font-bold opacity-80 max-w-[250px]">
              {result.message}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full text-white/50 hover:text-white hover:bg-white/10 h-10 w-10 transition-colors"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Content Area */}
        <div className="relative z-10 -mt-10 mx-5 sm:mx-8 bg-card rounded-[2.5rem] border border-border/40 shadow-2xl flex flex-col overflow-hidden mb-8">
          <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-card to-background">
            {result.summary && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 opacity-60">Tổng</div>
                  <div className="text-lg font-black">{result.summary.total}</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Xong</div>
                  <div className="text-lg font-black text-emerald-600">{result.summary.sent}</div>
                </div>
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-1">Lỗi</div>
                  <div className="text-lg font-black text-rose-600">{result.summary.failed}</div>
                </div>
              </div>
            )}

            <Button
              onClick={onClose}
              className="h-14 w-full rounded-2xl bg-muted/50 hover:bg-muted font-black uppercase tracking-widest text-[11px] transition-all"
            >
              Đóng Cửa Sổ
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}