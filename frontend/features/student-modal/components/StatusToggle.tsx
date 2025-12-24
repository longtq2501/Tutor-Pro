// ============================================================================
// 📁 student-modal/components/StatusToggle.tsx
// ============================================================================
interface StatusToggleProps {
  active: boolean;
  onChange: (active: boolean) => void;
}

export function StatusToggle({ active, onChange }: StatusToggleProps) {
  const handleChange = (newActive: boolean) => {
    onChange(newActive);
  };

  return (
    <div className="p-4 bg-background border border-input rounded-xl">
      <label className="block text-sm font-bold text-card-foreground mb-3">Trạng thái học tập</label>
      <div className="flex bg-muted p-1 rounded-lg">
        <button
          type="button"
          onClick={() => handleChange(true)}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
            active
              ? 'bg-background text-emerald-600 shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Đang học
        </button>
        <button
          type="button"
          onClick={() => handleChange(false)}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
            !active
              ? 'bg-background text-destructive shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Đã nghỉ
        </button>
      </div>
    </div>
  );
}