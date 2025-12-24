// ============================================================================
// 📁 student-list/components/StudentListHeader.tsx
// ============================================================================
import { User, Plus, Search } from 'lucide-react';

interface StudentListHeaderProps {
  activeCount: number;
  inactiveCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export function StudentListHeader({
  activeCount,
  inactiveCount,
  searchTerm,
  onSearchChange,
  onAddClick,
}: StudentListHeaderProps) {
  return (
    <div className="bg-card rounded-3xl shadow-sm border border-border p-6">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        
        {/* Title & Stats */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-card-foreground flex items-center justify-center lg:justify-start gap-3">
            <User className="text-indigo-600 dark:text-indigo-400" />
            Danh sách học sinh
          </h2>
          <div className="flex items-center gap-4 mt-2 text-sm font-medium">
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
              {activeCount} đang học
            </span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">
              {inactiveCount} đã nghỉ
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm học sinh..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <button
            onClick={onAddClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            Thêm Học Sinh
          </button>
        </div>
      </div>
    </div>
  );
}