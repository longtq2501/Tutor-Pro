import { DollarSign, Calendar } from 'lucide-react';
import { Student } from '@/lib/types';
import { formatCurrency } from '../utils/formatters';

/**
 * Details section of the StudentCard.
 * Minimalist design: no background boxes, clean dividers.
 * Only the debt amount carries color (red if > 0, else neutral).
 */
export function StudentCardDetails({ student }: { student: Student }) {
    const hasDebt = (student.totalUnpaid || 0) > 0;

    return (
        <div className="space-y-2.5 mb-4">
            {/* Price per hour */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign size={13} className="shrink-0" />
                <span className="font-medium text-foreground">{formatCurrency(student.pricePerHour)}</span>
                <span className="text-muted-foreground">/&nbsp;giờ</span>
            </div>

            {/* Schedule */}
            {student.schedule && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={13} className="shrink-0" />
                    <span className="line-clamp-1">{student.schedule}</span>
                </div>
            )}

            {/* Divider */}
            <div className="border-t border-border/60 pt-2.5 flex justify-between items-center text-sm">
                <span className="text-muted-foreground text-xs">Đang nợ</span>
                <span className={`font-semibold text-sm ${hasDebt ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {formatCurrency(student.totalUnpaid || 0)}
                </span>
            </div>
        </div>
    );
}
