'use client';

import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Calendar,
    FileText,
    Settings,
    Settings2,
    ShieldCheck,
    History,
    Command
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const groups = [
    {
        id: 'p0',
        items: [
            { id: 'overview', icon: LayoutDashboard, href: '/overview', label: 'Overview' },
            { id: 'tutors', icon: Users, href: '/tutors', label: 'Gia Sư', badge: true },
            { id: 'students', icon: GraduationCap, href: '/students', label: 'Học Sinh' },
            { id: 'sessions', icon: Calendar, href: '/sessions', label: 'Lịch Dạy' },
            { id: 'documents', icon: FileText, href: '/documents', label: 'Tài Liệu' },
        ]
    },
    {
        id: 'p1',
        items: [
            { id: 'system', icon: Settings2, href: '/system', label: 'Hệ Thống' },
            { id: 'permissions', icon: ShieldCheck, href: '/permissions', label: 'Phân Quyền' },
            { id: 'audit', icon: History, href: '/audit', label: 'Audit Logs' },
        ]
    }
];

const bottomItems = [
    { id: 'settings', icon: Settings, href: '/settings', label: 'Cài Đặt' }
];

interface SidebarItemProps {
    item: typeof groups[0]['items'][0];
    isActive: boolean;
}

function SidebarItem({ item, isActive }: SidebarItemProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="relative flex items-center justify-center w-full">
            <Link
                href={item.href}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`relative p-2.5 rounded-xl transition-all duration-300 group ${isActive
                        ? 'bg-[var(--admin-accent-dim)] text-[var(--admin-accent)]'
                        : 'text-[var(--admin-text3)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-surface2)]'
                    }`}
            >
                <item.icon className={`h-6 w-6 transition-transform duration-300 ${isHovered && !isActive ? 'scale-110' : ''}`} />

                {item.badge && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--admin-red)] rounded-full border-2 border-[var(--admin-bg)]" />
                )}

                {isActive && (
                    <motion.div
                        layoutId="active-indicator"
                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--admin-accent)] rounded-r-full shadow-[0_0_8px_var(--admin-accent)]"
                    />
                )}
            </Link>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 20, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                        className="absolute left-10 z-50 px-3 py-1.5 bg-[var(--admin-surface3)] text-[var(--admin-text)] text-xs font-medium rounded-lg whitespace-nowrap border border-[var(--admin-border2)] shadow-xl pointer-events-none"
                    >
                        {item.label}
                        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--admin-surface3)] border-l border-b border-[var(--admin-border2)] rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 w-16 h-screen bg-[var(--admin-surface)] border-r border-[var(--admin-border)] flex flex-col items-center py-4 z-50">
            {/* Logo */}
            <div className="mb-8 flex items-center justify-center">
                <div className="w-10 h-10 bg-[var(--admin-accent)] rounded-xl flex items-center justify-center text-[var(--admin-bg)] shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                    <Command className="h-6 w-6" />
                </div>
            </div>

            {/* Main Groups */}
            <div className="flex-1 w-full flex flex-col items-center gap-6 px-2">
                {groups.map((group, idx) => (
                    <div key={group.id} className="w-full flex flex-col items-center gap-2">
                        {group.items.map((item) => (
                            <SidebarItem
                                key={item.id}
                                item={item}
                                isActive={pathname === item.href}
                            />
                        ))}
                        {idx < groups.length - 1 && (
                            <div className="w-8 h-[1px] bg-[var(--admin-border)] my-2" />
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom */}
            <div className="mt-auto w-full flex flex-col items-center gap-4 px-2 pb-2">
                <div className="w-8 h-[1px] bg-[var(--admin-border)] mb-2" />
                {bottomItems.map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        isActive={pathname === item.href}
                    />
                ))}
            </div>
        </aside>
    );
}

