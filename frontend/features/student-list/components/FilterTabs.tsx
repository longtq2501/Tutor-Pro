// ============================================================================
// 📁 student-list/components/FilterTabs.tsx
// ============================================================================
interface FilterTabsProps {
  filterStatus: 'all' | 'active' | 'inactive';
  onFilterChange: (status: 'all' | 'active' | 'inactive') => void;
}

export function FilterTabs({ filterStatus, onFilterChange }: FilterTabsProps) {
  return (
    <div className="flex justify-center lg:justify-start">
      <div className="bg-muted p-1.5 rounded-xl flex gap-1">
        {(['all', 'active', 'inactive'] as const).map((status) => (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              filterStatus === status
                ? 'bg-background text-primary shadow-sm scale-100'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            {status === 'all' && 'Tất cả'}
            {status === 'active' && 'Đang học'}
            {status === 'inactive' && 'Đã nghỉ'}
          </button>
        ))}
      </div>
    </div>
  );
}