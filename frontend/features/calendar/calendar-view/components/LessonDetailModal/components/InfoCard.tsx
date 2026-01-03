import { cn } from '@/lib/utils';

export const InfoCard = ({ icon, label, value, variant }: {
    icon: React.ReactNode,
    label: string,
    value: string,
    variant: 'blue' | 'purple' | 'green'
}) => {
    const variants = {
        blue: "bg-blue-50/50 dark:bg-blue-600/10 border-blue-100 dark:border-blue-500/20",
        purple: "bg-purple-50/50 dark:bg-purple-600/10 border-purple-100 dark:border-purple-500/20",
        green: "bg-emerald-50/50 dark:bg-emerald-600/10 border-emerald-100 dark:border-emerald-500/20"
    };

    return (
        <div className={cn("p-4 rounded-2xl border transition-all hover:shadow-md", variants[variant])}>
            <div className="flex items-center gap-2 mb-2">
                <span className="opacity-70">{icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
            </div>
            <div className="text-sm font-bold truncate">{value}</div>
        </div>
    );
};
