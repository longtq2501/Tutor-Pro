// ============================================================================
// 📁 student-modal/components/BasicInfoFields.tsx
// ============================================================================
import type { StudentRequest } from '@/lib/types';

interface BasicInfoFieldsProps {
  name: string;
  phone: string;
  schedule: string;
  pricePerHour: number;
  onChange: <K extends keyof StudentRequest>(field: K, value: StudentRequest[K]) => void;
}

export function BasicInfoFields({ name, phone, schedule, pricePerHour, onChange }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-card-foreground mb-2">
          Họ và tên <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground text-foreground font-medium"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-card-foreground mb-2">
          Số điện thoại
        </label>
        <input
          type="tel"
          value={phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground text-foreground font-medium"
          placeholder="0901234567"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-card-foreground mb-2">
          Lịch học dự kiến <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={schedule}
          onChange={(e) => onChange('schedule', e.target.value)}
          className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground text-foreground font-medium"
          placeholder="T2, T4 (18:00)"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-card-foreground mb-2">
          Học phí / giờ (VNĐ)
        </label>
        <div className="relative">
          <input
            type="number"
            value={pricePerHour}
            onChange={(e) => onChange('pricePerHour', parseInt(e.target.value) || 200000)}
            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all font-semibold text-foreground"
            step="10000"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₫</span>
        </div>
      </div>
    </div>
  );
}