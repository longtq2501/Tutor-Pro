'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Download, Loader2, Mail } from 'lucide-react';
import { useFinanceContext } from '../context/FinanceContext';

interface BulkActionsToolbarProps {
    actions: {
        markSelectedPaid: () => void;
        generateBulkInvoice: () => void;
        sendBulkEmail: () => void;
        generatingInvoice: boolean;
        sendingEmail: boolean;
    }
}

export function BulkActionsToolbar({ actions }: BulkActionsToolbarProps) {
    const { selectedStudentIds, clearSelection } = useFinanceContext();
    const {
        markSelectedPaid,
        generateBulkInvoice,
        sendBulkEmail,
        generatingInvoice,
        sendingEmail
    } = actions;

    if (selectedStudentIds.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 hidden md:block"
            >
                <div className="bg-foreground text-background p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-6 border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-4 pl-2">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black">
                            {selectedStudentIds.length}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">Học sinh đã chọn</span>
                            <button
                                onClick={clearSelection}
                                className="text-xs text-muted-foreground hover:text-white underline text-left"
                            >
                                Bỏ chọn
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            className="rounded-xl font-bold"
                            onClick={generateBulkInvoice}
                            disabled={generatingInvoice}
                        >
                            {generatingInvoice ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                            Xuất Báo Giá
                        </Button>

                        <Button
                            variant="secondary"
                            className="rounded-xl font-bold"
                            onClick={sendBulkEmail}
                            disabled={sendingEmail}
                        >
                            {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                            Gửi Email
                        </Button>

                        <Button
                            onClick={markSelectedPaid}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-600/20"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Đã Thanh Toán
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
