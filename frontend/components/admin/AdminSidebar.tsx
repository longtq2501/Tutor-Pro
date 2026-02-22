'use client';

import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Calendar,
    FileText,
    Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
    { icon: LayoutDashboard, href: '/overview', label: 'Overview' },
    { icon: Users, href: '/tutors', label: 'Tutors' },
    { icon: GraduationCap, href: '/students', label: 'Students' },
    { icon: Calendar, href: '/sessions', label: 'Sessions' },
    { icon: FileText, href: '/documents', label: 'Documents' },
    { icon: Settings, href: '/system', label: 'System' },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-16 h-screen border-r border-slate-800 bg-slate-950 flex flex-col items-center py-4 gap-4 shrink-0">
            <div className="mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white">A</div>
            </div>
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`p-2 rounded-lg transition-colors ${isActive
                                ? 'bg-primary/20 text-primary'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                        title={item.label}
                    >
                        <item.icon className="h-6 w-6" />
                    </Link>
                );
            })}
        </div>
    );
}
