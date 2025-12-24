// 📁 lesson-card/components/LessonTags.tsx
import { Badge } from '@/components/ui/badge';

interface LessonTagsProps {
  imageCount: number;
  resourceCount: number;
}

export function LessonTags({ imageCount, resourceCount }: LessonTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {imageCount > 0 && (
        <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-600/20 dark:text-purple-400 dark:border-purple-600/30">
          {imageCount} ảnh bảng
        </Badge>
      )}
      {resourceCount > 0 && (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-600/30">
          {resourceCount} tài liệu
        </Badge>
      )}
    </div>
  );
}