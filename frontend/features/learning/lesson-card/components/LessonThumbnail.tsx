// 📁 lesson-card/components/LessonThumbnail.tsx
import Image from 'next/image';
import { PlayCircle, CheckCircle2 } from 'lucide-react';

interface LessonThumbnailProps {
  thumbnailUrl?: string;
  title: string;
  videoUrl?: string;
  isCompleted: boolean;
}

export function LessonThumbnail({ 
  thumbnailUrl, 
  title, 
  videoUrl, 
  isCompleted 
}: LessonThumbnailProps) {
  return (
    <div className="relative w-full md:w-48 h-48 md:h-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-600/20 dark:to-purple-600/20 flex-shrink-0">
      {thumbnailUrl ? (
        <Image 
          src={thumbnailUrl} 
          alt={title} 
          fill 
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 192px"
          priority={false}
          unoptimized={false}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="h-16 w-16 text-blue-400/50" />
        </div>
      )}
      
      {videoUrl && (
        <div className="absolute top-2 right-2 bg-black/70 dark:bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <PlayCircle className="h-3 w-3 text-blue-300" />
          <span className="text-xs text-white font-medium">Video</span>
        </div>
      )}

      {isCompleted && (
        <div className="absolute bottom-2 right-2 bg-green-500/90 dark:bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-white" />
          <span className="text-xs text-white font-medium">Đã hiểu</span>
        </div>
      )}
    </div>
  );
}