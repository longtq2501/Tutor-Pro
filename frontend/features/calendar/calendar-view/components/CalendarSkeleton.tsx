import { Skeleton } from "../../../../components/ui/skeleton";
import { cn } from "@/lib/utils";

export const CalendarSkeleton = () => (
    <div className="animate-pulse">
        {/* Grid Skeleton */}
        <div className="bg-card rounded-2xl border border-border/40 overflow-hidden shadow-xl">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-border/40 bg-muted/30">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="p-2 sm:p-4 flex justify-center">
                        <Skeleton className="h-4 w-12 rounded-lg" />
                    </div>
                ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 auto-rows-fr bg-background">
                {Array.from({ length: 35 }).map((_, i) => (
                    <div
                        key={i}
                        className="min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] p-1.5 sm:p-2 lg:p-3 border-r border-b border-border/40 last:border-r-0"
                    >
                        <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full mb-4" />
                        <div className="space-y-2 mt-auto">
                            <Skeleton className="h-6 sm:h-8 w-full rounded-xl" />
                            <Skeleton className="h-6 sm:h-8 w-3/4 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
