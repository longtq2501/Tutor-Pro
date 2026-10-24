'use client';

import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeaderActionsRow, useHeaderDensity } from '@/components/shared/ResponsiveHeaderActions';
import { cn } from '@/lib/utils';

interface DocumentLibraryActionsProps {
    /** Omitted when the action is not available (e.g. inside a category view). */
    onAddCategory?: () => void;
    onUpload: () => void;
    /** Hides the "Thêm danh mục" button (category detail view already has one upload action). */
    showAddCategory?: boolean;
    className?: string;
}

/**
 * Header actions for the document library.
 * Labels collapse to icon-only controls below 640px of content width so the
 * buttons never wrap or get clipped inside the 56px header.
 */
export function DocumentLibraryActions({
    onAddCategory,
    onUpload,
    showAddCategory = true,
    className,
}: DocumentLibraryActionsProps) {
    const { atLeast } = useHeaderDensity();
    const showLabels = atLeast('comfortable');

    return (
        <HeaderActionsRow className={className}>
            {showAddCategory && onAddCategory && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-tour="documents-add-category"
                    onClick={onAddCategory}
                    title="Thêm danh mục"
                    aria-label="Thêm danh mục"
                    className={cn(
                        'h-8 shrink-0 rounded-xl border-border/40 bg-card/50 hover:bg-muted/50 font-semibold text-[13px] whitespace-nowrap',
                        showLabels ? 'px-2.5 gap-1.5' : 'w-8 p-0 justify-center'
                    )}
                >
                    <Plus className="h-4 w-4 shrink-0" />
                    {showLabels && <span>Thêm danh mục</span>}
                </Button>
            )}

            <Button
                type="button"
                size="sm"
                data-tour="documents-upload"
                onClick={onUpload}
                title="Tải lên"
                aria-label="Tải lên"
                className={cn(
                    'h-8 shrink-0 rounded-xl bg-primary text-primary-foreground font-semibold text-[13px] shadow-sm hover:bg-primary/90 whitespace-nowrap',
                    showLabels ? 'px-3 gap-1.5' : 'w-8 p-0 justify-center'
                )}
            >
                <Upload className="h-4 w-4 shrink-0" />
                {showLabels && <span>Tải lên</span>}
            </Button>
        </HeaderActionsRow>
    );
}
