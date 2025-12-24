// 📁 lesson-detail-view/components/LessonContentTab.tsx
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

interface LessonContentTabProps {
  content: string | undefined;
}

export function LessonContentTab({ content }: LessonContentTabProps) {
  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
      <CardContent className="pt-6">
        <ScrollArea className="h-[600px] pr-4">
          <div className="prose prose-invert prose-blue max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}