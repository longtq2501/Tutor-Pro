import { cn } from '@/lib/utils';

export const CalendarSkeleton = () => {
    return (
        <div className="bg-card rounded-xl md:rounded-2xl shadow-sm border border-border overflow-hidden animate-pulse">
            {/* Header Skeleton */}
            <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800 border-b border-border">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="py-2 flex justify-center">
                        <div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                ))}
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-7 auto-rows-fr bg-background dark:bg-slate-900">
                {Array.from({ length: 35 }).map((_, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "min-h-[60px] sm:min-h-[80px] md:min-h-[90px] p-1 sm:p-1.5 border-b border-r border-border",
                            (idx + 1) % 7 === 0 && "border-r-0"
                        )}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 dark:bg-slate-800" />
                        </div>
                        <div className="space-y-1 mt-1">
                            <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
                            <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-800 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
