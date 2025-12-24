// ============================================================================
// 📁 tutor-homework-view/components/StudentSelector.tsx
// ============================================================================
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Student } from '@/lib/types';

interface StudentSelectorProps {
  students: Student[];
  selectedStudent: number | null;
  onSelect: (studentId: number) => void;
}

export function StudentSelector({ students, selectedStudent, onSelect }: StudentSelectorProps) {
  return (
    <Select
      value={selectedStudent?.toString()}
      onValueChange={(value) => onSelect(Number(value))}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Chọn học sinh" />
      </SelectTrigger>
      <SelectContent>
        {students.map((student) => (
          <SelectItem key={student.id} value={student.id.toString()}>
            {student.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}