import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { GradingView } from '../GradingView';
import { submissionService } from '../../../services/submissionService';
import { exerciseService } from '@/features/exercise-import/services/exerciseService';
import { Exercise, QuestionType } from '@/features/exercise-import/types/exercise.types';
import { SubmissionResponse, SubmissionStatusEnum } from '../../../types/submission.types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../../services/submissionService');
vi.mock('@/features/exercise-import/services/exerciseService');

const mockExercise: Exercise = {
    id: 'ex-1',
    title: 'Bài kiểm tra Toán học',
    totalPoints: 10,
    questions: [
        {
            id: 'q-1',
            orderIndex: 0,
            type: QuestionType.MCQ,
            questionText: '1 + 1 bằng mấy?',
            points: 2,
            options: [
                { id: 'opt-1', label: 'A', optionText: '2', isCorrect: true },
                { id: 'opt-2', label: 'B', optionText: '3', isCorrect: false },
            ],
        },
        {
            id: 'q-2',
            orderIndex: 1,
            type: QuestionType.MCQ,
            questionText: 'Thủ đô của Việt Nam là gì?',
            points: 2,
            options: [
                { id: 'opt-3', label: 'A', optionText: 'Hà Nội', isCorrect: true },
                { id: 'opt-4', label: 'B', optionText: 'TP.HCM', isCorrect: false },
            ],
        },
        {
            id: 'q-3',
            orderIndex: 2,
            type: QuestionType.ESSAY,
            questionText: 'Hãy phân tích bài thơ Tây Tiến.',
            points: 6,
            rubric: 'Nêu đầy đủ ý: 4 điểm, liên hệ: 2 điểm',
        },
    ],
} as unknown as Exercise;

const mockSubmission: SubmissionResponse = {
    id: 'sub-1',
    exerciseId: 'ex-1',
    studentId: 'stu-1',
    studentName: 'Nguyễn Văn An',
    status: SubmissionStatusEnum.SUBMITTED,
    mcqScore: 2,
    essayScore: 0,
    totalScore: 2,
    submittedAt: '2026-10-18T08:00:00Z',
    answers: [
        {
            id: 'ans-1',
            questionId: 'q-1',
            selectedOption: 'A',
            isCorrect: true,
            points: 2,
        },
        {
            id: 'ans-2',
            questionId: 'q-2',
            selectedOption: 'B',
            isCorrect: false,
            points: 0,
        },
        {
            id: 'ans-3',
            questionId: 'q-3',
            essayText: 'Đây là bài phân tích của em.',
            points: 0,
            feedback: '',
        },
    ],
};

describe('GradingView (FB-12, FB-19, FB-20, FB-22)', () => {
    const onBackMock = vi.fn();

    const renderComponent = (isReviewMode = false) => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        return render(
            <QueryClientProvider client={queryClient}>
                <GradingView
                    submissionId="sub-1"
                    onBack={onBackMock}
                    isReviewMode={isReviewMode}
                />
            </QueryClientProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(submissionService.getById).mockResolvedValue(mockSubmission);
        vi.mocked(exerciseService.getById).mockResolvedValue(mockExercise);
    });

    it('renders questions, scores, and Question Matrix correctly', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Bài kiểm tra Toán học')).toBeInTheDocument();
            expect(screen.getByText('Nguyễn Văn An')).toBeInTheDocument();
        });

        // FB-19: Scores header check
        expect(screen.getByText('MCQ')).toBeInTheDocument();
        expect(screen.getAllByText('Tự luận').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('Tổng')).toBeInTheDocument();

        // FB-20: Question Matrix check
        expect(screen.getByText(/Ma trận câu hỏi/i)).toBeInTheDocument();
        expect(screen.getByText(/1 đúng/i)).toBeInTheDocument();
        expect(screen.getByText(/1 sai/i)).toBeInTheDocument();
        expect(screen.getByText(/1 tự luận/i)).toBeInTheDocument();

        // Verify question cards
        expect(screen.getByText('1 + 1 bằng mấy?')).toBeInTheDocument();
        expect(screen.getByText('Thủ đô của Việt Nam là gì?')).toBeInTheDocument();
        expect(screen.getByText('Hãy phân tích bài thơ Tây Tiến.')).toBeInTheDocument();
    });

    it('filters questions when "Chỉ hiện câu cần xem lại" is toggled', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('1 + 1 bằng mấy?')).toBeInTheDocument();
        });

        // Click toggle to show only questions needing review
        const toggleBtn = screen.getByRole('button', { name: /Chỉ hiện câu cần xem lại/i });
        fireEvent.click(toggleBtn);

        // Correct MCQ (q-1) should be hidden
        expect(screen.queryByText('1 + 1 bằng mấy?')).not.toBeInTheDocument();

        // Incorrect MCQ (q-2) and Essay (q-3) should remain visible
        expect(screen.getByText('Thủ đô của Việt Nam là gì?')).toBeInTheDocument();
        expect(screen.getByText('Hãy phân tích bài thơ Tây Tiến.')).toBeInTheDocument();

        // Toggle back
        const toggleBackBtn = screen.getByRole('button', { name: /Hiện tất cả câu hỏi/i });
        fireEvent.click(toggleBackBtn);

        expect(screen.getByText('1 + 1 bằng mấy?')).toBeInTheDocument();
    });

    it('allows teacher to grade essay questions up to max points', async () => {
        vi.mocked(submissionService.gradeSubmission).mockResolvedValue({} as SubmissionResponse);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Hãy phân tích bài thơ Tây Tiến.')).toBeInTheDocument();
        });

        // Find the essay score input
        const pointsInput = screen.getByDisplayValue('0');
        fireEvent.change(pointsInput, { target: { value: '5.5' } });

        // Enter teacher comment
        const commentTextarea = screen.getByPlaceholderText(/Nhập nhận xét chung/i);
        fireEvent.change(commentTextarea, { target: { value: 'Bài làm khá tốt.' } });

        // Save grades
        const saveBtn = screen.getByRole('button', { name: /Lưu điểm/i });
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(submissionService.gradeSubmission).toHaveBeenCalledWith('sub-1', expect.objectContaining({
                teacherComment: 'Bài làm khá tốt.',
                essayGrades: expect.arrayContaining([
                    expect.objectContaining({
                        questionId: 'q-3',
                        points: 5.5,
                    }),
                ]),
            }));
            expect(onBackMock).toHaveBeenCalled();
        });
    });
});
