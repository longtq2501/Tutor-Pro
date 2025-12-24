// 📁 lesson-detail-view/components/VideoPlayer.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
}

export function VideoPlayer({ videoUrl, thumbnailUrl }: VideoPlayerProps) {
  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A] overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Video className="h-5 w-5 text-blue-400" />
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