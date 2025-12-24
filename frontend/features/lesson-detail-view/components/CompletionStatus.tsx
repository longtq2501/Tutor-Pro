// 📁 lesson-detail-view/components/CompletionStatus.tsx
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CompletionStatusProps {
  completedAt: string;
}

export function CompletionStatus({ completedAt }: CompletionStatusProps) {
  return (
    <Card className="bg-green-600/10 border-green-600/30">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-400" />
          <div>
            <p className="text-green-200 font-medium">Bạn đã hoàn thành bài học này!</p>
            <p className="text-sm text-green-300/70">
              Hoàn thành lúc: {format(new Date(completedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}