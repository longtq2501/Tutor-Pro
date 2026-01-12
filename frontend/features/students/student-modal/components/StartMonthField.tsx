import { Calendar } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';

interface StartMonthFieldProps {
    value: string;
    onChange: (value: string) => void;
}

/**
 * StartMonthField Component
 * Renders a labeled date picker specifically for selecting a starting month.
 */
export function StartMonthField({ value, onChange }: StartMonthFieldProps) {
    return (
        <div>
            <label className="block text-sm font-bold text-card-foreground mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Tháng bắt đầu
            </label>
            <DatePicker
                value={value ? new Date(value + '-01') : undefined}
                onChange={(date) => {
                    if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        onChange(`${year}-${month}`);
                    }
                }}
                placeholder="Chọn tháng bắt đầu"
                className="w-full"
            />
        </div>
    );
}
