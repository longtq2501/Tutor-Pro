'use client';

import { cn } from '@/lib/utils';
import { useAmountVisibility } from '@/contexts/AmountVisibilityContext';

interface MoneyProps {
    value: number | string | null | undefined;
    suffix?: string;
    className?: string;
}

export function Money({ value, suffix = 'đ', className }: MoneyProps) {
    const { hideAmounts } = useAmountVisibility();
    const displayedValue = hideAmounts ? `•••••• ${suffix}` : value ?? `0 ${suffix}`;

    return (
        <span className={cn('inline-block min-w-[7ch] tabular-nums', className)}>
            {displayedValue}
        </span>
    );
}
