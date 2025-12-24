// ============================================================================
// 📁 student-homework/index.tsx
// ============================================================================
'use client';

import { useState } from 'react';
import type { Homework } from '@/lib/types';
import { useHomeworks } from './hooks/useHomeworks';
import { HomeworkStats } from './components/HomeworkStats';
import { HomeworkTabs } from './components/HomeworkTabs';
import HomeworkDetailDialog from '@/features/homework-detail-dialog';

export default function StudentHomeworkView() {
  const { homeworks, stats, loading, selectedTab, setSelectedTab, loadData } = useHomeworks();
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats && <HomeworkStats stats={stats} />}

      <HomeworkTabs
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        homeworks={homeworks}
        stats={stats}
        onHomeworkClick={setSelectedHomework}
      />

      {selectedHomework && (
        <HomeworkDetailDialog
          homework={selectedHomework}
          open={!!selectedHomework}
          onClose={() => setSelectedHomework(null)}
          onUpdate={loadData}
        />
      )}
    </div>
  );
}