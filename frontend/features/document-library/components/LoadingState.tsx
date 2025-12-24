// ============================================================================
// FILE: document-library/components/LoadingState.tsx
// ============================================================================
export const LoadingState = () => (
  <div className="text-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
    <p className="mt-4 text-muted-foreground">Đang tải...</p>
  </div>
);