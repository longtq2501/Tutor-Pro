import { render, screen, fireEvent } from '@testing-library/react';
import { SessionCard } from '../SessionCard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OnlineSessionResponse } from '@/lib/types/onlineSession';

// Mock the useCountdown hook
vi.mock('../../hooks/useCountdown', () => ({
    useCountdown: vi.fn(() => ({
        seconds: 300,
        formatted: '05:00',
        isReady: true
    }))
}));

describe('SessionCard', () => {
    const mockSession: OnlineSessionResponse = {
        id: 1,
        roomId: 'test-room-123',
        roomStatus: 'WAITING',
        scheduledStart: '2026-01-21T10:00:00Z',
        scheduledEnd: '2026-01-21T11:00:00Z',
        tutorId: 100,
        tutorName: 'Nguyễn Văn A',
        studentId: 200,
        studentName: 'Trần Thị B',
        canJoinNow: true
    };

    const mockOnJoin = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders session information correctly', () => {
        render(<SessionCard session={mockSession} onJoin={mockOnJoin} currentUserId={100} />);

        expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
        expect(screen.getByText('Trần Thị B')).toBeInTheDocument();
        expect(screen.getByText('⏳ Chờ bắt đầu')).toBeInTheDocument();
    });

    it('displays countdown timer', () => {
        render(<SessionCard session={mockSession} onJoin={mockOnJoin} currentUserId={100} />);

        expect(screen.getByText('05:00')).toBeInTheDocument();
    });

    it('shows "Bắt đầu dạy" button for tutor', () => {
        render(<SessionCard session={mockSession} onJoin={mockOnJoin} currentUserId={100} />);

        const button = screen.getByRole('button', { name: /Bắt đầu dạy/i });
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
    });

    it('shows "Tham gia học" button for student', () => {
        render(<SessionCard session={mockSession} onJoin={mockOnJoin} currentUserId={200} />);

        const button = screen.getByRole('button', { name: /Tham gia học/i });
        expect(button).toBeInTheDocument();
    });

    it('disables button when canJoinNow is false', () => {
        const sessionNotReady = { ...mockSession, canJoinNow: false };
        render(<SessionCard session={sessionNotReady} onJoin={mockOnJoin} currentUserId={100} />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('disables button when room status is ENDED', () => {
        const endedSession = { ...mockSession, roomStatus: 'ENDED' as const };
        render(<SessionCard session={endedSession} onJoin={mockOnJoin} currentUserId={100} />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('calls onJoin with roomId when button is clicked', () => {
        render(<SessionCard session={mockSession} onJoin={mockOnJoin} currentUserId={100} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockOnJoin).toHaveBeenCalledWith('test-room-123');
        expect(mockOnJoin).toHaveBeenCalledTimes(1);
    });

    it('highlights tutor name when current user is tutor', () => {
        const { container } = render(<SessionCard session={mockSession} onJoin={mockOnJoin} currentUserId={100} />);

        const tutorNameElement = screen.getByText('Nguyễn Văn A');
        expect(tutorNameElement).toHaveClass('text-primary');
    });

    it('highlights student name when current user is student', () => {
        const { container } = render(<SessionCard session={mockSession} onJoin={mockOnJoin} currentUserId={200} />);

        const studentNameElement = screen.getByText('Trần Thị B');
        expect(studentNameElement).toHaveClass('text-blue-500');
    });

    it('shows active badge when room status is ACTIVE', () => {
        const activeSession = { ...mockSession, roomStatus: 'ACTIVE' as const };
        render(<SessionCard session={activeSession} onJoin={mockOnJoin} currentUserId={100} />);

        expect(screen.getByText('🔴 Đang diễn ra')).toBeInTheDocument();
    });
});
