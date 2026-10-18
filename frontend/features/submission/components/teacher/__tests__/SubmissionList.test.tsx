import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { SubmissionList } from '../SubmissionList';
import { submissionService } from '../../../services/submissionService';
import { SubmissionListItemResponse, SubmissionStatusEnum } from '../../../types/submission.types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../../services/submissionService');

const mockSubmissions: SubmissionListItemResponse[] = [
    {
        id: 'sub-1',
        studentId: 'stu-1',
        studentName: 'Nguyễn Văn An',
        status: SubmissionStatusEnum.SUBMITTED,
        mcqScore: 8,
        essayScore: undefined,
        totalScore: undefined,
        submittedAt: '2026-10-17T10:00:00Z',
    },
    {
        id: 'sub-2',
        studentId: 'stu-2',
        studentName: 'Trần Thị Bình',
        status: SubmissionStatusEnum.GRADED,
        mcqScore: 10,
        essayScore: 8,
        totalScore: 90,
        submittedAt: '2026-10-16T09:00:00Z',
    },
    {
        id: 'sub-3',
        studentId: 'stu-3',
        studentName: 'Lê Văn Cường',
        status: SubmissionStatusEnum.AUTO_SUBMITTED,
        autoSubmitted: true,
        hasAnswers: true,
        mcqScore: 4,
        essayScore: undefined,
        totalScore: 20,
        submittedAt: '2026-10-15T08:00:00Z',
    },
    {
        id: 'sub-4',
        studentId: 'stu-4',
        studentName: 'Phạm Đức Dũng',
        status: SubmissionStatusEnum.AUTO_SUBMITTED,
        autoSubmitted: true,
        hasAnswers: false, // blank auto attempt
        mcqScore: 0,
        essayScore: 0,
        totalScore: 0,
        submittedAt: '2026-10-14T07:00:00Z',
    },
    {
        id: 'sub-5',
        studentId: 'stu-5',
        studentName: 'Hoàng Thị Hoa',
        status: SubmissionStatusEnum.PENDING,
        mcqScore: undefined,
        essayScore: undefined,
        totalScore: undefined,
    },
];

describe('SubmissionList (FB-06, FB-08, FB-22)', () => {
    const onSelectSubmissionMock = vi.fn();

    const renderComponent = () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        return render(
            <QueryClientProvider client={queryClient}>
                <SubmissionList
                    exerciseId="ex-1"
                    onSelectSubmission={onSelectSubmissionMock}
                />
            </QueryClientProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(submissionService.listByExercise).mockResolvedValue(mockSubmissions);
    });

    it('renders submissions list after loading', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Bài nộp của học sinh')).toBeInTheDocument();
            expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
            expect(screen.getByText('Trần Thị Bình')).toBeInTheDocument();
            expect(screen.getByText('Lê Văn Cường')).toBeInTheDocument();
            expect(screen.getByText('Phạm Đức Dũng')).toBeInTheDocument();
            expect(screen.getByText('Hoàng Thị Hoa')).toBeInTheDocument();
        });
    });

    it('filters by search term (student name)', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Tìm theo tên học sinh...');
        fireEvent.change(searchInput, { target: { value: 'Bình' } });

        expect(screen.getByText('Trần Thị Bình')).toBeInTheDocument();
        expect(screen.queryByText('Nguyễn Văn An')).not.toBeInTheDocument();
        expect(screen.queryByText('Lê Văn Cường')).not.toBeInTheDocument();
    });

    it('filters by "Cần chấm tay" quick filter', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
        });

        // Click "Cần chấm tay"
        const needsGradingButton = screen.getByRole('button', { name: /Cần chấm tay/i });
        fireEvent.click(needsGradingButton);

        // sub-1 (SUBMITTED) and sub-3 (AUTO_SUBMITTED with answers) should be visible
        expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
        expect(screen.getByText('Lê Văn Cường')).toBeInTheDocument();

        // sub-2 (GRADED), sub-4 (blank auto attempt), sub-5 (PENDING) should NOT be visible
        expect(screen.queryByText('Trần Thị Bình')).not.toBeInTheDocument();
        expect(screen.queryByText('Phạm Đức Dũng')).not.toBeInTheDocument();
        expect(screen.queryByText('Hoàng Thị Hoa')).not.toBeInTheDocument();
    });

    it('shows empty filter state and allows resetting', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Tìm theo tên học sinh...');
        fireEvent.change(searchInput, { target: { value: 'Không tồn tại 12345' } });

        expect(screen.getByText('Không tìm thấy bài nộp phù hợp')).toBeInTheDocument();

        // Click "Xóa bộ lọc"
        const clearButton = screen.getByRole('button', { name: 'Xóa bộ lọc' });
        fireEvent.click(clearButton);

        expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
        expect(screen.getByText('Trần Thị Bình')).toBeInTheDocument();
    });
});
