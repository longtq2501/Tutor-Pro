// 📁 parents-view/utils/stats.ts
import type { Parent } from '@/lib/types';

export function calculateParentStats(parents: Parent[]) {
  return {
    total: parents.length,
    withEmail: parents.filter(p => p.email).length,
    totalStudents: parents.reduce((sum, p) => sum + p.studentCount, 0),
  };
}