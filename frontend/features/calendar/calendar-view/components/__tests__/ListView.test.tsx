import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ListView } from '../ListView';
import type { SessionRecord } from '@/lib/types/finance';

const createSession = (id: number, date: string, studentName = `Học sinh ${id}`): SessionRecord => ({
    id,
    studentId: id,
    studentName,
    month: '2026-10',
    sessions: 1,
    hours: 2,
    pricePerHour: 200000,
    totalAmount: 400000,
    paid: false,
    sessionDate: date,
    startTime: '18:00',
    endTime: '20:00',
    hoursPerSession: 2,
    createdAt: `${date}T00:00:00Z`,
    status: 'SCHEDULED',
    nguon: 'day_rieng',
});

describe('ListView Component', () => {
    it('renders empty state when there are no sessions', () => {
        render(<ListView sessions={[]} />);
        expect(screen.getByText('Không tìm thấy buổi học nào với bộ lọc hiện tại.')).toBeInTheDocument();
    });

    it('calculates and displays overall stats correctly', () => {
        const sessions = [
            createSession(1, '2026-10-05'),
            createSession(2, '2026-10-07'),
        ];
        render(<ListView sessions={sessions} />);
        expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1); // Số buổi
        expect(screen.getByText('800k')).toBeInTheDocument(); // Thu nhập formatCurrency
        expect(screen.getByText('4h')).toBeInTheDocument(); // Tổng giờ
    });

    it('paginates when there are more sessions than default pageSize (10)', () => {
        // Create 15 sessions across 15 dates
        const sessions = Array.from({ length: 15 }, (_, i) => {
            const day = String(i + 1).padStart(2, '0');
            return createSession(i + 1, `2026-10-${day}`, `Học sinh ${i + 1}`);
        });

        render(<ListView sessions={sessions} />);

        // Should show page 1/2 and 1 - 10 of 15
        expect(screen.getByText(/1 - 10/)).toBeInTheDocument();
        expect(screen.getAllByText('15').length).toBeGreaterThanOrEqual(1);

        // First item should be visible, 11th should not
        expect(screen.getByText('Học sinh 1')).toBeInTheDocument();
        expect(screen.queryByText('Học sinh 11')).not.toBeInTheDocument();

        // Click next page
        const nextButton = screen.getByRole('button', { name: /Tiếp/i });
        fireEvent.click(nextButton);

        // Now page 2: Học sinh 11 is visible, Học sinh 1 is not
        expect(screen.getByText(/11 - 15/)).toBeInTheDocument();
        expect(screen.getByText('Học sinh 11')).toBeInTheDocument();
        expect(screen.queryByText('Học sinh 1')).not.toBeInTheDocument();
    });

    it('updates page size when selector is changed', () => {
        const sessions = Array.from({ length: 25 }, (_, i) => {
            const day = String(i + 1).padStart(2, '0');
            return createSession(i + 1, `2026-10-${day}`, `Học sinh ${i + 1}`);
        });

        render(<ListView sessions={sessions} />);

        const select = screen.getByLabelText('Số buổi mỗi trang');
        fireEvent.change(select, { target: { value: '20' } });

        // Now 1 - 20 of 25 sessions displayed on page 1
        expect(screen.getByText(/1 - 20/)).toBeInTheDocument();
        expect(screen.getByText('Học sinh 20')).toBeInTheDocument();
        expect(screen.queryByText('Học sinh 21')).not.toBeInTheDocument();
    });
});
