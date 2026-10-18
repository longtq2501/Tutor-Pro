'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarClock, Loader2, MoreHorizontal, RefreshCcw, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { queryKeys } from '@/lib/hooks/useQueryKeys';
import { cn } from '@/lib/utils';

import { submissionService } from '../../services/submissionService';
import {
    SubmissionTeacherAction,
    SubmissionTeacherActionId,
    SubmissionTeacherActionSubject,
    buildSubmissionTeacherActions,
    toApiLocalDateTime,
} from '../../constants/submissionTeacherActions';

/**
 * FB-04 — tutor exception toolbar.
 *
 * Wires the four backend exception endpoints (`reopen`, `extend`, `exempt`,
 * `regrade`) to the UI. Reachability of every item is decided by
 * {@link buildSubmissionTeacherActions} so the grading page and the submission
 * list always agree on what a tutor may do with an attempt.
 */
export interface SubmissionExceptionActionsProps {
    submissionId: string;
    /** Attempt used to decide which actions are available. */
    submission: SubmissionTeacherActionSubject | null | undefined;
    /** Review mode is read-only: no action is rendered at all. */
    isReviewMode?: boolean;
    /** Called after a successful action so the host screen can refresh its data. */
    onSubmissionUpdated?: () => void | Promise<void>;
    /** Compact layout for table rows. */
    compact?: boolean;
    /** Extra classes for the trigger button. */
    className?: string;
}

const ACTION_ICONS: Record<SubmissionTeacherActionId, React.ReactNode> = {
    reopen: <RotateCcw className="h-4 w-4" />,
    extendDeadline: <CalendarClock className="h-4 w-4" />,
    exempt: <RefreshCcw className="h-4 w-4" />,
    regrade: <RefreshCcw className="h-4 w-4" />,
};

/** Extracts the backend's Vietnamese message so error toasts stay meaningful. */
const resolveErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || fallback;
    }
    return fallback;
};

export const SubmissionExceptionActions: React.FC<SubmissionExceptionActionsProps> = ({
    submissionId,
    submission,
    isReviewMode = false,
    onSubmissionUpdated,
    compact = false,
    className,
}) => {
    const queryClient = useQueryClient();
    const [pendingActionId, setPendingActionId] = useState<SubmissionTeacherActionId | null>(null);
    const [confirmAction, setConfirmAction] = useState<SubmissionTeacherAction | null>(null);
    const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);
    const [newDeadline, setNewDeadline] = useState('');

    const actions = buildSubmissionTeacherActions(submission, { isReviewMode });

    // Nothing to offer (read-only screen, loading, or unknown attempt).
    if (actions.length === 0) {
        return null;
    }

    const enabledActions = actions.filter(action => action.enabled);
    if (enabledActions.length === 0) {
        return null;
    }

    const refreshAfterAction = async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all });
        await onSubmissionUpdated?.();
    };

    const runAction = async (
        actionId: SubmissionTeacherActionId,
        request: () => Promise<unknown>,
        successMessage: string,
        failureMessage: string,
    ) => {
        try {
            setPendingActionId(actionId);
            await request();
            toast.success(successMessage);
            await refreshAfterAction();
        } catch (error) {
            toast.error('Không thực hiện được thao tác', {
                description: resolveErrorMessage(error, failureMessage),
            });
        } finally {
            setPendingActionId(null);
        }
    };

    const handleActionSelect = (action: SubmissionTeacherAction) => {
        if (!action.enabled) return;

        if (action.id === 'extendDeadline') {
            setNewDeadline('');
            setIsExtendDialogOpen(true);
            return;
        }

        setConfirmAction(action);
    };

    const isBusy = pendingActionId !== null;

    const handleConfirmAction = async () => {
        if (!confirmAction) return;
        const action = confirmAction;

        if (action.id === 'reopen') {
            await runAction(
                'reopen',
                () => submissionService.reopen(submissionId),
                'Đã mở lại bài nộp cho học sinh làm tiếp',
                'Không thể mở lại bài nộp.',
            );
        } else if (action.id === 'exempt') {
            await runAction(
                'exempt',
                () => submissionService.exempt(submissionId),
                'Đã miễn chấm bài nộp này',
                'Không thể miễn chấm bài nộp.',
            );
        } else if (action.id === 'regrade') {
            await runAction(
                'regrade',
                () => submissionService.regrade(submissionId),
                'Đã đưa bài nộp về trạng thái chờ chấm lại',
                'Không thể chấm lại bài nộp.',
            );
        }
    };

    const handleExtendDeadline = async () => {
        const isoDeadline = toApiLocalDateTime(newDeadline);
        if (!isoDeadline) {
            toast.error('Vui lòng chọn hạn nộp mới.');
            return;
        }

        await runAction(
            'extendDeadline',
            () => submissionService.extendDeadline(submissionId, { deadline: isoDeadline }),
            'Đã gia hạn thời gian nộp bài cho học sinh',
            'Không thể gia hạn thời gian nộp bài.',
        );
        setIsExtendDialogOpen(false);
        setNewDeadline('');
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size={compact ? 'sm' : 'default'}
                        disabled={isBusy}
                        className={cn(compact && 'h-8 px-2', className)}
                        title="Thao tác xử lý ngoại lệ cho bài nộp này"
                    >
                        {isBusy ? (
                            <Loader2 className={cn('h-4 w-4 animate-spin', !compact && 'mr-2')} />
                        ) : (
                            <MoreHorizontal className={cn('h-4 w-4', !compact && 'mr-2')} />
                        )}
                        {!compact && 'Thao tác khác'}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                    <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                        Xử lý ngoại lệ
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actions.map(action => (
                        <DropdownMenuItem
                            key={action.id}
                            disabled={!action.enabled || isBusy}
                            onSelect={(event) => {
                                event.preventDefault();
                                handleActionSelect(action);
                            }}
                            className={cn(
                                'flex flex-col items-start gap-1 py-2',
                                action.destructive && action.enabled && 'text-destructive focus:text-destructive',
                            )}
                            title={action.enabled ? action.description : action.disabledReason}
                        >
                            <span className="flex w-full items-center gap-2 text-sm font-medium">
                                {ACTION_ICONS[action.id]}
                                {action.label}
                                {!action.enabled && (
                                    <Badge variant="outline" className="ml-auto h-4 px-1 text-[9px] font-normal">
                                        Không khả dụng
                                    </Badge>
                                )}
                            </span>
                            <span className="pl-6 text-[11px] leading-snug text-muted-foreground">
                                {action.enabled ? action.description : action.disabledReason}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                open={confirmAction !== null}
                onOpenChange={(open) => {
                    if (!open) setConfirmAction(null);
                }}
                onConfirm={handleConfirmAction}
                title={confirmAction?.confirmTitle ?? ''}
                description={confirmAction?.confirmDescription ?? ''}
                confirmText={confirmAction?.confirmText}
                variant={confirmAction?.destructive ? 'destructive' : 'default'}
            />

            <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Gia hạn thời gian nộp</DialogTitle>
                        <DialogDescription>
                            Hạn nộp mới chỉ áp dụng cho học sinh của bài nộp này. Nếu bài đã bị hệ thống tự thu,
                            học sinh sẽ được mở lại để làm tiếp.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="extend-deadline">Hạn nộp mới</Label>
                        <Input
                            id="extend-deadline"
                            type="datetime-local"
                            value={newDeadline}
                            onChange={(event) => setNewDeadline(event.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsExtendDialogOpen(false);
                                setNewDeadline('');
                            }}
                            disabled={isBusy}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleExtendDeadline} disabled={isBusy || !newDeadline}>
                            {isBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Gia hạn
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
