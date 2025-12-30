'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { MonthlyChartData } from '../types/dashboard.types';
import { formatCurrency, getMonthName } from '../utils/formatters';
import { Button } from '@/components/ui/button';

interface PremiumMonthlyRevenueBarProps {
    month: MonthlyChartData;
    index: number;
}

export function PremiumMonthlyRevenueBar({ month, index }: PremiumMonthlyRevenueBarProps) {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const paidPercent = month.paidPercentage;
    const debtPercent = 100 - paidPercent;

    const handleViewDetails = () => {
        // Navigate to monthly view with the selected month
        const params = new URLSearchParams(searchParams.toString());
        params.set('view', 'monthly');
        params.set('month', month.month); // Pass the month as a query parameter
        router.push(`/dashboard?${params.toString()}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn(
                "group relative overflow-hidden",
                "p-4 sm:p-5 lg:p-6 rounded-2xl border bg-card",
                "transition-all duration-300",
                "hover:shadow-lg hover:border-primary/50"
            )}
        >
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                {/* Month Label */}
                <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold">{getMonthName(month.month)}</h3>
                    <p className="text-sm text-muted-foreground">
                        Tổng: <span className="font-semibold">{formatCurrency(month.total)}</span>
                    </p>
                </div>

                {/* Amount Badges */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* Paid Amount */}
                    {month.totalPaid > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                                "bg-green-100 dark:bg-green-950/30",
                                "text-sm font-semibold text-green-700 dark:text-green-400"
                            )}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {formatCurrency(month.totalPaid)}
                        </motion.div>
                    )}

                    {/* Debt Amount */}
                    {month.totalUnpaid > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05 + 0.3 }}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                                "bg-red-100 dark:bg-red-950/30",
                                "text-sm font-semibold text-red-700 dark:text-red-400"
                            )}
                        >
                            <AlertCircle className="w-4 h-4" />
                            Nợ: {formatCurrency(month.totalUnpaid)}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 sm:h-4 rounded-full bg-muted overflow-hidden">
                {/* Paid Section (Green) */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${paidPercent}%` }}
                    transition={{ duration: 1, delay: index * 0.05 + 0.2, ease: "easeOut" }}
                    className={cn(
                        "absolute left-0 top-0 h-full",
                        "bg-gradient-to-r from-green-500 to-emerald-500",
                        "transition-all duration-300"
                    )}
                />

                {/* Debt Section (Blue overlay) */}
                {month.totalUnpaid > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.5 }}
                        className={cn(
                            "absolute right-0 top-0 h-full",
                            "bg-gradient-to-r from-blue-500/20 to-blue-600/20",
                            "dark:from-blue-500/10 dark:to-blue-600/10"
                        )}
                        style={{ width: `${debtPercent}%` }}
                    />
                )}

                {/* Hover Tooltip */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={cn(
                                "absolute -top-16 left-1/2 -translate-x-1/2",
                                "px-4 py-2 rounded-lg",
                                "bg-popover text-popover-foreground",
                                "border shadow-xl",
                                "text-xs whitespace-nowrap",
                                "pointer-events-none z-10"
                            )}
                        >
                            <div className="font-semibold mb-1">{getMonthName(month.month)}</div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-green-600 dark:text-green-400">Đã thu: {paidPercent.toFixed(1)}%</span>
                                {month.totalUnpaid > 0 && (
                                    <span className="text-red-600 dark:text-red-400">Nợ: {debtPercent.toFixed(1)}%</span>
                                )}
                            </div>

                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                                <div className="w-2 h-2 rotate-45 bg-popover border-r border-b" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Actions (on hover) - Desktop only */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:block"
                    >
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 backdrop-blur-sm bg-background/90"
                            onClick={handleViewDetails}
                        >
                            Xem chi tiết
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
