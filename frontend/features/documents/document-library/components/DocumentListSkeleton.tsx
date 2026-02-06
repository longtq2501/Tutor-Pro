import { Skeleton } from "@/components/ui/skeleton";

export function DocumentListSkeleton() {
    return (
        <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar [scrollbar-gutter:stable]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="border border-border/40 bg-white dark:bg-gray-800/50 rounded-lg p-2.5 flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-1.5 min-w-0">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Skeleton className="h-7 w-16 rounded-lg" />
                        <Skeleton className="h-7 w-16 rounded-lg" />
                        <Skeleton className="h-7 w-7 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}
