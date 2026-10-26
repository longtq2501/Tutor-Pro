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
        <div className="space-y-3 bg-muted/30 p-3.5 rounded-xl border border-border mt-4">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    Thời gian
                </Label>
                {duration > 0 && (
                    <div className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{duration} giờ</span>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <div className="text-xs text-muted-foreground font-medium px-0.5">Bắt đầu</div>
                    <Input
                        type="time"
                        className="h-10 rounded-lg bg-background"
                        value={startTime}
                        onChange={e => updateField('startTime', e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-1">
                    <div className="text-xs text-muted-foreground font-medium px-0.5">Kết thúc</div>
                    <Input
                        type="time"
                        className="h-10 rounded-lg bg-background"
                        value={endTime}
                        onChange={e => updateField('endTime', e.target.value)}
                        required
                    />
                </div>
            </div>
        </div>
    );
}
