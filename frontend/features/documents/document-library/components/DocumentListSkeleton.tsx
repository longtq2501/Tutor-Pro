import { Skeleton } from "@/components/ui/skeleton";

export function DocumentListSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border border-border/50 bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 flex gap-4">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex gap-2 mt-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-20 rounded-lg" />
                        <Skeleton className="h-9 w-20 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}
