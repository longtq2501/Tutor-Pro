'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import React, { useState } from 'react';

interface ChatInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
}

/**
 * Chat input component with send button.
 */
export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                disabled={disabled}
                className="flex-1"
            />
            <Button type="submit" size="icon" disabled={disabled || !message.trim()}>
                <Send className="h-4 w-4" />
            </Button>
        </form>
    );
};
