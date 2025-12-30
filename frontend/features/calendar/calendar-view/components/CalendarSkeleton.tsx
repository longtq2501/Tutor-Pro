import { Skeleton } from "../../../../components/ui/skeleton";
import { cn } from "@/lib/utils";

export const CalendarSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
                <Skeleton className="h-10 w-48 rounded-xl" />
                <Skeleton className="h-4 w-32 rounded-lg" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-10 w-32 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 rounded-3xl" />
            ))}
        </div>

        {/* Grid Skeleton */}
        <div className="bg-card rounded-[2.5rem] border border-border/40 overflow-hidden shadow-xl">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-border/40 bg-muted/30">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="p-4 flex justify-center">
                        <Skeleton className="h-4 w-12 rounded-lg" />
                    </div>
                ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7">
                {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="min-h-[140px] p-4 border-r border-b border-border/40 last:border-r-0">
                        <Skeleton className="h-8 w-8 rounded-full mb-4" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-full rounded-xl" />
                            <Skeleton className="h-6 w-3/4 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
