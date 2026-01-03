import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SessionRecord } from '@/lib/types/finance';
import { cn } from '@/lib/utils';
import { BookOpen, X } from 'lucide-react';

interface ModalHeaderProps {
    session: SessionRecord;
    onClose: () => void;
}

export function ModalHeader({ session, onClose }: ModalHeaderProps) {
    const isPaid = session.paid;
    const isCancelled = session.status === 'CANCELLED_BY_STUDENT' || session.status === 'CANCELLED_BY_TUTOR';

    return (
        <div className={cn(
            "relative p-6 transition-all duration-500 shrink-0 sticky top-0 z-50",
            isPaid ? "bg-gradient-to-r from-emerald-600 to-teal-600" : "bg-gradient-to-r from-blue-600 to-indigo-600",
            isCancelled ? "from-slate-600 to-slate-700" : ""
        )}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-[10px] opacity-90">Chi tiết buổi học</h3>
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 py-0 h-4 text-[9px] font-bold">
                                #{session.id}
                            </Badge>
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 py-0 h-4 text-[9px] font-bold">
                                {session.sessionDate}
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight leading-none">Thông tin lớp học</h1>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full text-white hover:bg-white/20 h-10 w-10 shrink-0"
                >
                    <X size={20} />
                </Button>
            </div>
        </div>
    );
}
