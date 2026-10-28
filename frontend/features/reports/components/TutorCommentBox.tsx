'use client';

import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageSquareQuote, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface TutorCommentBoxProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSave: (value: string) => Promise<void>;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function TutorCommentBox({ value, disabled = false, onChange, onSave }: TutorCommentBoxProps) {
  const debouncedValue = useDebounce(value, 1000);
  const lastSavedValueRef = useRef(value);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  useEffect(() => {
    if (disabled) {
      return;
    }

    if (debouncedValue === lastSavedValueRef.current) {
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setSaveState('saving');
    });

    onSave(debouncedValue)
      .then(() => {
        if (cancelled) return;
        lastSavedValueRef.current = debouncedValue;
        setSaveState('saved');
      })
      .catch(() => {
        if (cancelled) return;
        setSaveState('error');
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedValue, disabled, onSave]);

  const saveStatus = useMemo(() => {
    if (saveState === 'saving') {
      return {
        label: 'Đang lưu...',
        className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
        icon: <Clock className="h-3 w-3 animate-spin text-amber-500" />,
      };
    }
    if (saveState === 'saved') {
      return {
        label: 'Đã lưu ✓',
        className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        icon: <CheckCircle2 className="h-3 w-3 text-emerald-500" />,
      };
    }
    if (saveState === 'error') {
      return {
        label: 'Lưu thất bại',
        className: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30',
        icon: <AlertCircle className="h-3 w-3 text-red-500" />,
      };
    }
    return {
      label: 'Tự động lưu sau 1s',
      className: 'bg-muted/50 text-muted-foreground border-border/60',
      icon: <Clock className="h-3 w-3 text-muted-foreground" />,
    };
  }, [saveState]);

  return (
    <div className="bg-muted/20 dark:bg-muted/10 border border-border/80 dark:border-border/60 rounded-xl p-3.5 space-y-2.5 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <MessageSquareQuote className="h-4 w-4 text-primary" />
          <span>Nhận xét của gia sư</span>
        </label>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${saveStatus.className}`}>
          {saveStatus.icon}
          {saveStatus.label}
        </span>
      </div>
      <Textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nhập nhận xét tổng kết tháng..."
        className="min-h-36 rounded-lg border-border/80 bg-background p-3 text-sm font-medium text-foreground shadow-xs focus-visible:ring-primary placeholder:text-muted-foreground/60 transition-all leading-relaxed"
      />
    </div>
  );
}
