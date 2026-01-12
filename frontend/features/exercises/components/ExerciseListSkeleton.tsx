'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for the exercise library view.
 */
export const ExerciseListSkeleton: React.FC = () => {
    return (
        <Card className="animate-in fade-in duration-500">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-dashed last:border-0">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
