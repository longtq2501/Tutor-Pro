'use client';

import { motion } from 'framer-motion';
import { FinanceProvider } from '../context/FinanceContext';
import { useFinanceActions } from '../hooks/useFinanceActions';
import { BulkActionsToolbar } from './BulkActionsToolbar';
import { EmailResultModal } from './EmailResultModal';
import { FinanceContent } from './FinanceContent';
import { FinanceHeader } from './FinanceHeader';
import { FinanceStats } from './FinanceStats';
import { MobileActionDrawer } from './MobileActionDrawer';

function DashboardInner() {
    const { showEmailResult, emailResult, closeEmailResult, ...actions } = useFinanceActions();

    return (
        <div className="">
            <FinanceHeader />

            <div className="container mx-auto p-4 md:p-8 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <FinanceStats />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <FinanceContent />
                </motion.div>
            </div>

            <BulkActionsToolbar actions={actions} />
            <MobileActionDrawer actions={actions} />

            <EmailResultModal
                show={showEmailResult}
                result={emailResult}
                onClose={closeEmailResult}
            />
        </div>
    );
}

export default function FinanceDashboard() {
    return (
        <FinanceProvider>
            <DashboardInner />
        </FinanceProvider>
    );
}
