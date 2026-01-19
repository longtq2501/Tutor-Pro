'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatMessages } from '../hooks/useChatMessages';
import { ChatInput } from './ChatInput';
import { useWebSocket } from '../context/WebSocketContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { ChatMessageResponse } from '@/lib/types/chat';
import { useChatTyping } from '../hooks/useChatTyping';

interface ChatPanelProps {
    roomId: string;
    currentUserId: number;
}

/**
 * Main chat panel component with message list and infinite scroll.
 */
export const ChatPanel: React.FC<ChatPanelProps> = ({ roomId, currentUserId }) => {
    const {
        messages,
        loadMoreHistory,
        hasMoreHistory,
        isLoadingHistory,
        isLoadingInitial,
        addRealTimeMessage,
    } = useChatMessages(roomId);

    const { typingUsers, setLocalTyping } = useChatTyping(roomId, currentUserId);

    const { isConnected, sendMessage, subscribe } = useWebSocket();
    const scrollRef = useRef<HTMLDivElement>(null);
    const topObserverRef = useRef<HTMLDivElement>(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

    // Subscribe to real-time chat messages
    useEffect(() => {
        if (isConnected) {
            const unsubscribe = subscribe(`/topic/room/${roomId}/chat`, (message) => {
                addRealTimeMessage(message as ChatMessageResponse);
            });
            return unsubscribe;
        }
    }, [isConnected, roomId, subscribe, addRealTimeMessage]);

    const handleSendMessage = (content: string) => {
        sendMessage(`/app/room/${roomId}/chat`, { content });
    };

    // Intersection Observer for infinite scroll up
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreHistory && !isLoadingHistory) {
                    loadMoreHistory();
                    setShouldScrollToBottom(false);
                }
            },
            { threshold: 1.0 }
        );

        if (topObserverRef.current) {
            observer.observe(topObserverRef.current);
        }

        return () => observer.disconnect();
    }, [hasMoreHistory, isLoadingHistory, loadMoreHistory]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (shouldScrollToBottom && scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, shouldScrollToBottom]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isNearBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
        setShouldScrollToBottom(isNearBottom);
    };

    if (isLoadingInitial) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background border-l">
            <div className="p-4 border-b">
                <h3 className="font-semibold">Trò chuyện</h3>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef} onScrollCapture={handleScroll}>
                <div className="space-y-4">
                    <div ref={topObserverRef} className="h-4 w-full flex justify-center">
                        {isLoadingHistory && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>

                    {messages.map((msg, index) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div
                                key={msg.id || `msg-${index}`}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                                <div className={`flex gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs">
                                            {msg.senderName.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {msg.senderName}
                                            </span>
                                            <Badge variant="outline" className="text-[10px] py-0 px-1 opacity-70">
                                                {msg.senderRole}
                                            </Badge>
                                        </div>
                                        <div
                                            className={`rounded-lg p-2 text-sm ${isMe
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-1">
                                            {format(new Date(msg.timestamp), 'HH:mm', { locale: vi })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            {typingUsers.length > 0 && (
                <div
                    className="px-4 py-1 text-[10px] text-muted-foreground italic animate-pulse"
                    role="status"
                    aria-live="polite"
                >
                    {typingUsers.join(', ')} {typingUsers.length > 1 ? 'đang gõ...' : 'đang gõ...'}
                </div>
            )}

            <ChatInput
                onSendMessage={handleSendMessage}
                onTyping={setLocalTyping}
                disabled={!isConnected}
            />
        </div>
    );
};
