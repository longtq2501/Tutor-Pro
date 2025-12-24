// ============================================================================
// FILE: create-homework-dialog/components/FormField.tsx
// ============================================================================
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const TextField = ({ id, label, value, onChange, placeholder, required }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export const TextAreaField = ({ id, label, value, onChange, placeholder, rows }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  </div>
);

export const DateTimeField = ({ id, label, value, onChange, required }: any) => (
  <div className="space-y-2">
    <Label htmlFor={id}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      id={id}
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  </div>
);

export const PrioritySelect = ({ value, onChange }: any) => (
  <div className="space-y-2">
    <Label htmlFor="priority">Độ ưu tiên</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="LOW">Thấp</SelectItem>
        <SelectItem value="MEDIUM">Trung bình</SelectItem>
        <SelectItem value="HIGH">Cao</SelectItem>
      </SelectContent>
    </Select>
  </div>
);