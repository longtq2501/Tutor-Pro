"use client";

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, FileText, Loader2, MoreHorizontal, Sparkles, Trash2 } from 'lucide-react';
import { StatusLegend } from './StatusLegend';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { ReportScope } from '../utils/monthlyFeeReport';

interface HeaderActionsProps {
    onAddSession: () => void;
    onGenerateInvoice: () => void;
    onAutoGenerate: () => void;
    onDeleteMonth: () => void;
    isGenerating: boolean;
    sessionsCount: number;
    onReport: (scope: ReportScope) => void;
    reportLoading?: boolean;
    /** P5: label for the delete action, e.g. "Xóa các buổi trong tháng 10/2026" */
    deleteLabel?: string;
}

export function HeaderActions({
    onAddSession,
    onGenerateInvoice,
    onAutoGenerate,
    onDeleteMonth,
    isGenerating,
    sessionsCount,
    onReport,
    reportLoading = false,
    deleteLabel = 'Xóa các buổi trong tháng này',
}: HeaderActionsProps) {
    const [reportOpen, setReportOpen] = useState(false);
    const [reportScope, setReportScope] = useState<ReportScope>('trung_tam');

    return (
        <div className="flex items-center gap-1.5 min-w-0 flex-shrink-1">
            {/* Báo cáo popover */}
            <Popover open={reportOpen} onOpenChange={setReportOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={sessionsCount === 0 || reportLoading}
                        className="h-8 2xl:h-10 rounded-2xl border-slate-300 bg-white px-2 sm:px-3 font-medium text-slate-900 hover:bg-slate-100 hover:text-slate-900 disabled:bg-slate-100 disabled:text-slate-500 disabled:opacity-100 text-[11px] 2xl:text-[12px]"
                    >
                        {reportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 2xl:mr-1.5" />}
                        <span className="hidden sm:inline">Báo cáo</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-2 rounded-xl" align="end">
                    {([['trung_tam', 'Trung tâm'], ['day_rieng', 'Dạy riêng'], ['tat_ca', 'Tất cả']] as const).map(([value, label]) => (
                        <Button
                            key={value}
                            variant={reportScope === value ? 'secondary' : 'ghost'}
                            className="w-full justify-start rounded-lg font-medium text-sm"
                            onClick={() => { setReportScope(value); setReportOpen(false); onReport(value); }}
                        >
                            {label}
                        </Button>
                    ))}
                </PopoverContent>
            </Popover>

            {/* Tiết học mới */}
            <Button
                data-tour="calendar-add-session"
                size="sm"
                className="h-8 2xl:h-10 rounded-2xl bg-primary text-primary-foreground font-semibold text-[11px] 2xl:text-[12px] px-2 sm:px-3 2xl:px-6 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                onClick={onAddSession}
            >
                <Plus className="w-4 h-4 2xl:mr-1.5" strokeWidth={3} />
                <span className="hidden sm:inline">Tiết học mới</span>
            </Button>

            {/* P5: "Chú thích" button (was (i) icon-only) */}
            <StatusLegend />

            {/* P5: ⋯ menu — contains "Xóa" (was in legend popover) + "Chi tiết doanh thu" */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 2xl:h-10 2xl:w-10 rounded-2xl border-border/40 hover:bg-muted/50"
                        aria-label="Thêm tùy chọn"
                    >
                        <MoreHorizontal size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-xl shadow-xl border-border/60">
                    {/* Chi tiết doanh thu — P5: moved from legend popover */}
                    <DropdownMenuItem
                        onClick={onGenerateInvoice}
                        disabled={isGenerating || sessionsCount === 0}
                        className="rounded-lg font-medium text-sm cursor-pointer"
                    >
                        <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                        {isGenerating ? 'Đang xử lý...' : 'Chi tiết doanh thu'}
                    </DropdownMenuItem>

                    {/* Auto-generate (shown when no sessions) */}
                    {sessionsCount === 0 && (
                        <DropdownMenuItem
                            onClick={onAutoGenerate}
                            disabled={isGenerating}
                            className="rounded-lg font-medium text-sm cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4 mr-2 text-primary" />
                            {isGenerating ? 'Đang tạo...' : 'Tạo lịch tự động'}
                        </DropdownMenuItem>
                    )}

                    {/* Xóa buổi trong tháng — P5: separator + red, dynamic label */}
                    {sessionsCount > 0 && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={onDeleteMonth}
                                disabled={isGenerating}
                                className="rounded-lg font-medium text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {deleteLabel}
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
