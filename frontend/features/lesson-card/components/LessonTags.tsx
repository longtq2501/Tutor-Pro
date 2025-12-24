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
        <Badge variant="secondary" className="bg-purple-600/20 text-purple-400 border-purple-600/30">
          {imageCount} ảnh bảng
        </Badge>
      )}
      {resourceCount > 0 && (
        <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
          {resourceCount} tài liệu
        </Badge>
      )}
    </div>
  );
}