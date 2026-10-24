'use client';

import { ArrowLeft, Library, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHeaderDensity } from '@/components/shared/ResponsiveHeaderActions';
import { cn } from '@/lib/utils';

type ExerciseTab = 'STUDENTS' | 'LIBRARY';

const triggerClass = cn(
    'rounded-lg font-semibold text-xs h-7 gap-1.5',
    'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
    'data-[state=inactive]:text-muted-foreground',
    'data-[state=active]:shadow-md transition-all duration-200'
);

/**
 * Student/Library switch rendered inside the 56px header.
 * Labels are dropped below 640px of content width so the control always fits
 * on one row (icons + `title` attribute keep it understandable).
 */
export function ExerciseHeaderTabs({
    value,
    onChange,
}: {
    value: ExerciseTab;
    onChange: (value: ExerciseTab) => void;
}) {
    const { atLeast } = useHeaderDensity();
    const showLabels = atLeast('comfortable');

    return (
        <Tabs
            value={value}
            onValueChange={(next) => onChange(next as ExerciseTab)}
            className="shrink-0"
        >
            <TabsList className="h-8 p-0.5 bg-muted rounded-xl border border-border/50 w-auto flex flex-nowrap gap-0 shrink-0">
                <TabsTrigger
                    value="STUDENTS"
                    title="Theo học sinh"
                    aria-label="Theo học sinh"
                    className={cn(triggerClass, showLabels ? 'px-3' : 'px-2')}
                >
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    {showLabels && <span className="whitespace-nowrap">Theo học sinh</span>}
                </TabsTrigger>
                <TabsTrigger
                    value="LIBRARY"
                    data-tour="exercises-library-tab"
                    title="Thư viện bài tập"
                    aria-label="Thư viện bài tập"
                    className={cn(triggerClass, showLabels ? 'px-3' : 'px-2')}
                >
                    <Library className="h-3.5 w-3.5 shrink-0" />
                    {showLabels && <span className="whitespace-nowrap">Thư viện bài tập</span>}
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}

/**
 * "Quay lại" action that collapses to an icon-only button on narrow content widths.
 */
export function ExerciseBackButton({ onBack }: { onBack: () => void }) {
    const { atLeast } = useHeaderDensity();
    const showLabel = atLeast('comfortable');

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            title="Quay lại"
            aria-label="Quay lại"
            className={cn(
                'h-8 shrink-0 rounded-xl font-semibold text-[13px] whitespace-nowrap',
                showLabel ? 'px-2.5 gap-1.5' : 'w-8 p-0 justify-center'
            )}
        >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {showLabel && <span>Quay lại</span>}
        </Button>
    );
}
