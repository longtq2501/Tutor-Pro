"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, FileSpreadsheet, Pencil, Check } from "lucide-react";

interface FeedbackHeaderProps {
    isEditing: boolean;
    hasData: boolean;
    isDirty?: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onCopy: () => void;
    onExport: () => void;
}

export function FeedbackHeader({
    isEditing,
    hasData,
    isDirty = false,
    onEdit,
    onCancel,
    onCopy,
    onExport,
}: FeedbackHeaderProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        onCopy();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between py-2.5 px-4 sm:px-6 gap-3 border-b border-border/40 shrink-0 bg-background/95 backdrop-blur z-20">
            {/* Title & Status */}
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground whitespace-nowrap">
                    Phiếu đánh giá
                </h3>
                {isEditing && isDirty && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-in fade-in">
                        Chưa lưu
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {!isEditing ? (
                    <>
                        {hasData && (
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onExport}
                                    className="h-8 px-2.5 text-xs font-medium"
                                >
                                    <FileSpreadsheet className="w-3.5 h-3.5 sm:mr-1.5" />
                                    <span className="hidden sm:inline">Excel</span>
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="h-8 px-2.5 text-xs font-medium transition-all active:scale-95"
                                >
                                    {isCopied ? (
                                        <Check className="w-3.5 h-3.5 sm:mr-1.5 text-emerald-500" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5 sm:mr-1.5" />
                                    )}
                                    <span className="hidden sm:inline">{isCopied ? "Đã chép" : "Sao chép"}</span>
                                </Button>
                            </div>
                        )}
                        <Button
                            onClick={onEdit}
                            size="sm"
                            className="h-8 px-3 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border-0 shadow-none"
                        >
                            <Pencil className="w-3.5 h-3.5 mr-1.5" />
                            {hasData ? "Chỉnh sửa" : "Viết đánh giá"}
                        </Button>
                    </>
                ) : (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        className="h-8 px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                        Hủy
                    </Button>
                )}
            </div>
        </div>
    );
}
