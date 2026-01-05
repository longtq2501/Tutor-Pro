
// ============================================================================
// FILE: VisualDocumentCard.tsx
// ============================================================================
import React, { memo } from 'react';
import { FileText, GripVertical } from 'lucide-react';
import { useLazyImage } from '@/lib/hooks/useLazyImage';
import type { Document } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VisualDocumentCardProps {
    document: Document;
    isDragging?: boolean;
}

const VisualDocumentCard = ({ document }: VisualDocumentCardProps) => {
    // Use lazy image for preview thumbnail if available (assuming filePath is accessible or we have a thumb)
    // For PDFs, we might not have a direct image, so we show a beautiful placeholder.
    // If you store thumbnails, replace 'document.filePath' with 'document.thumbnailUrl'
    const { imageSrc, observerRef } = useLazyImage(document.filePath);

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('application/json', JSON.stringify(document));
        e.dataTransfer.effectAllowed = 'copy';

        // Create a ghost drag image if needed, or browser default
    };

    return (
        <div
            ref={observerRef}
            draggable
            onDragStart={handleDragStart}
            className={cn(
                "group relative flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing",
                "hover:border-primary/50 hover:bg-muted/30"
            )}
        >
            {/* Drag Handle */}
            <div className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors">
                <GripVertical size={16} />
            </div>

            {/* Icon / Preview */}
            <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FileText size={20} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate pr-2">
                    {document.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate max-w-[100px]">{document.categoryDisplayName}</span>
                    <span>•</span>
                    <span>{document.formattedFileSize}</span>
                </div>
            </div>
        </div>
    );
};

// Custom equality comparison for React.memo
const arePropsEqual = (prev: VisualDocumentCardProps, next: VisualDocumentCardProps) => {
    return prev.document.id === next.document.id &&
        prev.document.updatedAt === next.document.updatedAt &&
        prev.isDragging === next.isDragging;
};

export default memo(VisualDocumentCard, arePropsEqual);
