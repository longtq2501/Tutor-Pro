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
    setConfirmDeleteOpen
}: ModalFooterProps) {
    return (
        <div className="p-4 bg-muted/10 border-t border-border/60 shrink-0">
            <div className="flex gap-2">
                {mode === 'view' ? (
                    <>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setConfirmDeleteOpen(true)}
                            className="h-10 w-10 p-0 rounded-xl text-red-500 hover:bg-red-500/10 shrink-0"
                        >
                            <Trash2 size={16} />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDuplicate}
                            disabled={loading}
                            className="h-10 flex-1 rounded-xl font-black text-[11px] sm:text-[10px] px-2"
                        >
                            <Copy className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                            <span className="truncate">Nhân bản</span>
                        </Button>
                        <Button
                            onClick={() => setMode('edit')}
                            className="h-10 flex-1 rounded-xl bg-primary shadow-lg shadow-primary/20 font-black text-[11px] sm:text-[10px] px-2"
                        >
                            <Pencil className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                            <span className="truncate">Sửa</span>
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setMode('view')}
                            className="h-10 flex-1 rounded-xl font-black text-[11px] sm:text-[10px]"
                        >
                            Hủy
                        </Button>
                        <Button
                            form="premium-edit-form"
                            type="submit"
                            disabled={loading || !isDirty}
                            className="h-10 flex-[2] rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 font-black text-[11px] sm:text-[10px]"
                        >
                            {loading ? <Loader2 className="w-3.5 h-3.5 mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                            LƯU {globalSelectedCount > 0 && `(${globalSelectedCount})`}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
