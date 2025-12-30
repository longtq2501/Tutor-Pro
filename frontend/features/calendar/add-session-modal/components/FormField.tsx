import { Calendar as CalendarIcon, Users, ChevronDown } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import type { Student } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export const DateField = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Ngày dạy</Label>
    <div className="relative group">
      <DatePicker
        value={value ? new Date(value) : undefined}
        onChange={(date) => {
          if (date) {
            onChange(format(date, 'yyyy-MM-dd'));
          }
        }}
        placeholder="Chọn ngày dạy"
        className="w-full h-14 rounded-2xl bg-muted/20 border-border/40 hover:bg-muted/40 transition-all font-bold"
      />
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full" />
    </div>
  </div>
);

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon?: React.ReactNode;
  min: number;
  step: number;
}

export const NumberField = ({ label, value, onChange, icon, min, step }: NumberFieldProps) => (
  <div className="space-y-2">
    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-1.5">
      {icon} {label}
    </Label>
    <div className="relative group">
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || min)}
        min={min}
        step={step}
        className="font-black text-center text-xl h-14 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all outline-none"
        required
      />
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full pointer-events-none" />
    </div>
  </div>
);

interface StudentFieldProps {
  students: Student[];
  value: number;
  onChange: (v: number) => void;
}

export const StudentField = ({ students, value, onChange }: StudentFieldProps) => (
  <div className="space-y-2">
    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-1.5">
      <Users size={14} className="text-primary" /> Học sinh
    </Label>
    <Select value={value ? value.toString() : ''} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="w-full h-14 rounded-2xl bg-muted/20 border-border/40 focus:ring-0 focus:ring-offset-0 transition-all font-black text-base px-6">
        <SelectValue placeholder="Chọn học sinh..." />
      </SelectTrigger>
      <SelectContent className="rounded-2xl border-border/60 shadow-2xl p-2">
        {students.map((student) => (
          <SelectItem
            key={student.id}
            value={student.id.toString()}
            className="rounded-xl py-3 px-4 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer mb-1 last:mb-0"
          >
            {student.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
