'use client';

import { LucideIcon } from 'lucide-react';
import React from 'react';

interface AdminPageHeaderProps {
    title: string;
    subtitle: string;
    category?: string;
    icon?: LucideIcon;
    actions?: React.ReactNode;
}

export function AdminPageHeader({
    title,
    subtitle,
    category,
    icon: Icon,
    actions
}: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                {category && (
                    <div className="flex items-center gap-2 text-[var(--admin-accent)] text-xs font-bold uppercase tracking-[0.2em]">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{category}</span>
                    </div>
                )}
                <h1 className="text-4xl font-black text-[var(--admin-text)] tracking-tight">{title}</h1>
                <p className="text-[var(--admin-text3)] text-sm font-medium">{subtitle}</p>
            </div>

            {actions && (
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
}
