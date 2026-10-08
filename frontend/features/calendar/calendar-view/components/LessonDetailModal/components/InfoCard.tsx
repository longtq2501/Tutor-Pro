import { cn } from '@/lib/utils';

// variant prop kept for backward compat but ignored – all cards use same neutral bg
export const InfoCard = ({ icon, label, value, variant: _variant }: {
    icon: React.ReactNode,
    label: string,
    value: string,
    variant?: 'blue' | 'purple' | 'green'
}) => {
    return (
        <div className={cn(
            "p-2.5 sm:p-4 rounded-xl sm:rounded-2xl",
            "border border-border/40",
            "bg-muted/20 dark:bg-muted/10",
            "transition-colors"
        )}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <span className="opacity-60 scale-90 sm:scale-100">{icon}</span>
                <span className="text-[11px] sm:text-[12px] font-medium text-muted-foreground leading-none">{label}</span>
            </div>
            <div className="text-[11px] sm:text-sm font-semibold truncate">{value}</div>
        </div>
    );
};
