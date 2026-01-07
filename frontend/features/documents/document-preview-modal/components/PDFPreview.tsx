'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface PDFPreviewProps {
  url: string;
  title: string;
}

export function PDFPreview({ url, title }: PDFPreviewProps) {
  const [loading, setLoading] = useState(true);

  // Fit width to viewport, no zoom controls needed
  const pdfUrl = `${url}#view=FitH&zoom=page-width&toolbar=0&navpanes=0&scrollbar=1`;

  return (
    <div className="w-full h-full relative bg-gray-100 dark:bg-gray-900 leading-[0]">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-10 bg-background/80 backdrop-blur-sm">
          <Loader2 size={32} className="animate-spin mb-2" />
          <p className="text-sm font-medium">Đang tải tài liệu...</p>
        </div>
      )}
      <iframe
        src={pdfUrl}
        className={`w-full h-full border-0 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'
          }`}
        title={`PDF preview: ${title}`}
        onLoad={() => setLoading(false)}
        loading="lazy"
      />
    </div>
  );
}