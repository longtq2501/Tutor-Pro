import React from 'react';
import { Users, UserX, UserCircle, Wallet, Search, Plus, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useUI } from '@/contexts/UIContext';

interface UnifiedContactHeaderProps {
    stats: {
        active: number;
        inactive: number;
        parents: number;
        totalDebt: string;
    };
    searchTerm: string;
    onSearchChange: (val: string) => void;
    filter: string;
    onFilterChange: (val: string) => void;
    onAddStudent: () => void;
}

const FILTER_LABELS: Record<string, string> = {
    all: 'Tất cả',
    active: 'Đang học',
    inactive: 'Đã nghỉ',
    trung_tam: 'Trung tâm',
    day_rieng: 'Dạy riêng',
};

function StatsCard({
    icon,
    label,
    value,
    variant,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    variant: 'green' | 'gray' | 'blue' | 'red';
}) {
    const variants = {
        green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        gray: "bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700",
        blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        red: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200 dark:border-red-800"
    };

    return (
        <div className={cn("flex flex-col p-4 rounded-xl border transition-all hover:shadow-md", variants[variant])}>
            <div className="flex items-center gap-2 opacity-80 mb-2">
                {icon}
                <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
        </div>
    );
}

function StatsOverview({ stats, isLoading, isError }: { stats: UnifiedContactHeaderProps['stats'], isLoading?: boolean, isError?: boolean }) {
    const renderValue = (val: number | string) => {
        if (isLoading) return <div className="h-8 w-16 bg-muted-foreground/10 animate-pulse rounded-lg" />;
        if (isError) return <span className="text-muted-foreground/40 text-lg">--</span>;
        return val;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatsCard icon={<Users className="w-5 h-5" />} label="Đang học" value={renderValue(stats.active)} variant="green" />
            <StatsCard icon={<UserX className="w-5 h-5" />} label="Đã nghỉ" value={renderValue(stats.inactive)} variant="gray" />
            <StatsCard icon={<UserCircle className="w-5 h-5" />} label="Phụ huynh" value={renderValue(stats.parents)} variant="blue" />
            <StatsCard icon={<Wallet className="w-5 h-5" />} label="Tổng nợ" value={renderValue(stats.totalDebt)} variant="red" />
        </div>
    );
}

export function UnifiedContactStats({ stats, isLoading, isError }: { stats: UnifiedContactHeaderProps['stats'], isLoading?: boolean, isError?: boolean }) {
    return (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <StatsOverview stats={stats} isLoading={isLoading} isError={isError} />
        </div>
    );
}

export function UnifiedContactActions(props: Omit<UnifiedContactHeaderProps, 'stats'>) {
    const { containerWidth } = useUI();
    const [searchOpen, setSearchOpen] = React.useState(false);

    // Priority-plus thresholds based on measured content width
    const showFullTabs = containerWidth >= 1000;
    const showFullSearch = containerWidth >= 700;
    const showAddText = containerWidth >= 520;

    return (
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink-0">
            {/* Search */}
            {showFullSearch ? (
                <div className="relative w-36 sm:w-44 md:w-52">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm..."
                        className="pl-8 h-8 w-full rounded-xl border-border/60 bg-card/50 text-[13px] font-medium"
                        value={props.searchTerm}
                        onChange={(e) => props.onSearchChange(e.target.value)}
                    />
                </div>
            ) : (
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-xl border-border/40 hover:bg-muted/50 shrink-0"
                            title="Tìm kiếm"
                        >
                            <Search className="w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2 rounded-xl z-50" align="end">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                autoFocus
                                placeholder="Tìm kiếm học sinh..."
                                className="pl-8 h-8 rounded-lg text-[13px]"
                                value={props.searchTerm}
                                onChange={(e) => props.onSearchChange(e.target.value)}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            )}

            {/* Filter: Full Segmented Tabs when wide, compact dropdown when narrow */}
            {showFullTabs ? (
                <Tabs value={props.filter} onValueChange={props.onFilterChange} className="shrink-0">
                    <TabsList className="h-8 p-0.5 bg-muted/50 rounded-xl border border-border/40">
                        {Object.entries(FILTER_LABELS).map(([val, label]) => (
                            <TabsTrigger
                                key={val}
                                value={val}
                                className="rounded-lg font-medium text-[13px] h-7 px-2.5 whitespace-nowrap"
                            >
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-xl px-2.5 gap-1.5 border-border/40 hover:bg-muted/50 bg-card/50 text-[13px] font-medium whitespace-nowrap shrink-0"
                        >
                            <span>{FILTER_LABELS[props.filter] || 'Lọc'}</span>
                            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl z-50">
                        {Object.entries(FILTER_LABELS).map(([val, label]) => (
                            <DropdownMenuItem
                                key={val}
                                onClick={() => props.onFilterChange(val)}
                                className={cn(
                                    "rounded-lg font-medium text-[13px] cursor-pointer",
                                    props.filter === val && "bg-accent font-bold text-primary"
                                )}
                            >
                                {label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* P1: Thêm học sinh — never hidden, icon-only when narrow */}
            <Button
                size="sm"
                onClick={props.onAddStudent}
                title="Thêm học sinh"
                aria-label="Thêm học sinh"
                className={cn(
                    "h-8 rounded-xl bg-primary text-primary-foreground font-semibold text-[13px] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap shrink-0",
                    showAddText ? "px-3 gap-1.5" : "w-8 p-0 justify-center"
                )}
            >
                <Plus className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                {showAddText && <span>Thêm học sinh</span>}
            </Button>
        </div>
    );
}
