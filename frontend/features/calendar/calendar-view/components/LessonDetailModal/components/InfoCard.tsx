import { cn } from '@/lib/utils';

export const InfoCard = ({ icon, label, value }: {
    icon: React.ReactNode,
    label: string,
    value: string,
    variant?: 'blue' | 'purple' | 'green'
}) => {
    return (
        <div className={cn(
            "p-3 rounded-xl",
            "border border-border/50",
            "bg-card dark:bg-card/70 shadow-2xs",
            "transition-colors"
        )}>
            <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-muted-foreground">{icon}</span>
                <span className="text-[11px] font-medium text-muted-foreground leading-none">{label}</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-foreground truncate">{value}</div>
        </div>
    );
};
