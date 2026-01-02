'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Calendar, Check, CheckCircle2 } from 'lucide-react';
import { memo } from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SessionCardProps {
    session: {
        id: number;
        sessionDate: string;
        month: string;
        totalAmount: number;
        completed?: boolean;
    };
    isSelected: boolean;
    onToggle: (id: number) => void;
}

export const PremiumSessionCard = memo(({
    session,
    isSelected,
    onToggle
}: SessionCardProps) => {
    return (
        <motion.label
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
                "group/session relative flex items-start gap-3 sm:gap-4",
                "p-3 sm:p-4 rounded-xl cursor-pointer",
                "border-2 transition-all duration-300",
                "will-change-transform", // GPU Acceleration

                // Unselected/Unpaid state (mimicking the prompt's logic)
                !isSelected && [
                    "border-dashed border-orange-200 bg-orange-50/50",
                    "hover:border-orange-300 hover:bg-orange-50",
                    "dark:border-orange-900/30 dark:bg-orange-950/10",
                    "dark:hover:border-orange-900/50"
                ],

                // Selected/Paid state
                isSelected && [
                    "border-solid border-green-200 bg-green-50/50",
                    "hover:border-green-300 hover:bg-green-50",
                    "dark:border-green-900/30 dark:bg-green-950/10"
                ]
            )}
        >
            {/* Custom Animated Checkbox */}
            <div className="relative mt-0.5" onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(session.id)}
                    className="peer sr-only"
                />
                <div
                    onClick={() => onToggle(session.id)}
                    className={cn(
                        "w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2",
                        "flex items-center justify-center",
                        "transition-all duration-300",

                        // Unchecked state
                        "border-muted-foreground/30 bg-background",
                        "peer-checked:border-green-500 peer-checked:bg-green-500",

                        // Hover effects
                        "group-hover/session:border-primary/50",
                        "peer-checked:group-hover/session:bg-green-600"
                    )}
                >
                    <motion.div
                        initial={false}
                        animate={{
                            scale: isSelected ? 1 : 0,
                            opacity: isSelected ? 1 : 0
                        }}
                        transition={{ duration: 0.2, type: "spring" }}
                    >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </motion.div>
                </div>
            </div>

            {/* Session Info */}
            <div className="flex-1 min-w-0" onClick={() => onToggle(session.id)}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 items-start">
                    {/* Date */}
                    <div className="flex items-center gap-1.5 min-w-0">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-semibold text-xs sm:text-sm lg:text-base truncate">
                            {formatDate(session.sessionDate)}
                        </span>
                    </div>

                    {/* Status Badge */}
                    {isSelected && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn(
                                "flex items-center gap-1 self-start sm:self-auto w-fit",
                                "px-2 py-0.5 rounded-full",
                                "bg-green-500 text-white text-[10px] sm:text-xs font-bold",
                                "shadow-sm"
                            )}
                        >
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Đã chọn
                        </motion.div>
                    )}
                    {!isSelected && session.completed && (
                        <div className="self-start w-fit px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 text-[10px] sm:text-xs font-bold">
                            Đã dạy
                        </div>
                    )}
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-muted-foreground font-medium">
                        Thông tin buổi học
                    </span>
                    <span className={cn(
                        "font-black text-sm sm:text-base lg:text-lg tabular-nums",
                        isSelected ? "text-green-600" : "text-orange-600"
                    )}>
                        {formatCurrency(session.totalAmount)}
                    </span>
                </div>
            </div>

            {/* Hover indicator */}
            <div className={cn(
                "absolute inset-0 rounded-xl pointer-events-none",
                "ring-2 ring-primary opacity-0",
                "group-hover/session:opacity-10 pointer-events-none transition-opacity"
            )} />
        </motion.label>
    );
});
