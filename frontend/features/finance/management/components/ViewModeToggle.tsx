'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, CreditCard } from 'lucide-react';

interface ViewModeToggleProps {
    /** The current view mode */
    viewMode: 'MONTHLY' | 'DEBT';
    /** Callback to change view mode */
    setViewMode: (mode: 'MONTHLY' | 'DEBT') => void;
    /** Icon-only variant used in the constrained app header */
    compact?: boolean;
}

const VIEW_MODE_OPTIONS = [
    { mode: 'MONTHLY', label: 'Theo Tháng', Icon: CalendarIcon },
    { mode: 'DEBT', label: 'Công Nợ', Icon: CreditCard },
] as const;

/**
 * Component to toggle between different finance view modes.
 * A single animated segmented control is used at every breakpoint: it never wraps
 * and collapses to icons only (`compact`) when the header runs out of room.
 */
export function ViewModeToggle({ viewMode, setViewMode, compact = false }: ViewModeToggleProps) {
    return (
        <div data-tour="finance-view-toggle" className="shrink-0">
            <div className="flex flex-nowrap p-0.5 bg-muted/40 rounded-xl border border-border/50 relative shrink-0">
                {VIEW_MODE_OPTIONS.map(({ mode, label, Icon }) => {
                    const isActive = viewMode === mode;
                    return (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => setViewMode(mode)}
                            data-tour={mode === 'DEBT' ? 'finance-debt-view' : undefined}
                            title={label}
                            aria-label={label}
                            aria-pressed={isActive}
                            className={cn(
                                "relative flex items-center justify-center rounded-lg font-bold transition-colors z-10 h-7 shrink-0",
                                compact ? "w-8 px-0" : "px-3 gap-1.5 text-xs",
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
                            <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                                <Icon className="w-4 h-4 shrink-0" />
                                {!compact && label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
