'use client';

import { cn } from '@/lib/utils';

interface TutorProLogoProps {
    collapsed?: boolean;
    className?: string;
    iconClassName?: string;
}

export function TutorProLogo({ collapsed = false, className, iconClassName }: TutorProLogoProps) {
    return (
        <div className={cn('tutor-pro-logo flex min-w-0 items-center', collapsed ? 'justify-center' : 'gap-[0.4em]', className)}>
            <svg
                className={cn('shrink-0', iconClassName)}
                width="40"
                height="40"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Tutor Pro"
            >
                <rect className="logo-stem" x="28" y="28" width="8" height="30" rx="3" fill="var(--logo-stem, #10151c)" />
                <path className="logo-left-page" d="M32 20C26 15 17 13 6 13V31C16 31 25 33 32 38Z" fill="var(--logo-left-page, #0f4c5c)" />
                <path className="logo-right-page" d="M32 20C38 15 47 13 58 13V31C48 31 39 33 32 38Z" fill="var(--logo-right-page, #f2a541)" />
            </svg>
            {!collapsed && (
                <span className="truncate whitespace-nowrap font-semibold tracking-[-0.02em]">
                    Tutor Pro
                </span>
            )}
        </div>
    );
}
