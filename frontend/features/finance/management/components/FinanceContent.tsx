'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { useFinanceContext } from '../context/FinanceContext';
import { useFinanceData } from '../hooks/useFinanceData';
import { PremiumLoadingSkeleton } from './PremiumLoadingSkeleton';
import { StudentFinanceCard } from './StudentFinanceCard';

export function FinanceContent() {
    const { groupedRecords, loading, deleteRecord, togglePayment, hasMore, totalCount } = useFinanceData();
    const { viewMode, loadMore } = useFinanceContext();

    if (loading) {
        return <div className="mt-8"><PremiumLoadingSkeleton /></div>;
    }

    if (groupedRecords.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 border-2 border-dashed rounded-3xl mt-8 bg-muted/10">
                <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                    <Inbox className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">Chưa có dữ liệu</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                    {viewMode === 'MONTHLY'
                        ? 'Không có buổi học nào trong tháng này. Hãy thêm buổi học mới từ lịch.'
                        : 'Tuyệt vời! Không có khoản công nợ nào cần xử lý.'}
                </p>
            </div>
        );
    }

    // Masonry Layout Logic: Distribute items into columns based on index
    // We render 3 columns for Desktop (XL), 2 for Tablet (MD), 1 for Mobile
    // Since we can't easily detect screen size in SSR/hydration safe way without hooks, 
    // we might stick to a CSS solution or use a resize listener.
    // CSS `columns` property is the most lightweight 'masonry' simulation.
    // It orders items Top -> Bottom per column.

    return (
        <>
            <motion.div
                layout
                className="mt-8 flex flex-col gap-4 w-full mx-auto"
            >
                <AnimatePresence mode="popLayout">
                    {groupedRecords.map((group) => (
                        <StudentFinanceCard
                            key={group.studentId}
                            group={group}
                            onDeleteSession={deleteRecord}
                            onTogglePayment={togglePayment}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Load More Button for DEBT view */}
            {hasMore && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mt-8"
                >
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={loadMore}
                        className="min-w-[240px] font-semibold"
                    >
                        Xem thêm ({groupedRecords.length} / {totalCount})
                    </Button>
                </motion.div>
            )}
        </>
    );
}
