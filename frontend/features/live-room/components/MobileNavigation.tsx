'use client';

import React from 'react';
import { Layout, Video, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RoomTab = 'board' | 'video' | 'chat';

interface MobileNavigationProps {
    activeTab: RoomTab;
    onTabChange: (tab: RoomTab) => void;
    className?: string;
}

/**
 * Bottom navigation bar for mobile screens.
 * Allows switching between Board, Video, and Chat tabs.
 */
export const MobileNavigation: React.FC<MobileNavigationProps> = ({
    activeTab,
    onTabChange,
    className
}) => {
    const tabs = [
        { id: 'board' as const, label: 'Bảng', icon: Layout },
        { id: 'video' as const, label: 'Video', icon: Video },
        { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
    ];

    const handleTabClick = (id: RoomTab) => {
        // Haptic feedback on mobile if supported
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
                navigator.vibrate(10);
            } catch (e) {
                // Ignore vibration errors
            }
        }
        onTabChange(id);
    };

    return (
        <nav className={cn(
            "flex items-center justify-around bg-card border-t border-border md:hidden shrink-0",
            "h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)]", // Proper safe area handling
            className
        )}>
            {tabs.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => handleTabClick(id)}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 w-full h-16 text-xs transition-colors",
                        activeTab === id
                            ? "text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label={label}
                >
                    <Icon className={cn("h-5 w-5", activeTab === id && "animate-in zoom-in-75 duration-300")} />
                    <span>{label}</span>
                </button>
            ))}
        </nav>
    );
};
