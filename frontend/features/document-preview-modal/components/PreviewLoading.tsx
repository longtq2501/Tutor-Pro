// ============================================================================
// 📁 document-preview-modal/components/PreviewLoading.tsx
// ============================================================================

import { Loader2 } from 'lucide-react';

export function PreviewLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
        <p className="text-muted-foreground dark:text-gray-400">Đang tải xem trước...</p>
      </div>
    </div>
  );
}