'use client';

import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAmountVisibility } from '@/contexts/AmountVisibilityContext';

export function AmountVisibilityToggle() {
    const { hideAmounts, toggleAmounts } = useAmountVisibility();
    const label = hideAmounts ? 'Hiện số tiền' : 'Ẩn số tiền';

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={toggleAmounts}
                        aria-label={label}
                        title={label}
                        className="h-8 w-8 shrink-0 rounded-xl hover:bg-muted/50"
                    >
                        {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
