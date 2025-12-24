// 📁 lesson-timeline-view/components/FilterPanel.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Calendar } from 'lucide-react';

interface FilterPanelProps {
  selectedYear: string;
  selectedMonth: string;
  availableYears: number[];
  totalCount: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  selectedYear,
  selectedMonth,
  availableYears,
  totalCount,
  filteredCount,
  hasActiveFilters,
  onYearChange,
  onMonthChange,
  onClearFilters,
}: FilterPanelProps) {
  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Filter className="h-5 w-5" />
          Bộ Lọc
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger className="w-32 bg-[#0A0A0A] border-[#2A2A2A]">
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                <SelectItem value="all">Tất cả năm</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={selectedMonth} onValueChange={onMonthChange}>
            <SelectTrigger className="w-32 bg-[#0A0A0A] border-[#2A2A2A]">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
              <SelectItem value="all">Tất cả tháng</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                <SelectItem key={month} value={month.toString()}>Tháng {month}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="bg-[#0A0A0A] border-[#2A2A2A] hover:bg-[#2A2A2A]"
            >
              Xóa bộ lọc
            </Button>
          )}

          <div className="ml-auto text-sm text-gray-400">
            Hiển thị {filteredCount} / {totalCount} bài học
          </div>
        </div>
      </CardContent>
    </Card>
  );
}