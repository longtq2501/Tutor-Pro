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
            <div className="container mx-auto px-4 md:px-8 py-3 md:py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-0.5 md:space-y-1">
                    <h1 className="text-xl font-black tracking-tight md:text-2xl lg:text-3xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Quản Lý Tài Chính
                    </h1>
                    <p className="text-muted-foreground text-xs md:text-sm font-medium">
                        Theo dõi doanh thu, công nợ và trạng thái thanh toán
                    </p>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    {/* View Mode Toggle with Smooth Animation */}
                    {/* View Mode Toggle: Mobile Dropdown vs Desktop Tabs */}
                    <div className="w-full md:w-auto">
                        {/* Mobile Dropdown */}
                        <div className="md:hidden w-full">
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
                                            "relative flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-colors z-10",
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
                                        <span className="relative z-10 flex items-center gap-2">
                                            {mode === 'MONTHLY' ? <CalendarIcon className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                                            {mode === 'MONTHLY' ? 'Theo Tháng' : 'Công Nợ'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Month Selector using AnimatePresence for smooth entry/exit */}
                    <div className="flex items-center overflow-hidden">
                        <motion.div
                            initial={false}
                            animate={{
                                width: viewMode === 'MONTHLY' ? 'auto' : 0,
                                opacity: viewMode === 'MONTHLY' ? 1 : 0,
                                scale: viewMode === 'MONTHLY' ? 1 : 0.9,
                                marginLeft: viewMode === 'MONTHLY' ? 8 : 0 // Add margin only when visible
                            }}
                            style={{ overflow: 'hidden' }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        >
                            <div className="flex items-center gap-1 bg-muted/40 rounded-xl border border-border/50 p-1 whitespace-nowrap">
                                <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 rounded-lg hover:bg-background hover:shadow-sm">
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="px-2 md:px-4 min-w-[100px] md:min-w-[120px] text-center font-bold text-sm capitalize">
                                    {format(selectedDate, 'MMMM yyyy', { locale: vi })}
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 rounded-lg hover:bg-background hover:shadow-sm">
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
