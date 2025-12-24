// 📁 homework-detail-dialog/components/HomeworkContent.tsx
import { Separator } from '@/components/ui/separator';
import { FileText, ExternalLink } from 'lucide-react';
import type { Homework } from '@/lib/types';

interface HomeworkContentProps {
  homework: Homework;
}

export function HomeworkContent({ homework }: HomeworkContentProps) {
  return (
    <>
      <Separator />
      
      <div>
        <h3 className="font-semibold mb-2">📝 Nội dung bài tập</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {homework.description || 'Không có mô tả'}
        </p>
      </div>

      {homework.tutorNotes && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">💡 Ghi chú từ giáo viên</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">{homework.tutorNotes}</p>
        </div>
      )}

      {homework.attachmentUrls.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">📎 Tài liệu đính kèm</h3>
          <div className="space-y-2">
            {homework.attachmentUrls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span className="flex-1 text-sm">File {index + 1}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}