// 📁 lesson-detail-view/components/VideoPlayer.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
}

export function VideoPlayer({ videoUrl, thumbnailUrl }: VideoPlayerProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-lg">
          <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Video Bài Giảng
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video bg-black">
          <video
            src={videoUrl}
            controls
            controlsList="nodownload"
            className="w-full h-full object-contain"
            poster={thumbnailUrl}
          >
            Trình duyệt của bạn không hỗ trợ phát video.
          </video>
        </div>
      </CardContent>
    </Card>
  );
}