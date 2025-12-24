// ============================================================================
// 📁 student-homework/components/EmptyState.tsx
// ============================================================================
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Không có bài tập nào</p>
      </CardContent>
    </Card>
  );
}