import { Button } from '@/components/ui/button';
import { Copy, Pencil, Save, Trash2 } from 'lucide-react';
import { Loader2 } from './Loader2';

interface ModalFooterProps {
    mode: 'view' | 'edit';
    setMode: (mode: 'view' | 'edit') => void;
    loading: boolean;
    isDirty: boolean;
    globalSelectedCount: number;
    handleDuplicate: () => void;
    setConfirmDeleteOpen: (open: boolean) => void;
}

export function ModalFooter({
    mode,
    setMode,
    loading,
    isDirty,
    globalSelectedCount,
    handleDuplicate,
    setConfirmDeleteOpen,
}: ModalFooterProps) {
    return (
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-muted/10 border-t border-border/60 shrink-0">
            <div className="flex items-center gap-2">
                {mode === 'view' ? (
                    <>
                        {/* Destructive action - isolated left */}
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setConfirmDeleteOpen(true)}
                            className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-600 shrink-0"
                        >
                            <Trash2 size={15} />
                        </Button>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Secondary action */}
                        <Button
                            variant="outline"
                            onClick={handleDuplicate}
                            disabled={loading}
                            className="h-9 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm gap-1.5 active:scale-95 transition-transform"
                        >
                            <Copy size={14} className="shrink-0" />
                            <span>Nhân bản</span>
                        </Button>

                        {/* Primary action */}
                        <Button
                            onClick={() => setMode('edit')}
                            className="h-9 px-3 sm:px-4 rounded-xl bg-primary hover:bg-primary/90 font-semibold text-xs sm:text-sm gap-1.5"
                        >
                            <Pencil size={14} className="shrink-0" />
                            <span>Chỉnh sửa</span>
                        </Button>
                    </>
                ) : (
                    <>
                        {/* Cancel */}
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setMode('view')}
                            className="h-9 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm"
                        >
                            Hủy bỏ
                        </Button>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Save — shows count if library items selected */}
                        <Button
                            form="premium-edit-form"
                            type="submit"
                            disabled={loading}
                            className="h-9 px-4 sm:px-5 rounded-xl bg-primary hover:bg-primary/90 font-semibold text-xs sm:text-sm gap-1.5 min-w-[90px]"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save size={14} className="shrink-0" />
                            )}
                            {globalSelectedCount > 0
                                ? `Lưu (${globalSelectedCount})`
                                : isDirty ? 'Lưu thay đổi' : 'Lưu'}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
