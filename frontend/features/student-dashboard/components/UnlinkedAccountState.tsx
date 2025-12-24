// ============================================================================
// FILE: student-dashboard/components/UnlinkedAccountState.tsx
// ============================================================================
import { AlertCircle } from 'lucide-react';

export const UnlinkedAccountState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
    <h2 className="text-xl font-bold text-foreground mb-2">
      Tài khoản chưa được liên kết
    </h2>
    <p className="text-muted-foreground text-center max-w-md">
      Tài khoản của bạn chưa được liên kết với hồ sơ học sinh. 
      Vui lòng liên hệ giáo viên để được hỗ trợ.
    </p>
  </div>
);