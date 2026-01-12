"use client";

import { Button } from "@/components/ui/button";
import { Copy, FileSpreadsheet, Pencil, X } from "lucide-react";

interface FeedbackHeaderProps {
    isEditing: boolean;
    hasData: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onCopy: () => void;
    onExport: () => void;
}

export function FeedbackHeader({
    isEditing,
    hasData,
    onEdit,
    onCancel,
    onCopy,
    onExport,
}: FeedbackHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 sm:px-6 gap-3 border-b border-border/40 shrink-0 bg-background/95 backdrop-blur z-20">
            <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent whitespace-nowrap">
                    {isEditing ? "Đang chỉnh sửa" : "Phiếu đánh giá"}
                </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {!isEditing ? (
                    <>
                        {hasData && (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Button variant="outline" size="sm" onClick={onExport} className="h-8 px-2.5 sm:px-3 text-[10px] uppercase font-bold tracking-wider">
                                    <FileSpreadsheet className="w-3.5 h-3.5 sm:mr-1.5" />
                                    <span className="hidden sm:inline">XLS</span>
                                </Button>
                                <Button variant="secondary" size="sm" onClick={onCopy} className="h-8 px-2.5 sm:px-3 text-[10px] uppercase font-bold tracking-wider">
                                    <Copy className="w-3.5 h-3.5 sm:mr-1.5" />
                                    <span className="hidden sm:inline">Copy</span>
                                </Button>
                            </div>
                        )}
                        <Button
                            onClick={onEdit}
                            size="sm"
                            className="h-8 px-3 sm:px-4 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] uppercase font-black tracking-wider shadow-none border-0 flex-1 sm:flex-none"
                        >
                            <Pencil className="w-3.5 h-3.5 mr-1.5" />
                            {hasData ? "Chỉnh sửa" : "Viết đánh giá"}
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        className="h-8 px-3 text-[10px] uppercase font-bold tracking-wider text-muted-foreground ml-auto"
                    >
                        <X className="w-3.5 h-3.5 mr-1.5" /> Hủy
                    </Button>
                )}
            </div>
        </div>
    );
}
