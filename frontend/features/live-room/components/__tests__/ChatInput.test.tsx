import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatInput } from '../ChatInput';
import { vi, describe, it, expect } from 'vitest';

// Mock next/dynamic for EmojiPicker
vi.mock('next/dynamic', () => ({
    default: () => {
        const MockPicker = ({ onEmojiClick }: { onEmojiClick: any }) => (
            <button
                data-testid="emoji-picker"
                onClick={() => onEmojiClick({ emoji: '😀' })}
            >
                Pick Emoji
            </button>
        );
        return MockPicker;
    },
}));

describe('ChatInput', () => {
    const mockOnSendMessage = vi.fn();

    it('should render message input and send button', () => {
        render(<ChatInput onSendMessage={mockOnSendMessage} />);
        expect(screen.getByPlaceholderText(/nhập tin nhắn/i)).toBeInTheDocument();
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it('should allow sending message', () => {
        render(<ChatInput onSendMessage={mockOnSendMessage} />);
        const input = screen.getByPlaceholderText(/nhập tin nhắn/i);
        fireEvent.change(input, { target: { value: 'Hello' } });

        const form = input.closest('form');
        fireEvent.submit(form!);

        expect(mockOnSendMessage).toHaveBeenCalledWith('Hello');
    });

    it('should have emoji button', () => {
        // Mocking resize observer for Popover
        global.ResizeObserver = vi.fn().mockImplementation(() => ({
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
        }));

        render(<ChatInput onSendMessage={mockOnSendMessage} />);
        // Usually the emoji button is inside the trigger, checking for Smile icon or button structure
        // Since we used variant="ghost" size="icon" and Smile icon
        // We can just check for a button that isn't the submit button.
        // Or check existence of popover trigger
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(1);
    });
});
