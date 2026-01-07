// ============================================================================
// FILE: document-library/components/StatsCards.tsx
// ============================================================================
interface Props {
  stats: { total: number; downloads: number; size: string };
}

export const StatsCards = ({ stats }: Props) => (
  <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6">
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 lg:p-4 border border-blue-100 dark:border-blue-800/30">
      <p className="text-[10px] lg:text-sm text-muted-foreground mb-1 truncate">Tổng tài liệu</p>
      <p className="text-lg lg:text-2xl font-bold text-blue-600 dark:text-blue-400 truncate">{stats.total}</p>
    </div>
    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 lg:p-4 border border-green-100 dark:border-green-800/30">
      <p className="text-[10px] lg:text-sm text-muted-foreground mb-1 truncate">Lượt tải xuống</p>
      <p className="text-lg lg:text-2xl font-bold text-green-600 dark:text-green-400 truncate">{stats.downloads}</p>
    </div>
    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 lg:p-4 border border-purple-100 dark:border-purple-800/30">
      <p className="text-[10px] lg:text-sm text-muted-foreground mb-1 truncate">Dung lượng</p>
      <p className="text-lg lg:text-2xl font-bold text-purple-600 dark:text-purple-400 truncate">{stats.size}</p>
    </div>
  </div>
);