'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface RevenueData {
    month: string;
    value: number;
}

interface RevenueChartProps {
    data: RevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    const [view, setView] = useState<'6m' | '1y'>('6m');

    const filteredData = useMemo(() => {
        return view === '6m' ? data.slice(-6) : data;
    }, [data, view]);

    const maxValue = useMemo(() => {
        return Math.max(...filteredData.map(d => d.value), 1);
    }, [filteredData]);

    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });

    return (
        <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-[var(--admin-text)]">Doanh Thu Hệ Thống</h3>
                    <p className="text-xs text-[var(--admin-text3)] uppercase tracking-widest font-medium">Báo cáo doanh số tháng</p>
                </div>

                <div className="flex bg-[var(--admin-surface2)] p-1 rounded-lg border border-[var(--admin-border)]">
                    <button
                        onClick={() => setView('6m')}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${view === '6m'
                                ? 'bg-[var(--admin-surface3)] text-[var(--admin-accent)] shadow-sm'
                                : 'text-[var(--admin-text3)] hover:text-[var(--admin-text2)]'
                            }`}
                    >
                        6 THÁNG
                    </button>
                    <button
                        onClick={() => setView('1y')}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${view === '1y'
                                ? 'bg-[var(--admin-surface3)] text-[var(--admin-accent)] shadow-sm'
                                : 'text-[var(--admin-text3)] hover:text-[var(--admin-text2)]'
                            }`}
                    >
                        1 NĂM
                    </button>
                </div>
            </div>

            <div className="h-[200px] flex items-end justify-between gap-2 pt-4">
                {filteredData.map((item, idx) => {
                    const height = (item.value / maxValue) * 100;
                    const isCurrentMonth = item.month === currentMonth;

                    return (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
                            <div className="relative w-full flex justify-center h-full items-end">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                                    className={`w-full max-w-[32px] rounded-t-lg transition-all duration-300 relative ${isCurrentMonth
                                            ? 'bg-[var(--admin-accent)] shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                            : 'bg-[var(--admin-surface2)] group-hover:bg-[var(--admin-surface3)]'
                                        }`}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--admin-surface3)] text-[var(--admin-text)] text-[10px] font-bold px-2 py-1 rounded border border-[var(--admin-border2)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                        {item.value.toLocaleString()}₫
                                    </div>
                                </motion.div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${isCurrentMonth ? 'text-[var(--admin-accent)]' : 'text-[var(--admin-text3)]'
                                }`}>
                                {item.month}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
