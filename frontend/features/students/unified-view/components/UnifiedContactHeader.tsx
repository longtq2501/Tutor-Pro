import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserX, UserCircle, DollarSign, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

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

function StatsCard({
    icon,
    label,
    value,
    variant,
}: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
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

function StatsOverview({ stats }: { stats: UnifiedContactHeaderProps['stats'] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatsCard icon={<Users className="w-5 h-5" />} label="Đang học" value={stats.active} variant="green" />
            <StatsCard icon={<UserX className="w-5 h-5" />} label="Đã nghỉ" value={stats.inactive} variant="gray" />
            <StatsCard icon={<UserCircle className="w-5 h-5" />} label="Phụ huynh" value={stats.parents} variant="blue" />
            <StatsCard icon={<DollarSign className="w-5 h-5" />} label="Tổng nợ" value={stats.totalDebt} variant="red" />
        </div>
    );
}

export function UnifiedContactHeader(props: UnifiedContactHeaderProps) {
    return (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 text-center sm:text-left">
                    Học Sinh & Phụ Huynh
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1 text-center sm:text-left">
                    Quản lý thông tin học sinh và phụ huynh trong hệ thống
                </p>
            </div>

            <StatsOverview stats={props.stats} />

            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm..."
                        className="pl-10 h-11 w-full rounded-xl border-border/60 bg-background focus:ring-primary/10"
                        value={props.searchTerm}
                        onChange={(e) => props.onSearchChange(e.target.value)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Tabs value={props.filter} onValueChange={props.onFilterChange} className="w-full sm:w-auto">
                        <TabsList className="h-11 p-1 bg-muted/50 rounded-xl border border-border/40 w-full sm:w-auto grid grid-cols-3">
                            <TabsTrigger value="all" className="rounded-lg font-bold text-xs h-9">Tất cả</TabsTrigger>
                            <TabsTrigger value="active" className="rounded-lg font-bold text-xs h-9">Đang học</TabsTrigger>
                            <TabsTrigger value="inactive" className="rounded-lg font-bold text-xs h-9">Đã nghỉ</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Button
                        size="lg"
                        onClick={props.onAddStudent}
                        className="h-11 rounded-xl bg-primary shadow-lg shadow-primary/20 font-black text-xs gap-2"
                    >
                        <Plus size={18} /> Thêm học sinh
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
