import type { SessionRecord } from '@/lib/types/finance';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, Check, Clock, DollarSign, FileText } from 'lucide-react';
import { formatFullCurrency as formatCurrency } from '../utils';
import { InfoCard } from './InfoCard';

interface ViewModeContentProps {
    session: SessionRecord;
}

export function ViewModeContent({ session }: ViewModeContentProps) {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-3">
                <InfoCard
                    icon={<Calendar size={14} className="text-blue-500" />}
                    label="Ngày dạy"
                    value={session.sessionDate}
                    variant="blue"
                />
                <InfoCard
                    icon={<Clock size={14} className="text-purple-500" />}
                    label="Thời gian"
                    value={`${session.startTime} - ${session.endTime}`}
                    variant="purple"
                />
            </div>

            <div className={cn(
                "p-4 rounded-2xl border flex items-center justify-between group transition-all duration-300",
                session.paid
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800"
                    : "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-800"
            )}>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">Thanh toán</p>
                    <p className="text-xl font-black tracking-tighter">
                        {formatCurrency(session.totalAmount)}
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
                        {session.hours}h × {formatCurrency(session.pricePerHour)}/h
                    </p>
                </div>
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 duration-500",
                    session.paid ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                )}>
                    {session.paid ? <Check size={18} strokeWidth={3} /> : <DollarSign size={18} />}
                </div>
            </div>

            {session.notes && (
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText size={14} className="text-muted-foreground" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Ghi chú</span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed italic opacity-80 whitespace-pre-wrap">
                        "{session.notes}"
                    </p>
                </div>
            )}

            {(session.lessons?.length || 0) + (session.documents?.length || 0) > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                    {session.lessons && session.lessons.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-orange-600 px-1">
                                <BookOpen className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Bài giảng</span>
                            </div>
                            <div className="space-y-1">
                                {session.lessons.map(l => (
                                    <div key={l.id} className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-orange-50/50 border border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20 truncate">
                                        {l.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {session.documents && session.documents.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-blue-600 px-1">
                                <FileText className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Tài liệu</span>
                            </div>
                            <div className="space-y-1">
                                {session.documents.map(d => (
                                    <div key={d.id} className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-blue-50/50 border border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20 truncate">
                                        {d.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
