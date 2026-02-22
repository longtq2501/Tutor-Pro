'use client';

interface StatsBarItem {
    label: string;
    value: string | number;
    variant?: 'default' | 'green' | 'red' | 'accent';
}

interface StatsBarProps {
    items: StatsBarItem[];
}

export function StatsBar({ items }: StatsBarProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {items.map((stat) => (
                <div key={stat.label} className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-xl p-4 flex flex-col gap-1 hover:border-[var(--admin-border2)] transition-colors group">
                    <span className="text-[10px] font-bold text-[var(--admin-text3)] uppercase tracking-widest group-hover:text-[var(--admin-text2)] transition-colors">{stat.label}</span>
                    <span className={`text-xl font-black ${stat.variant === 'green' ? 'text-[var(--admin-green)]' :
                            stat.variant === 'red' ? 'text-[var(--admin-red)]' :
                                stat.variant === 'accent' ? 'text-[var(--admin-accent)]' : 'text-[var(--admin-text)]'
                        }`}>{stat.value}</span>
                </div>
            ))}
        </div>
    );
}
