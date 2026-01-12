import { DollarSign, Calendar } from 'lucide-react';
import { Student } from '@/lib/types';
import { formatCurrency } from '../utils/formatters';

/**
 * Details section of the StudentCard.
 * Displays price per hour, schedule, and total unpaid balance.
 */
export function StudentCardDetails({ student }: { student: Student }) {
    return (
        <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm text-muted-foreground bg-slate-50 dark:bg-muted/50 p-3 rounded-xl border border-border">
                <div className="bg-white dark:bg-background p-1.5 rounded-md shadow-sm mr-3 text-primary border border-border">
                    <DollarSign size={16} />
                </div>
                <span className="font-bold text-foreground">{formatCurrency(student.pricePerHour)}</span>
                <span className="text-muted-foreground ml-1">/ giờ</span>
            </div>

            {student.schedule && (
                <div className="flex items-center text-sm text-muted-foreground bg-slate-50 dark:bg-muted/50 p-3 rounded-xl border border-border">
                    <div className="bg-white dark:bg-background p-1.5 rounded-md shadow-sm mr-3 text-primary border border-border">
                        <Calendar size={16} />
                    </div>
                    <span className="font-medium line-clamp-1">{student.schedule}</span>
                </div>
            )}

            {/* Revenue Snapshot */}
            <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-muted-foreground font-bold">Đang nợ</span>
                <span className={`font-bold ${(student.totalUnpaid || 0) > 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {formatCurrency(student.totalUnpaid || 0)}
                </span>
            </div>
        </div>
    );
}
