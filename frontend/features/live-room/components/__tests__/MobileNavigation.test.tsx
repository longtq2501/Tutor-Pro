import { render, screen, fireEvent } from '@testing-library/react';
import { MobileNavigation, RoomTab } from '../MobileNavigation';
import { describe, it, expect, vi } from 'vitest';

describe('MobileNavigation', () => {
    it('renders all tabs correctly', () => {
        const onTabChange = vi.fn();
        render(<MobileNavigation activeTab="board" onTabChange={onTabChange} />);

        expect(screen.getByText('Bảng')).toBeInTheDocument();
        expect(screen.getByText('Video')).toBeInTheDocument();
        expect(screen.getByText('Chat')).toBeInTheDocument();
    });

    it('highlights the active tab', () => {
        const onTabChange = vi.fn();
        const { rerender } = render(<MobileNavigation activeTab="board" onTabChange={onTabChange} />);

        const boardButton = screen.getByLabelText('Bảng');
        expect(boardButton).toHaveClass('text-primary');

        rerender(<MobileNavigation activeTab="chat" onTabChange={onTabChange} />);
        const chatButton = screen.getByLabelText('Chat');
        expect(chatButton).toHaveClass('text-primary');
        expect(screen.getByLabelText('Bảng')).not.toHaveClass('text-primary');
    });

    it('calls onTabChange and triggers haptics when a tab is clicked', () => {
        const onTabChange = vi.fn();

        // Mock vibrate if it doesn't exist
        if (!navigator.vibrate) {
            navigator.vibrate = vi.fn();
        }
        const vibrateSpy = vi.spyOn(navigator, 'vibrate').mockImplementation(() => true);

        render(<MobileNavigation activeTab="board" onTabChange={onTabChange} />);

        fireEvent.click(screen.getByLabelText('Video'));
        expect(onTabChange).toHaveBeenCalledWith('video');
        expect(vibrateSpy).toHaveBeenCalledWith(10);

        vibrateSpy.mockRestore();
    });

    it('applies safe area padding', () => {
        const onTabChange = vi.fn();
        render(<MobileNavigation activeTab="board" onTabChange={onTabChange} />);

        const nav = screen.getByRole('navigation');
        expect(nav).toHaveClass('pb-[env(safe-area-inset-bottom)]');
    });
});
