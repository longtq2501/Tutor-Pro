'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Calendar, ChevronDown, Clock } from 'lucide-react';
import React, { memo, useState } from 'react';
import { formatCurrency, getMonthName } from '../utils/formatters';
import type { StudentGroup } from '../utils/groupSessions';
import { PremiumSessionCard } from './PremiumSessionCard';

interface PremiumStudentDebtCardProps {
    group: StudentGroup;
    isSelected: boolean;
    selectedSessions: number[];
    onToggleStudent: () => void;
    onToggleSession: (sessionId: number) => void;
}

function StatsPill({ icon, label, variant }: { icon: React.ReactNode, label: string, variant: 'blue' | 'orange' }) {
    const styles = {
        blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
        orange: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400"
    };

    return (
        <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium", styles[variant])}>
            {icon}
            {label}
        </div>
    );
}

export const PremiumStudentDebtCard = memo(({
    group,
    isSelected,
    selectedSessions,
    onToggleStudent,
    onToggleSession
}: PremiumStudentDebtCardProps) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            layout
            className={cn(
                "group relative overflow-hidden",
                "rounded-2xl sm:rounded-3xl border bg-card",
                "shadow-sm hover:shadow-xl transition-all duration-300",
                "hover:border-primary/20",
                "will-change-transform contain-layout" // GPU Acceleration
            )}
        >
            {/* Gradient background decoration */}
            <div className={cn(
                "absolute top-0 right-0 w-64 h-64 rounded-full",
                "bg-gradient-to-br from-primary/5 to-transparent blur-3xl",
                "-translate-y-1/2 translate-x-1/2 transition-all duration-700",
                "group-hover:scale-150 group-hover:opacity-100 opacity-50"
            )} />

            <div className="relative p-5 sm:p-6 lg:p-7 space-y-5 sm:space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Student Avatar + Name */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        {/* Avatar with gradient ring */}
                        <div className="relative flex-shrink-0 cursor-pointer" onClick={onToggleStudent}>
                            <div className={cn(
                                "absolute inset-0 rounded-full",
                                "bg-gradient-to-br from-primary to-primary/50",
                                "animate-spin-slow",
                                "blur-sm",
                                isSelected ? "opacity-100" : "opacity-0"
                            )} />
                            <div className={cn(
                                "relative w-10 h-10 sm:w-14 sm:h-14 rounded-full",
                                "bg-gradient-to-br from-primary to-primary/70",
                                "flex items-center justify-center",
                                "text-white font-bold text-base sm:text-xl",
                                "shadow-lg",
                                !isSelected && "grayscale opacity-80"
                            )}>
                                {group.studentName.charAt(0)}
                            </div>
                        </div>

                        {/* Name + Meta */}
                        <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg lg:text-xl font-black text-foreground truncate leading-tight">
                                {group.studentName}
                            </h3>
                            <p className="text-[10px] sm:text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span className="truncate">{group.totalSessions} buổi × 2h = {group.totalHours}h</span>
                            </p>
                        </div>
                    </div>

                    {/* Total Amount Badge */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.1 }}
                            className={cn(
                                "px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl",
                                "bg-gradient-to-br from-orange-500 to-amber-600",
                                "text-white font-black whitespace-nowrap",
                                "shadow-lg shadow-orange-500/30",
                                "text-sm sm:text-base lg:text-lg"
                            )}
                        >
                            {formatCurrency(group.totalAmount)}
                        </motion.div>

                        <div className="flex gap-1.5 sm:gap-2">
                            {Array.from(group.months).map(m => (
                                <span key={m} className="px-1.5 py-0.5 rounded-md bg-secondary text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                    {getMonthName(m)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Stats Pills */}
                <div className="flex flex-wrap gap-2">
                    <StatsPill
                        icon={<Calendar className="w-3.5 h-3.5" />}
                        label={`${group.sessions.length} buổi học`}
                        variant="blue"
                    />
                    <StatsPill
                        icon={<AlertCircle className="w-3.5 h-3.5" />}
                        label={`${group.sessions.filter(s => !selectedSessions.includes(s.id)).length} chưa chọn`}
                        variant="orange"
                    />
                </div>

                {/* Collapsible Sessions */}
                <div className="space-y-3">
                    {/* Toggle Header */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={cn(
                            "flex items-center justify-between w-full",
                            "px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl",
                            "bg-muted/40 hover:bg-muted transition-colors",
                            "group/toggle"
                        )}
                    >
                        <span className="text-xs sm:text-sm font-bold">Chi tiết buổi học</span>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover/toggle:text-foreground" />
                        </motion.div>
                    </button>

                    {/* Sessions List */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {group.sessions
                                        .sort((a, b) => a.sessionDate.localeCompare(b.sessionDate))
                                        .map((session, index) => (
                                            <motion.div
                                                key={session.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <PremiumSessionCard
                                                    session={session}
                                                    isSelected={selectedSessions.includes(session.id)}
                                                    onToggle={onToggleSession}
                                                />
                                            </motion.div>
                                        ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
});
