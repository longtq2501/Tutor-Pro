'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function QueryProvider({ children }: { children: ReactNode }) {
  // Khởi tạo QueryClient trong useState để đảm bảo tính ổn định trên Next.js
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Dữ liệu được coi là mới trong 1 phút
        retry: 1, // Thử lại 1 lần nếu lỗi mạng
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}