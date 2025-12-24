// ============================================================================
// FILE: admin-dashboard/components/LoadingState.tsx
// ============================================================================
export const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mb-4"></div>
    <p className="text-muted-foreground font-medium">Đang tải dữ liệu...</p>
  </div>
);