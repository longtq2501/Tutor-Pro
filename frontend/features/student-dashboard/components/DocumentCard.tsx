// ============================================================================
// FILE: student-dashboard/components/DocumentCard.tsx
// ============================================================================
import { FileText } from 'lucide-react';
import type { Document as DocumentType } from '@/lib/types';

export const DocumentCard = ({ doc }: { doc: DocumentType }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
      <FileText className="text-primary" size={16} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm text-foreground truncate">
        {doc.title}
      </p>
      <p className="text-xs text-muted-foreground">
        {doc.categoryDisplayName} • {doc.formattedFileSize}
      </p>
    </div>
  </div>
);