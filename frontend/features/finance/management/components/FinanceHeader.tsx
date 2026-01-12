'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { addMonths, format, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { useFinanceContext } from '../context/FinanceContext';

export function FinanceHeader() {
    const { viewMode, setViewMode, selectedDate, setSelectedDate, searchTerm, setSearchTerm } = useFinanceContext();

    const handlePrevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
    const handleNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

    return (
        <div className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 transition-all duration-300 supports-[backdrop-filter]:bg-background/60">
            <div className="px-4 lg:px-6 xl:px-8 py-2 md:py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-0.5 shrink-0">
                    <h1 className="text-lg font-black tracking-tight lg:text-xl xl:text-2xl 2xl:text-3xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Quản Lý Tài Chính
                    </h1>
                    <p className="text-muted-foreground text-[10px] md:text-xs font-medium">
                        Theo dõi doanh thu, công nợ và trạng thái thanh toán
                    </p>
                </div>

                <div className="w-full lg:w-auto flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center lg:justify-end">
                    {/* View Mode Toggle with Smooth Animation */}
                    {/* View Mode Toggle: Mobile Dropdown vs Desktop Tabs */}
                    <div className="w-full sm:w-auto md:w-auto">
                        {/* Mobile Dropdown */}
                        <div className="md:hidden w-full sm:min-w-[160px]">
                            <Select value={viewMode} onValueChange={(v) => setViewMode(v as 'MONTHLY' | 'DEBT')}>
                                <SelectTrigger className="w-full bg-muted/40 border-border/50 font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MONTHLY">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>Theo Tháng</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="DEBT">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" />
                                            <span>Công Nợ</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Desktop Tabs */}
                        <div className="hidden md:flex p-1 bg-muted/40 rounded-xl border border-border/50 relative">
                            {(['MONTHLY', 'DEBT'] as const).map((mode) => {
                                const isActive = viewMode === mode;
                                return (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={cn(
                                            "relative flex items-center justify-center gap-2 px-3 lg:px-5 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-bold transition-colors z-10",
                                            isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-view-tab"
                                                className="absolute inset-0 bg-background rounded-lg shadow-sm ring-1 ring-border/50"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                                            {mode === 'MONTHLY' ? <CalendarIcon className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                                            {mode === 'MONTHLY' ? 'Theo Tháng' : 'Công Nợ'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Month Selector using AnimatePresence for smooth entry/exit */}
                    <div className="flex items-center">
                        <motion.div
                            initial={false}
                            animate={{
                                width: viewMode === 'MONTHLY' ? 'auto' : 0,
                                opacity: viewMode === 'MONTHLY' ? 1 : 0,
                                scale: viewMode === 'MONTHLY' ? 1 : 0.9,
                                marginLeft: viewMode === 'MONTHLY' ? 4 : 0
                            }}
                            className="flex-1 sm:flex-initial"
                            style={{ overflow: 'visible' }} // Changed from hidden to visible
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        >
                            <div className="flex items-center justify-between gap-1 bg-muted/40 rounded-xl border border-border/50 p-1 w-full sm:w-auto min-w-fit">
                                <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 rounded-lg hover:bg-background hover:shadow-sm shrink-0">
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="px-3 flex-1 text-center font-bold text-sm capitalize whitespace-nowrap min-w-[120px]">
                                    {format(selectedDate, 'MMMM, yyyy', { locale: vi })}
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 rounded-lg hover:bg-background hover:shadow-sm shrink-0">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
