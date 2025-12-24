// ============================================================================
// 📁 tutor-homework-view/components/EmptyState.tsx
// ============================================================================
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Chưa có bài tập nào</p>
        <Button variant="outline" className="mt-4" onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo bài tập đầu tiên
        </Button>
      </CardContent>
    </Card>
  );
}