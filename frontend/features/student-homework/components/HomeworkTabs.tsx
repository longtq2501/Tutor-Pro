// ============================================================================
// 📁 student-homework/components/HomeworkTabs.tsx
// ============================================================================
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import type { Homework, HomeworkStats } from '@/lib/types';
import { HomeworkCard } from './HomeworkCard';

interface HomeworkTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  homeworks: Homework[];
  stats: HomeworkStats | null;
  onHomeworkClick: (homework: Homework) => void;
}

export function HomeworkTabs({ 
  selectedTab, 
  onTabChange, 
  homeworks, 
  stats,
  onHomeworkClick 
}: HomeworkTabsProps) {
  return (
    <Tabs value={selectedTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">Tất cả ({stats?.totalHomeworks || 0})</TabsTrigger>
        <TabsTrigger value="upcoming">Sắp đến hạn ({stats?.upcomingCount || 0})</TabsTrigger>
        <TabsTrigger value="overdue">Quá hạn ({stats?.overdueCount || 0})</TabsTrigger>
        <TabsTrigger value="completed">Hoàn thành ({stats?.gradedCount || 0})</TabsTrigger>
      </TabsList>

      <TabsContent value={selectedTab} className="space-y-4">
        {homeworks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Không có bài tập nào</p>
            </CardContent>
          </Card>
        ) : (
          homeworks.map((homework) => (
            <HomeworkCard
              key={homework.id}
              homework={homework}
              onClick={() => onHomeworkClick(homework)}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}