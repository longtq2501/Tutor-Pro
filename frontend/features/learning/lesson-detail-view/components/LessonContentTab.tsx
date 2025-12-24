// 📁 lesson-detail-view/components/LessonContentTab.tsx
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

interface LessonContentTabProps {
  content: string | undefined;
}

export function LessonContentTab({ content }: LessonContentTabProps) {
  return (
    <div className="h-full">
      <ScrollArea className="h-full px-6 py-4">
        <div className="prose prose-gray dark:prose-invert max-w-none pb-6">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </ScrollArea>
    </div>
  );
}