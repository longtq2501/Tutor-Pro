// ============================================================================
// FILE: student-dashboard/components/DocumentsSection.tsx
// ============================================================================
import { FileText } from 'lucide-react';
import type { Document as DocumentType } from '@/lib/types';
import { DocumentCard } from './DocumentCard';

export const DocumentsSection = ({ documents }: { documents: DocumentType[] }) => (
  <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
    <div className="p-6 border-b border-border">
      <h3 className="font-bold text-foreground flex items-center gap-2">
        <FileText className="text-primary" size={18} />
        Tài Liệu Mới Nhất
      </h3>
    </div>
    <div className="p-6">
      {documents.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-4">
          Chưa có tài liệu nào
        </p>
      ) : (
        <div className="space-y-3">
          {documents.slice(0, 5).map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  </div>
);