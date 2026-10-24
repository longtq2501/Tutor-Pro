'use client';

import { GraduationCap, Library } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHeaderDensity } from '@/components/shared/ResponsiveHeaderActions';
import { cn } from '@/lib/utils';

const triggerClass = cn(
  'rounded-lg font-bold text-xs h-7 gap-1.5',
  'data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all'
);

/**
 * Kho học liệu / Khóa học switch for the 56px header.
 * - < 640px content width: labels hidden (icons + `title` tooltip remain)
 * - < 420px content width: counts hidden as well
 */
export function LessonHeaderTabs({
  libraryCount,
  coursesCount,
}: {
  libraryCount: number;
  coursesCount: number;
}) {
  const { atLeast } = useHeaderDensity();
  const showLabels = atLeast('comfortable');
  const showCounts = atLeast('compact');

  return (
    <TabsList
      data-tour="lessons-tabs"
      className="h-8 p-0.5 bg-muted/50 rounded-xl border border-border/40 w-auto flex flex-nowrap gap-1 shrink-0"
    >
      <TabsTrigger
        value="library"
        title="Kho học liệu"
        aria-label="Kho học liệu"
        className={cn(triggerClass, showLabels ? 'px-3' : 'px-2')}
      >
        <Library className="h-3.5 w-3.5 shrink-0" />
        {showLabels && <span className="whitespace-nowrap">Kho học liệu</span>}
        {showCounts && (
          <Badge
            variant="secondary"
            className="rounded-full px-1.5 py-0 text-[10px] font-bold shrink-0"
          >
            {libraryCount}
          </Badge>
        )}
      </TabsTrigger>

      <TabsTrigger
        value="courses"
        data-tour="lessons-courses-tab"
        title="Khóa học"
        aria-label="Khóa học"
        className={cn(triggerClass, showLabels ? 'px-3' : 'px-2')}
      >
        <GraduationCap className="h-3.5 w-3.5 shrink-0" />
        {showLabels && <span className="whitespace-nowrap">Khóa học</span>}
        {showCounts && (
          <Badge
            variant="secondary"
            className="rounded-full px-1.5 py-0 text-[10px] font-bold shrink-0"
          >
            {coursesCount}
          </Badge>
        )}
      </TabsTrigger>
    </TabsList>
  );
}
