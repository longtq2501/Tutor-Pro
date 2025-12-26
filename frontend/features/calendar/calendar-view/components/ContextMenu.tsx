import type { SessionRecord } from '@/lib/types/finance';
import { Edit, Copy, Trash2, Check, DollarSign, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { sessionsApi } from '@/lib/services';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface ContextMenuProps {
    session: SessionRecord;
    position: { x: number; y: number };
    onClose: () => void;
    onEdit?: (session: SessionRecord) => void;
    onUpdate?: (updated: SessionRecord) => void;
    onDelete?: (id: number) => void;
}

/**
 * ContextMenu Component
 * 
 * Right-click context menu for session actions:
 * - Edit
 * - Copy
 * - Duplicate
 * - Delete
 * - Status changes (Mark taught, Confirm payment, Cancel)
 */
export function ContextMenu({ session, position, onClose, onEdit, onUpdate, onDelete }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Close on ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleAction = async (action: () => Promise<void>) => {
        setLoading(true);
        try {
            await action();
            onClose();
        } catch (error) {
            console.error('Action failed:', error);
            toast.error(error instanceof Error ? error.message : 'Thao tác thất bại');
        } finally {
            setLoading(false);
        }
    };

    const currentStatus = session.status || 'SCHEDULED';

    return (
        <div
            ref={menuRef}
            style={{ top: position.y, left: position.x }}
            className="fixed z-50 bg-card border border-border rounded-md shadow-lg py-1 min-w-[180px]"
        >
            {/* Edit */}
            <button
                onClick={() => {
                    onEdit?.(session);
                    onClose();
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
            >
                <Edit size={14} />
                Chỉnh sửa
            </button>

            {/* Duplicate */}
            <button
                onClick={() => handleAction(async () => {
                    const duplicated = await sessionsApi.duplicate(session.id);
                    onUpdate?.(duplicated);
                })}
                disabled={loading}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 disabled:opacity-50"
            >
                <Copy size={14} />
                Nhân bản
            </button>

            <div className="border-t border-border my-1" />

            {/* Mark as Taught */}
            {(currentStatus === 'SCHEDULED' || currentStatus === 'CONFIRMED') && (
                <button
                    onClick={() => handleAction(async () => {
                        if (session.version === undefined || session.version === null) return;
                        const updated = await sessionsApi.updateStatus(session.id, 'COMPLETED', session.version);
                        onUpdate?.(updated);
                    })}
                    disabled={loading}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-green-600 dark:text-green-400 disabled:opacity-50"
                >
                    <Check size={14} />
                    Đánh dấu đã dạy
                </button>
            )}

            {/* Confirm Payment */}
            {(currentStatus === 'COMPLETED' || currentStatus === 'PENDING_PAYMENT') && (
                <button
                    onClick={() => handleAction(async () => {
                        if (session.version === undefined || session.version === null) return;
                        const updated = await sessionsApi.updateStatus(session.id, 'PAID', session.version);
                        onUpdate?.(updated);
                    })}
                    disabled={loading}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-emerald-600 dark:text-emerald-400 disabled:opacity-50"
                >
                    <DollarSign size={14} />
                    Xác nhận thanh toán
                </button>
            )}

            {/* Cancel/Restore */}
            <div className="border-t border-border my-1" />
            {currentStatus !== 'CANCELLED_BY_TUTOR' && currentStatus !== 'CANCELLED_BY_STUDENT' ? (
                <button
                    onClick={() => {
                        setConfirmCancelOpen(true);
                    }}
                    disabled={loading}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-orange-600 dark:text-orange-400 disabled:opacity-50"
                >
                    <X size={14} />
                    Hủy buổi học
                </button>
            ) : (
                <button
                    onClick={() => handleAction(async () => {
                        if (session.version === undefined || session.version === null) return;
                        const updated = await sessionsApi.updateStatus(session.id, 'SCHEDULED', session.version);
                        onUpdate?.(updated);
                    })}
                    disabled={loading}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-blue-600 dark:text-blue-400 disabled:opacity-50"
                >
                    <Copy size={14} />
                    Khôi phục (Đã hẹn)
                </button>
            )}

            {/* Delete */}
            <div className="border-t border-border my-1" />
            <button
                onClick={() => {
                    setConfirmDeleteOpen(true);
                }}
                disabled={loading}
                className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 text-red-600 dark:text-red-400 disabled:opacity-50 font-medium"
            >
                <Trash2 size={14} />
                Xóa vĩnh viễn (Biến mất)
            </button>

            {/* Confirmation Dialogs */}
            <ConfirmDialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                onConfirm={async () => {
                    onDelete?.(Number(session.id));
                }}
                title="Xác nhận xóa vĩnh viễn?"
                description="Hành động này sẽ xóa buổi học ra khỏi hệ thống và không thể hoàn tác. Bạn có chắc chắn không?"
                confirmText="Xác nhận xóa"
                variant="destructive"
            />

            <ConfirmDialog
                open={confirmCancelOpen}
                onOpenChange={setConfirmCancelOpen}
                onConfirm={async () => {
                    if (session.version === undefined || session.version === null) return;
                    await handleAction(async () => {
                        const updated = await sessionsApi.updateStatus(session.id, 'CANCELLED_BY_TUTOR', session.version as number);
                        onUpdate?.(updated);
                        toast.success('Đã hủy buổi học');
                    });
                }}
                title="Xác nhận hủy buổi học?"
                description="Buổi học sẽ chuyển sang trạng thái 'Tutor hủy'. Bạn có thể khôi phục lại sau."
                confirmText="Xác nhận hủy"
                variant="destructive"
            />
        </div>
    );
}
