// ============================================================================
// FILE: student-dashboard/components/UpcomingSessionsSection.tsx
// ============================================================================
import { Calendar } from 'lucide-react';
import type { SessionRecord } from '@/lib/types';
import { SessionCard } from './SessionCard';

export const UpcomingSessionsSection = ({ sessions }: { sessions: SessionRecord[] }) => (
  <div className="lg:col-span-2 bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
    <div className="p-6 border-b border-border flex items-center gap-3">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-card-foreground">Buổi Học Sắp Tới</h2>
        <p className="text-sm text-muted-foreground">Các buổi học trong tháng này</p>
      </div>
    </div>
    
    <div className="p-6">
      {sessions.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
          <Calendar className="mx-auto text-muted-foreground mb-2" size={32} />
          <p className="text-muted-foreground font-medium">Không có buổi học sắp tới</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.slice(0, 5).map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  </div>
);