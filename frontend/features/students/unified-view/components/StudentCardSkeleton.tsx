
export function StudentCardSkeleton() {
    return (
        <div className="rounded-2xl border-2 bg-card p-5 sm:p-6 space-y-4 animate-pulse h-[340px] flex flex-col justify-between">
            <div>
                {/* Avatar skeleton */}
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-6 w-3/4 bg-muted rounded" />
                        <div className="h-4 w-1/2 bg-muted rounded" />
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="space-y-3 mt-6">
                    <div className="h-10 bg-muted rounded-lg" />
                    <div className="h-10 bg-muted rounded-lg" />
                </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex gap-3 mt-auto">
                <div className="h-10 flex-1 bg-muted rounded-lg" />
                <div className="h-10 flex-1 bg-muted rounded-lg" />
            </div>
        </div>
    );
}
