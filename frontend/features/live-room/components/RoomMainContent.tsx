'use client';

import React from 'react';
import { Whiteboard } from './Whiteboard';
import { MediaControls } from './MediaControls';
import { VideoPlayer } from './VideoPlayer';
import { ChatPanel } from './ChatPanel';
import { RoomTab } from './MobileNavigation';
import { cn } from '@/lib/utils';

import { useSwipeable } from 'react-swipeable';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useIsMobile } from '../hooks/useIsMobile';

interface RoomMainContentProps {
    roomId: string;
    currentUserId: number;
    activeTab: RoomTab;
    media: any;
    sendMessage: (destination: string, body: any) => void;
    onTabChange: (tab: RoomTab) => void;
}

/**
 * Main content area for the Live Room.
 * Handles the layout of Whiteboard, Video, and Chat based on the active tab and screen size.
 * Includes swipe gestures for mobile tab switching.
 */
export const RoomMainContent: React.FC<RoomMainContentProps> = ({
    roomId,
    currentUserId,
    activeTab,
    media,
    sendMessage,
    onTabChange
}) => {
    const tabs: RoomTab[] = ['board', 'video', 'chat'];
    const isMobile = useIsMobile();

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex < tabs.length - 1) {
                onTabChange(tabs[currentIndex + 1]);
            }
        },
        onSwipedRight: () => {
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex > 0) {
                onTabChange(tabs[currentIndex - 1]);
            }
        },
        preventScrollOnSwipe: true,
        trackMouse: false,
        delta: 50,
    });

    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const transitionTimerRef = React.useRef<NodeJS.Timeout>(null);

    React.useEffect(() => {
        if (!isMobile) return; // Skip transition on desktop

        if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current);
        }

        setIsTransitioning(true);
        transitionTimerRef.current = setTimeout(() => setIsTransitioning(false), 200);

        return () => {
            if (transitionTimerRef.current) {
                clearTimeout(transitionTimerRef.current);
            }
        };
    }, [activeTab, isMobile]);

    return (
        <main
            {...handlers}
            className="flex-1 relative overflow-hidden bg-muted/30 flex flex-col md:flex-row touch-pan-y"
        >
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center z-50 md:hidden"
                    >
                        <div className="h-1 w-24 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.2 }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Board Section */}
            <div className={cn(
                "flex-1 relative p-2 md:p-4 flex flex-col min-h-0",
                activeTab !== 'board' && "hidden md:flex",
                activeTab === 'board' && "md:border-t-2 md:border-t-primary"
            )}>
                <Whiteboard roomId={roomId} currentUserId={currentUserId} sendMessage={sendMessage} className="shadow-sm border border-border rounded-lg bg-white h-full" />
                <MediaControls
                    {...media}
                    onToggleMic={media.toggleMic}
                    onToggleCamera={media.toggleCamera}
                    onToggleRecording={media.isRecording ? media.stopRecording : media.startRecording}
                    onQualityChange={media.setQuality}
                    isRecordingSupported={media.isSupported}
                    className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 scale-90 md:scale-100 origin-bottom"
                />
            </div>

            {/* Video Side Area */}
            <div className={cn(
                "w-full md:w-64 p-4 flex-col gap-4 bg-background md:bg-card border-l border-border overflow-y-auto",
                activeTab === 'video' ? "flex flex-1" : "hidden md:flex",
                activeTab === 'video' && "md:border-t-2 md:border-t-primary"
            )}>
                <VideoPlayer stream={media.stream} className="aspect-video w-full rounded-md border border-border bg-muted shadow-sm" />
                {media.warning && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs rounded-lg animate-in fade-in slide-in-from-top-2">
                        {media.warning}
                    </div>
                )}
                <div className="hidden md:block mt-auto text-[10px] text-muted-foreground text-center">
                    Tự động tối ưu băng thông
                </div>
            </div>

            {/* Chat Side Area */}
            <aside className={cn(
                "w-full md:w-80 border-l border-border flex flex-col shrink-0 bg-background overflow-hidden",
                activeTab === 'chat' ? "flex flex-1" : "hidden md:flex",
                activeTab === 'chat' && "md:border-t-2 md:border-t-primary"
            )}>
                <ChatPanel roomId={roomId} currentUserId={currentUserId} />
            </aside>
        </main>
    );
};
