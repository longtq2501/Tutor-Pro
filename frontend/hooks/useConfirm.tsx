"use client"

import { useState, useCallback } from 'react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface ConfirmOptions {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
}

export function useConfirm() {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({
        title: '',
        description: '',
    });
    const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((options: ConfirmOptions) => {
        setOptions(options);
        setOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolveRef(() => resolve);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (resolveRef) {
            resolveRef(true);
            setResolveRef(null);
        }
        setOpen(false);
    }, [resolveRef]);

    const handleCancel = useCallback((open: boolean) => {
        if (!open) {
            if (resolveRef) {
                resolveRef(false);
                setResolveRef(null);
            }
            setOpen(false);
        }
    }, [resolveRef]);

    const ConfirmationDialog = () => (
        <ConfirmDialog
            open={open}
            onOpenChange={handleCancel}
            onConfirm={handleConfirm}
            title={options.title}
            description={options.description}
            confirmText={options.confirmText}
            cancelText={options.cancelText}
            variant={options.variant}
        />
    );

    return { confirm, ConfirmationDialog };
}
