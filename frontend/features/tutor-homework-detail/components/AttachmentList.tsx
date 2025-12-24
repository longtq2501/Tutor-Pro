// ============================================================================
// 📁 tutor-homework-detail/components/AttachmentList.tsx
// ============================================================================
import { FileText, ExternalLink } from 'lucide-react';

interface AttachmentListProps {
  urls: string[];
  title: string;
}

export function AttachmentList({ urls, title }: AttachmentListProps) {
  if (urls.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        {urls.map((url, index) => (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span className="flex-1 text-sm">File {index + 1}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );
}