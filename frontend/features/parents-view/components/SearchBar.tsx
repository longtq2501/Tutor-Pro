// 📁 parents-view/components/SearchBar.tsx
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Tìm theo tên, email, số điện thoại..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none bg-background text-foreground placeholder:text-muted-foreground transition-colors"
        />
      </div>
    </div>
  );
}