import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, FileText, Loader2, MoreHorizontal, Sparkles, Trash2, Info } from 'lucide-react';
import { StatusLegend } from './StatusLegend';
import { cn } from '@/lib/utils';
import { useState, type ReactNode } from 'react';
import { useUI } from '@/contexts/UIContext';
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
    /** Extra items prepended to the "⋯" overflow menu (collapsed controls). */
    extraMenu?: ReactNode;
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
    extraMenu,
}: HeaderActionsProps) {
    const { containerWidth } = useUI();
    const [reportOpen, setReportOpen] = useState(false);
    const [reportScope, setReportScope] = useState<ReportScope>('trung_tam');
    const [legendOpen, setLegendOpen] = useState(false);

    // Priority-plus thresholds based on measured content width
    const showLegendButton = containerWidth >= 1050; // P3: moves to "⋯" menu when < 1050px
    const showReportButton = containerWidth >= 600;  // P2: moves to "⋯" menu when < 600px
    const showReportText = containerWidth >= 950;    // P2: drops text when < 950px
    const showAddText = containerWidth >= 520;       // P1: drops text when < 520px (icon-only button)

    return (
        <div className="flex flex-nowrap items-center justify-end gap-1 sm:gap-1.5 min-w-0 shrink-0">
            {/* P2: Báo cáo (shown in header when containerWidth >= 600) */}
            {showReportButton && (
                <Popover open={reportOpen} onOpenChange={setReportOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={sessionsCount === 0 || reportLoading}
                            title="Báo cáo học phí"
                            aria-label="Báo cáo học phí"
                            className={cn(
                                "h-8 rounded-xl border-border/40 bg-card/50 hover:bg-muted/50 text-foreground disabled:opacity-50 text-[13px] font-medium whitespace-nowrap transition-all",
                                showReportText ? "px-2.5 sm:px-3 gap-1.5" : "w-8 px-0 justify-center"
                            )}
                        >
                            {reportLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <FileText className="w-4 h-4 shrink-0" />}
                            {showReportText && <span>Báo cáo</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-52 p-2 rounded-xl border-border/60 shadow-xl" align="end">
                        {([['trung_tam', 'Trung tâm'], ['day_rieng', 'Dạy riêng'], ['tat_ca', 'Tất cả']] as const).map(([value, label]) => (
                            <Button
                                key={value}
                                variant={reportScope === value ? 'secondary' : 'ghost'}
                                className="w-full justify-start rounded-lg font-medium text-[13px] h-8"
                                onClick={() => { setReportScope(value); setReportOpen(false); onReport(value); }}
                            >
                                {label}
                            </Button>
                        ))}
                    </PopoverContent>
                </Popover>
            )}

            {/* P1: Tiết học mới — NEVER HIDDEN, icon-only when narrow */}
            <Button
                data-tour="calendar-add-session"
                size="sm"
                title="Tiết học mới"
                aria-label="Tiết học mới"
                className={cn(
                    "h-8 rounded-xl bg-primary text-primary-foreground font-semibold text-[13px] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap",
                    showAddText ? "px-3 gap-1.5" : "w-8 px-0 justify-center"
                )}
                onClick={onAddSession}
            >
                <Plus className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                {showAddText && <span>Tiết học mới</span>}
            </Button>

            {/* P3: "Chú thích" button (visible when containerWidth >= 1050) */}
            {showLegendButton && (
                <StatusLegend />
            )}

            {/* Controlled StatusLegend dialog/popover for when triggered from "⋯" menu */}
            {!showLegendButton && (
                <StatusLegend
                    open={legendOpen}
                    onOpenChange={setLegendOpen}
                    trigger={null}
                />
            )}

            {/* ⋯ Menu: Always visible, holds secondary/collapsed actions */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-xl border-border/40 hover:bg-muted/50 shrink-0"
                        aria-label="Thêm tùy chọn"
                        title="Thêm tùy chọn"
                    >
                        <MoreHorizontal size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-xl shadow-xl border-border/60 z-50">
                    {/* Collapsed priority controls (navigation / view switch) */}
                    {extraMenu ? (
                        <>
                            {extraMenu}
                            <DropdownMenuSeparator />
                        </>
                    ) : null}

                    {/* Collapsed P3: Chú thích */}
                    {!showLegendButton && (
                        <DropdownMenuItem
                            onClick={() => setLegendOpen(true)}
                            className="rounded-lg font-medium text-[13px] cursor-pointer"
                        >
                            <Info className="w-4 h-4 mr-2 text-muted-foreground" />
                            Chú thích trạng thái
                        </DropdownMenuItem>
                    )}

                    {/* Collapsed P2: Báo cáo học phí */}
                    {!showReportButton && (
                        <>
                            <DropdownMenuItem
                                onClick={() => onReport('trung_tam')}
                                disabled={sessionsCount === 0 || reportLoading}
                                className="rounded-lg font-medium text-[13px] cursor-pointer"
                            >
                                <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                                Báo cáo học phí (Trung tâm)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onReport('day_rieng')}
                                disabled={sessionsCount === 0 || reportLoading}
                                className="rounded-lg font-medium text-[13px] cursor-pointer"
                            >
                                <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                                Báo cáo học phí (Dạy riêng)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onReport('tat_ca')}
                                disabled={sessionsCount === 0 || reportLoading}
                                className="rounded-lg font-medium text-[13px] cursor-pointer"
                            >
                                <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                                Báo cáo học phí (Tất cả)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}

                    {/* Chi tiết doanh thu */}
                    <DropdownMenuItem
                        onClick={onGenerateInvoice}
                        disabled={isGenerating || sessionsCount === 0}
                        className="rounded-lg font-medium text-[13px] cursor-pointer"
                    >
                        <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                        {isGenerating ? 'Đang xử lý...' : 'Chi tiết doanh thu'}
                    </DropdownMenuItem>

                    {/* Auto-generate (shown when no sessions) */}
                    {sessionsCount === 0 && (
                        <DropdownMenuItem
                            onClick={onAutoGenerate}
                            disabled={isGenerating}
                            className="rounded-lg font-medium text-[13px] cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4 mr-2 text-primary" />
                            {isGenerating ? 'Đang tạo...' : 'Tạo lịch tự động'}
                        </DropdownMenuItem>
                    )}

                    {/* Xóa buổi trong tháng */}
                    {sessionsCount > 0 && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={onDeleteMonth}
                                disabled={isGenerating}
                                className="rounded-lg font-medium text-[13px] text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer"
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
