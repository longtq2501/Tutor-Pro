// ============================================================================
// 📁 document-preview-modal/components/PDFPreview.tsx
// ============================================================================

interface PDFPreviewProps {
  url: string;
  title: string;
}

export function PDFPreview({ url, title }: PDFPreviewProps) {
  return (
    <iframe
      src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
      className="w-full h-full border-0"
      title={title}
    />
  );
}