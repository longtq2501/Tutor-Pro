// ============================================================================
// 📁 document-preview-modal/components/ModalFooter.tsx
// ============================================================================

interface ModalFooterProps {
  description?: string;
}

export function ModalFooter({ description }: ModalFooterProps) {
  if (!description) return null;

  return (
    <div className="p-3 sm:p-4 border-t border-border dark:border-gray-700 bg-muted/30 dark:bg-gray-800">
      <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 line-clamp-2">
        <span className="font-medium">Mô tả:</span> {description}
      </p>
    </div>
  );
}