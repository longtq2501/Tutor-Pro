import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
// 1. Import QueryProvider bạn vừa tạo
import QueryProvider from '@/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tutor Pro - Quản lý gia sư',
  description: 'Hệ thống quản lý gia sư chuyên nghiệp, tối ưu hóa quy trình dạy và học.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://tutor-management-e7zh.vercel.app', // Thay bằng domain thực tế của bạn
    title: 'Tutor Pro - Hệ thống quản lý gia sư',
    description: 'Giải pháp quản lý gia sư, học sinh và học phí hiệu quả.',
    siteName: 'Tutor Pro',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tutor Pro Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tutor Pro - Quản lý gia sư',
    description: 'Hệ thống quản lý gia sư chuyên nghiệp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 2. Bọc QueryProvider ở đây */}
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}