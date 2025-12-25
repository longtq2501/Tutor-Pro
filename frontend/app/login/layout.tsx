import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Đăng nhập - Tutor Pro',
    description: 'Đăng nhập vào hệ thống quản lý gia sư Tutor Pro',
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
