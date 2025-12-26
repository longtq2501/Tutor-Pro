// ============================================================================
// FILE: add-session-modal/components/FormField.tsx
// ============================================================================
import { Calendar, Users } from 'lucide-react';
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

const inputClass = "w-full bg-background border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export const DateField = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2">
      <Calendar size={16} />
      Ngày dạy
    </Label>
    <DatePicker
      value={value ? new Date(value) : undefined}
      onChange={(date) => {
        if (date) {
          onChange(format(date, 'yyyy-MM-dd'));
        }
      }}
      placeholder="Chọn ngày dạy"
      className="w-full"
    />
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
    <Label className="flex items-center gap-2">
      {icon} {label}
    </Label>
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || min)}
      min={min}
      step={step}
      className="font-bold text-center text-lg h-11"
      required
    />
  </div>
);

interface StudentFieldProps {
  students: Student[];
  value: number;
  onChange: (v: number) => void;
}

export const StudentField = ({ students, value, onChange }: StudentFieldProps) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2">
      <Users size={16} />
      Học sinh
    </Label>
    <Select value={value ? value.toString() : ''} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="w-full h-11">
        <SelectValue placeholder="Chọn học sinh..." />
      </SelectTrigger>
      <SelectContent>
        {students.map((student) => (
          <SelectItem key={student.id} value={student.id.toString()}>
            {student.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);