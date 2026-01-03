// ============================================================================
// 📁 document-preview-modal/components/PDFPreview.tsx
// ============================================================================

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface PDFPreviewProps {
  url: string;
  title: string;
}

export function PDFPreview({ url, title }: PDFPreviewProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-full relative bg-gray-100 dark:bg-gray-900">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <Loader2 size={32} className="animate-spin mb-2" />
          <p className="text-sm">Đang tải tài liệu...</p>
        </div>
      )}
      <iframe
        src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
        className={`w-full h-full border-0 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        title={title}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}