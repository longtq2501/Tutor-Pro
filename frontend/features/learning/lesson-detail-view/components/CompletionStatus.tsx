// 📁 lesson-detail-view/components/CompletionStatus.tsx
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CompletionStatusProps {
  completedAt?: string;
  learningStatus?: string;
  videoProgress?: number;
}

export function CompletionStatus({
  completedAt,
  learningStatus,
  videoProgress
}: CompletionStatusProps) {
  const isCompleted = !!completedAt;

  return (
    <Card className={cn(
      "border-none shadow-sm overflow-hidden",
      isCompleted ? "bg-green-500/10" : "bg-primary/5"
    )}>
      <CardContent className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-2.5 rounded-xl shadow-inner",
            isCompleted ? "bg-green-500/20" : "bg-primary/10"
          )}>
            <CheckCircle2 className={cn(
              "h-6 w-6",
              isCompleted ? "text-green-600 dark:text-green-400" : "text-primary/60"
            )} />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
              {isCompleted ? "Bài học đã hoàn thành" : "Trạng thái học tập"}
              {learningStatus && (
                <Badge variant="outline" className="text-[9px] h-4 border-primary/20 bg-primary/5 uppercase font-black tracking-tighter">
                  {learningStatus}
                </Badge>
              )}
            </h4>
            <p className="text-xs text-muted-foreground font-medium">
              {isCompleted
                ? `Hoàn tất lúc: ${format(new Date(completedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}`
                : `Tiến độ video: ${videoProgress || 0}%`}
            </p>
          </div>
        </div>

        {videoProgress !== undefined && (
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest leading-none mb-1 text-primary/70">Tiến độ Video</p>
              <p className="text-sm font-black text-primary leading-none">{videoProgress}%</p>
            </div>
            <div className="w-16 h-1 w-12 bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-700" style={{ width: `${videoProgress}%` }} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}