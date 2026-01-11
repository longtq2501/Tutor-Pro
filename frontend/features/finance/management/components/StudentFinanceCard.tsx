'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn, formatCurrency } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { useFinanceContext } from '../context/FinanceContext';
import { FinanceGroupedRecord } from '../types';
import { SessionItem } from './SessionItem';
import { isCancelledStatus } from '@/lib/types/lesson-status';

interface StudentFinanceCardProps {
    group: FinanceGroupedRecord;
    onDeleteSession: (id: number) => void;
    onTogglePayment: (id: number) => void;
}

function StudentFinanceCardComponent({ group, onDeleteSession, onTogglePayment }: StudentFinanceCardProps) {
    const { selectedStudentIds, toggleStudentSelection } = useFinanceContext();
    const [isOpen, setIsOpen] = useState(false);

    const isSelected = selectedStudentIds.includes(group.studentId);

    // Memoized Derived Calculations - Only recalculate when sessions change
    const billableSessions = useMemo(
        () => group.sessions.filter(s => !s.status || !isCancelledStatus(s.status)),
        [group.sessions]
    );

    const paidSessions = useMemo(
        () => billableSessions.filter(s => s.paid).length,
        [billableSessions]
    );

    const unpaidSessions = useMemo(
        () => billableSessions.filter(s => !s.paid).length,
        [billableSessions]
    );

    const totalBillable = Math.max(billableSessions.length, 1); // Avoid division by zero

    const hasUnpaid = useMemo(
        () => unpaidSessions > 0,
        [unpaidSessions]
    );

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={cn(
                "border overflow-hidden group/card relative transition-shadow duration-300",
                isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-primary/[0.02]"
                    : "hover:border-primary/50 hover:shadow-md"
            )}>
                {/* Selection Overlay */}
                <div
                    className="absolute inset-0 z-0 cursor-pointer"
                    onClick={() => toggleStudentSelection(group.studentId)}
                />

                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleStudentSelection(group.studentId)}
                        className="mt-1 sm:mt-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />

                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Student Name & Basic Info - Col span 4 */}
                        <div className="md:col-span-4">
                            <h3 className="font-black text-lg truncate leading-tight tracking-tight">
                                {group.studentName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5 text-muted-foreground">
                                <Badge variant="secondary" className="font-bold text-[10px] px-2 h-5 bg-muted hover:bg-muted">
                                    {group.totalSessions} buổi
                                </Badge>
                                <span className="text-xs font-medium">•</span>
                                <span className="text-xs font-medium">{group.totalHours} giờ</span>
                            </div>
                        </div>

                        {/* Payment Status Summary - Col span 5 */}
                        <div className="md:col-span-5 flex items-center gap-4">
                            {/* Progress bar visual */}
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden flex max-w-[200px]">
                                <div
                                    className="bg-emerald-500 h-full"
                                    style={{ width: `${(paidSessions / totalBillable) * 100}%` }}
                                />
                                <div
                                    className="bg-rose-500 h-full"
                                    style={{ width: `${(unpaidSessions / totalBillable) * 100}%` }}
                                />
                            </div>

                            <div className="flex gap-3 text-xs font-bold">
                                {paidSessions > 0 && (
                                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        {paidSessions} đã TT
                                    </span>
                                )}
                                {unpaidSessions > 0 && (
                                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                        {unpaidSessions} chưa TT
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Amount & Actions - Col span 3 */}
                        <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4">
                            <div className="text-right">
                                <div className={cn(
                                    "text-xl font-black tabular-nums tracking-tight",
                                    hasUnpaid ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                                )}>
                                    {formatCurrency(group.totalAmount)}
                                </div>
                                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                                    {formatCurrency(group.pricePerHour)}/H
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-muted"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(!isOpen);
                                }}
                            >
                                <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                </motion.div>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Collapsible Content - Detailed List */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.2 }
                            }}
                            className="bg-muted/30 border-t border-border overflow-hidden relative z-20"
                        >
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {group.sessions.map((session, idx) => (
                                    <SessionItem
                                        key={session.id}
                                        session={session}
                                        index={idx}
                                        onDelete={onDeleteSession}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}

// Memoize the entire component to prevent re-renders when unrelated props change
export const StudentFinanceCard = memo(StudentFinanceCardComponent, (prevProps, nextProps) => {
    // Only re-render if:
    // 1. The group data changes (studentId, sessions, amounts)
    // 2. The callbacks change (though they should be stable from the hook)
    return (
        prevProps.group.studentId === nextProps.group.studentId &&
        prevProps.group.totalSessions === nextProps.group.totalSessions &&
        prevProps.group.totalAmount === nextProps.group.totalAmount &&
        prevProps.group.sessions.length === nextProps.group.sessions.length &&
        prevProps.onDeleteSession === nextProps.onDeleteSession &&
        prevProps.onTogglePayment === nextProps.onTogglePayment
    );
});

StudentFinanceCard.displayName = 'StudentFinanceCard';
