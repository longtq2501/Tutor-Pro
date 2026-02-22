'use client';

import {
    Search,
    Bell,
    ChevronRight,
    User
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const routeMap: Record<string, string> = {
    '/overview': 'Overview',
    '/tutors': 'Gia Sư',
    '/students': 'Học Sinh',
    '/sessions': 'Lịch Dạy',
    '/documents': 'Tài Liệu',
    '/system': 'Hệ Thống',
    '/permissions': 'Phân Quyền',
    '/audit': 'Audit Logs',
    '/settings': 'Cài Đặt',
};

export function AdminTopNav() {
    const pathname = usePathname();
    const { user } = useAuth();

    const currentPage = routeMap[pathname] || 'Dashboard';

    return (
        <header className="fixed top-0 left-16 right-0 h-[52px] admin-glass z-40 px-6 flex items-center justify-between">
            {/* Left: Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-medium">
                <span className="text-[var(--admin-text3)] uppercase tracking-wider">Admin</span>
                <ChevronRight className="h-3 w-3 text-[var(--admin-text3)]" />
                <span className="text-[var(--admin-text)]">{currentPage}</span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                {/* Search Bar - UI Only */}
                <div className="relative group hidden md:block">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-3.5 w-3.5 text-[var(--admin-text3)] group-focus-within:text-[var(--admin-accent)] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhanh..."
                        className="w-64 h-8 bg-[var(--admin-surface2)] border border-[var(--admin-border)] rounded-lg pl-9 pr-12 text-xs text-[var(--admin-text)] focus:outline-none focus:border-[var(--admin-accent)] focus:ring-1 focus:ring-[var(--admin-accent-dim)] transition-all"
                        readOnly
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <kbd className="h-5 px-1.5 bg-[var(--admin-surface3)] border border-[var(--admin-border2)] rounded text-[10px] text-[var(--admin-text3)] font-sans">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Notifications */}
                <button className="relative p-1.5 text-[var(--admin-text3)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface2)] rounded-lg transition-all">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--admin-accent)] rounded-full border-2 border-[var(--admin-surface)]" />
                </button>

                {/* Avatar */}
                <button className="flex items-center gap-2 pl-2 border-l border-[var(--admin-border)]">
                    <div className="w-8 h-8 rounded-lg bg-[var(--admin-accent-dim)] border border-[var(--admin-accent)]/30 flex items-center justify-center text-[var(--admin-accent)] text-xs font-bold">
                        {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || <User className="h-4 w-4" />}
                    </div>
                </button>
            </div>
        </header>
    );
}
