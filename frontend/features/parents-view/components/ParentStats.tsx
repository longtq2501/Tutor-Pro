// 📁 parents-view/components/ParentStats.tsx
interface ParentStatsProps {
  total: number;
  withEmail: number;
  totalStudents: number;
}

export function ParentStats({ total, withEmail, totalStudents }: ParentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
        <p className="text-sm text-muted-foreground mb-1">Tổng số phụ huynh</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{total}</p>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800/30">
        <p className="text-sm text-muted-foreground mb-1">Có email</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{withEmail}</p>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800/30">
        <p className="text-sm text-muted-foreground mb-1">Tổng học sinh</p>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalStudents}</p>
      </div>
    </div>
  );
}