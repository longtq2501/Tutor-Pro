"use client";

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { MONTHS } from '../constants';
import { motion } from 'framer-motion';

interface HeaderNavigationProps {
    currentDate: Date;
    onNavigate: (dir: number) => void;
    onToday: () => void;
    isFetching: boolean;
}

export function HeaderNavigation({
    currentDate,
    onNavigate,
    onToday,
    isFetching,
}: HeaderNavigationProps) {
    return (
        <div className="flex items-center justify-between lg:justify-start gap-4 sm:gap-6">
            <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-foreground flex items-center gap-2 sm:gap-3">
                    <CalendarIcon className="w-5 h-5 sm:w-7 sm:h-7 text-primary" strokeWidth={2.5} />
                    <span className="truncate">{MONTHS[currentDate.getMonth()]}</span>
                    {isFetching && (
                        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        </motion.div>
                    )}
                    <span className="text-muted-foreground/30 font-thin italic hidden sm:inline">{currentDate.getFullYear()}</span>
                </h1>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-7 sm:ml-10">Lịch trình dạy học</p>
            </div>

            <div className="flex items-center bg-card rounded-2xl sm:rounded-3xl p-1 border border-border/40 shadow-sm shrink-0">
                <Button variant="ghost" size="icon" onClick={() => onNavigate(-1)} className="rounded-xl sm:rounded-2xl h-8 w-8 sm:h-10 sm:w-10">
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button variant="ghost" onClick={onToday} className="px-2 sm:px-5 font-black uppercase tracking-widest text-[9px] sm:text-[11px] rounded-xl sm:rounded-2xl h-8 sm:h-10">
                    <span className="hidden sm:inline">Tháng này</span>
                    <CalendarIcon className="w-3.5 h-3.5 sm:hidden" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onNavigate(1)} className="rounded-xl sm:rounded-2xl h-8 w-8 sm:h-10 sm:w-10">
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
            </div>
        </div>
    );
}
