'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { dashboardApi } from '@/lib/services/dashboard';
import { useHeaderDensity } from '@/components/shared/ResponsiveHeaderActions';
import { cn } from '@/lib/utils';

interface DashboardExportButtonProps {
    currentMonth?: string;
    filename?: string;
}

export function DashboardExportButton({ currentMonth, filename = 'bao-cao-he-thong.pdf' }: DashboardExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const { atLeast } = useHeaderDensity();
    const showLabel = atLeast('comfortable');

    const handleExport = async () => {
        setIsExporting(true);
        toast.info('Đang yêu cầu hệ thống tạo bản báo cáo PDF...');

        try {
            const blob = await dashboardApi.exportPdf(currentMonth);

            // Create a link and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Xuất báo cáo PDF thành công!');
        } catch (error: unknown) {
            console.error('Export error:', error);
            const message = error instanceof Error ? error.message : 'Lỗi không xác định';
            toast.error(`Lỗi xuất PDF từ hệ thống: ${message}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="outline"
            size="sm"
            title="Xuất báo cáo PDF"
            aria-label="Xuất báo cáo PDF"
            className={cn(
                "h-8 shrink-0 rounded-xl border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 text-primary transition-all duration-300 whitespace-nowrap font-semibold text-[13px]",
                showLabel ? "px-3 gap-1.5" : "w-8 p-0 justify-center"
            )}
        >
            {isExporting ? (
                <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
            ) : (
                <FileDown className="w-4 h-4 shrink-0" />
            )}
            {showLabel && <span>Xuất Báo Cáo</span>}
        </Button>
    );
}
