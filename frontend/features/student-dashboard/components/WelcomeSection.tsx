// ============================================================================
// FILE: student-dashboard/components/WelcomeSection.tsx
// ============================================================================
export const WelcomeSection = ({ userName }: { userName: string }) => (
  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-border">
    <h1 className="text-3xl font-bold text-foreground mb-2">
      👋 Xin chào, {userName}!
    </h1>
    <p className="text-muted-foreground">
      Chào mừng bạn trở lại. Đây là tổng quan về quá trình học tập của bạn.
    </p>
  </div>
);