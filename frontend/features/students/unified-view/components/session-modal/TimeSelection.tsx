import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import React from 'react';

interface TimeSelectionProps {
    startTime: string;
    endTime: string;
    duration: number;
    updateField: (field: string, value: string) => void;
}

/**
 * Time selection fields with duration badge for AddSessionModal.
 */
export function TimeSelection({ startTime, endTime, duration, updateField }: TimeSelectionProps) {
    return (
        <div className="space-y-3 bg-gradient-to-br from-primary/5 to-blue-500/5 p-4 rounded-2xl border border-primary/10 mt-5">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    Thời gian
                </Label>
                {duration > 0 && (
                    <div className="px-2.5 py-1 bg-primary/15 border border-primary/30 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{duration} giờ</span>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide px-1">Bắt đầu</div>
                    <Input
                        type="time"
                        className="h-14 px-4 rounded-xl border-2 border-border/40 focus:border-primary hover:border-primary/50 transition-all font-bold text-lg bg-background shadow-sm hover:shadow-md text-xs"
                        value={startTime}
                        onChange={e => updateField('startTime', e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide px-1">Kết thúc</div>
                    <Input
                        type="time"
                        className="h-14 px-4 rounded-xl border-2 border-border/40 focus:border-primary hover:border-primary/50 transition-all font-bold text-lg bg-background shadow-sm hover:shadow-md text-xs"
                        value={endTime}
                        onChange={e => updateField('endTime', e.target.value)}
                        required
                    />
                </div>
            </div>
        </div>
    );
}
