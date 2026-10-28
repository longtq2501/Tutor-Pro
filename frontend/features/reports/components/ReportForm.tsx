'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Student } from '@/lib/types';
import { User, Calendar, Sparkles, Loader2 } from 'lucide-react';

interface ReportFormProps {
  students: Student[];
  selectedStudentId: number | null;
  monthValue: string;
  isLoading: boolean;
  onStudentChange: (value: number) => void;
  onMonthChange: (value: string) => void;
  onGenerate: () => void;
}

export function ReportForm({
  students,
  selectedStudentId,
  monthValue,
  isLoading,
  onStudentChange,
  onMonthChange,
  onGenerate,
}: ReportFormProps) {
  return (
    <div className="bg-muted/40 dark:bg-muted/20 border border-border/80 dark:border-border/60 rounded-xl p-3 sm:p-4 shadow-xs">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-[minmax(240px,1fr)_220px_auto] md:items-end">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-primary" />
            <span>Học sinh</span>
          </label>
          <Select
            value={selectedStudentId ? String(selectedStudentId) : undefined}
            onValueChange={(value) => onStudentChange(Number(value))}
          >
            <SelectTrigger className="h-10 rounded-lg border-border/80 bg-background text-foreground font-semibold shadow-xs hover:border-primary/50 focus:ring-primary transition-all">
              <SelectValue placeholder="Chọn học sinh" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {students.map((student) => (
                <SelectItem key={student.id} value={String(student.id)} className="font-medium cursor-pointer">
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Tháng</span>
          </label>
          <input
            type="month"
            value={monthValue}
            onChange={(event) => onMonthChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-border/80 bg-background px-3 text-sm font-semibold text-foreground shadow-xs hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={!selectedStudentId || !monthValue || isLoading}
          className="h-10 px-6 font-bold rounded-lg shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang tải...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Tạo báo cáo</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
