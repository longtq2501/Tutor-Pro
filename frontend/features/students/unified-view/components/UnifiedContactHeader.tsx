import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserX, UserCircle, DollarSign, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Local StatsCard component as per requirement
function StatsCard({
    icon,
    label,
    value,
    variant,
    trending
}: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    variant: 'green' | 'gray' | 'blue' | 'red';
    trending?: 'up' | 'down';
}) {
    const variants = {
        green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        gray: "bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700",
        blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        red: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200 dark:border-red-800"
    };

    return (
        <div className={cn(
            "flex flex-col p-4 rounded-xl border transition-all hover:shadow-md",
            variants[variant]
        )}>
            <div className="flex items-center gap-2 opacity-80 mb-2">
                {icon}
                <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <div className="text-2xl font-bold tracking-tight">
                {value}
            </div>
        </div>
    );
}

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

export function UnifiedContactHeader({
    stats,
    searchTerm,
    onSearchChange,
    filter,
    onFilterChange,
    onAddStudent
}: UnifiedContactHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
        >
            {/* Title & Description */}
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Học Sinh & Phụ Huynh
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Quản lý thông tin học sinh và phụ huynh trong hệ thống
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <StatsCard
                    icon={<Users className="w-5 h-5" />}
                    label="Đang học"
                    value={stats.active}
                    variant="green"
                    trending="up"
                />
                <StatsCard
                    icon={<UserX className="w-5 h-5" />}
                    label="Đã nghỉ"
                    value={stats.inactive}
                    variant="gray"
                />
                <StatsCard
                    icon={<UserCircle className="w-5 h-5" />}
                    label="Phụ huynh"
                    value={stats.parents}
                    variant="blue"
                />
                <StatsCard
                    icon={<DollarSign className="w-5 h-5" />}
                    label="Tổng nợ"
                    value={stats.totalDebt}
                    variant="red"
                />
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm học sinh, phụ huynh, số điện thoại..."
                        className="pl-10 h-11"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Filter Tabs */}
                <Tabs value={filter} onValueChange={onFilterChange} className="w-full sm:w-auto">
                    <TabsList className="h-11">
                        <TabsTrigger value="all" className="h-9">Tất cả</TabsTrigger>
                        <TabsTrigger value="active" className="h-9">Đang học</TabsTrigger>
                        <TabsTrigger value="inactive" className="h-9">Đã nghỉ</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Add Button */}
                <Button
                    size="lg"
                    onClick={onAddStudent}
                    className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/30 h-11"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Thêm học sinh</span>
                    <span className="sm:hidden">Thêm</span>
                </Button>
            </div>
        </motion.div>
    );
}
