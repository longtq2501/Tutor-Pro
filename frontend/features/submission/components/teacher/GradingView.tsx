import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { exerciseService } from '@/features/exercise-import/services/exerciseService';
import { Exercise, QuestionType } from '@/features/exercise-import/types/exercise.types';
import { ArrowLeft, CheckCircle2, Save, XCircle, AlertCircle, PenTool } from 'lucide-react';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { submissionService } from '../../services/submissionService';
import { GradeSubmissionRequest, SubmissionResponse } from '../../types/submission.types';
import {
    getScorePresentation,
    getSubmissionStatusPresentation,
    isAutoCollected,
    isBlankAutoCollected,
} from '../../constants/submissionStatus';
import { cn, formatExerciseTitle } from '@/lib/utils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/hooks/useQueryKeys';
import Image from 'next/image';
import { SubmissionExceptionActions } from './SubmissionExceptionActions';

interface GradingViewProps {
    submissionId: string;
    onBack: () => void;
    isReviewMode?: boolean;
}

export const GradingView: React.FC<GradingViewProps> = ({ submissionId, onBack, isReviewMode = false }) => {
    const queryClient = useQueryClient();
    const [submission, setSubmission] = useState<SubmissionResponse | null>(null);
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Grading state
    const [essayGrades, setEssayGrades] = useState<Map<string, { points: number; feedback: string }>>(new Map());
    const [teacherComment, setTeacherComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // FB-20: Filter to only show questions needing teacher review
    const [filterReviewOnly, setFilterReviewOnly] = useState(false);

    const normalizeEssayText = (text?: string) => {
        if (!text) return '(Chưa làm bài)';
        return text.normalize('NFC');
    };

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const subData = await submissionService.getById(submissionId);
            setSubmission(subData);
            setTeacherComment(subData.teacherComment || '');

            const exData = await exerciseService.getById(subData.exerciseId);
            setExercise(exData);

            // Initialize grades - ONLY for essay questions
            const grades = new Map<string, { points: number; feedback: string }>();
            subData.answers.forEach(a => {
                const question = exData.questions?.find(q => q.id === a.questionId);
                if (question?.type === QuestionType.ESSAY) {
                    if (a.points !== undefined || a.feedback) {
                        grades.set(a.questionId, { points: a.points || 0, feedback: a.feedback || '' });
                    }
                }
            });
            setEssayGrades(grades);
        } catch {
            toast.error("Lỗi", { description: "Không thể tải dữ liệu chấm bài" });
        } finally {
            setIsLoading(false);
        }
    }, [submissionId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // FB-19: Safe grade change with validation
    const handleGradeChange = (questionId: string, field: 'points' | 'feedback', value: string | number) => {
        const newGrades = new Map(essayGrades);
        const current = newGrades.get(questionId) || { points: 0, feedback: '' };

        if (field === 'points') {
            const parsed = typeof value === 'number' ? value : parseFloat(value as string);
            const questionMax = exercise?.questions?.find(q => q.id === questionId)?.points ?? Infinity;
            const sanitized = Number.isFinite(parsed) ? parsed : 0;
            const clamped = Math.max(0, Math.min(sanitized, questionMax));
            current.points = Math.round(clamped * 100) / 100;
        } else {
            current.feedback = String(value);
        }

        newGrades.set(questionId, current);
        setEssayGrades(newGrades);
    };

    const calculateEssayScore = useCallback(() => {
        return Array.from(essayGrades.values()).reduce((sum, g) => sum + (g.points || 0), 0);
    }, [essayGrades]);

    const totalCalculated = useMemo(() => {
        const mcq = submission?.mcqScore || 0;
        const essay = calculateEssayScore();
        return mcq + essay;
    }, [submission, calculateEssayScore]);

    const finalTotal = useMemo(() => {
        if (!exercise) return 0;
        return Math.min(totalCalculated, exercise.totalPoints);
    }, [totalCalculated, exercise]);

    // In review mode, trust persisted scores from backend instead of recomputing from local form state.
    const displayedMcqScore = submission?.mcqScore || 0;
    const displayedEssayScore = isReviewMode ? (submission?.essayScore || 0) : calculateEssayScore();
    const displayedTotalScore = isReviewMode
        ? Math.min(submission?.totalScore || (displayedMcqScore + displayedEssayScore), exercise?.totalPoints || Infinity)
        : finalTotal;

    // FB-01/FB-03: an attempt the system collected after the deadline needs a clear,
    // non-alarmist explanation instead of looking like a student submission.
    const autoCollected = isAutoCollected(submission);
    // FB-03: a blank auto-collected attempt contains nothing a human can grade — the save
    // button must be hidden so nobody "grades" an empty sheet.
    const isBlankAutoAttempt = isBlankAutoCollected(submission);
    const isGradeable = !isReviewMode && !isBlankAutoAttempt;

    // FB-22: Semantic score colors for total score
    const totalScorePres = getScorePresentation(displayedTotalScore, { autoSubmitted: autoCollected });

    // FB-20: Calculate question statistics for the summary matrix
    const questionStats = useMemo(() => {
        if (!exercise?.questions) return { correct: 0, incorrect: 0, unanswered: 0, essay: 0 };
        let correct = 0;
        let incorrect = 0;
        let unanswered = 0;
        let essay = 0;

        exercise.questions.forEach(q => {
            const answer = submission?.answers.find(a => a.questionId === q.id);
            if (q.type === QuestionType.ESSAY) {
                essay++;
            } else {
                const correctOption = q.options?.find(o => o.isCorrect)?.label;
                const isCorrect = answer?.isCorrect === true ||
                    ((answer?.points || 0) > 0 && q.type === QuestionType.MCQ) ||
                    (answer?.selectedOption && correctOption && answer.selectedOption.trim() === correctOption.trim());
                const hasAnswer = !!answer?.selectedOption;

                if (!hasAnswer) {
                    unanswered++;
                } else if (isCorrect) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        });

        return { correct, incorrect, unanswered, essay };
    }, [exercise, submission]);

    // FB-20: Smooth scroll to question card
    const scrollToQuestion = (questionId: string) => {
        const el = document.getElementById(`question-card-${questionId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-primary', 'transition-all');
            setTimeout(() => {
                el.classList.remove('ring-2', 'ring-primary');
            }, 1500);
        }
    };

    const handleSaveGrade = async () => {
        if (!submission || !exercise) return;
        setIsSubmitting(true);
        try {
            const answerByQuestionId = new Map(submission.answers.map(a => [a.questionId, a]));
            const essayGradesPayload = (exercise.questions || [])
                .filter(q => q.type === QuestionType.ESSAY)
                .map(q => {
                    const edited = essayGrades.get(q.id!);
                    const existing = answerByQuestionId.get(q.id!);
                    return {
                        questionId: q.id!,
                        points: edited?.points ?? existing?.points ?? 0,
                        feedback: edited?.feedback ?? existing?.feedback ?? '',
                    };
                });

            const request: GradeSubmissionRequest = {
                essayGrades: essayGradesPayload,
                teacherComment
            };

            await submissionService.gradeSubmission(submissionId, request);
            await queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all });
            toast.success("Đã lưu điểm!", { description: "Điểm số đã được cập nhật chính xác." });
            onBack();
        } catch {
            toast.error("Lỗi", { description: "Không thể lưu điểm bài nộp" });
            setIsSubmitting(false);
        }
    };

    if (isLoading || !submission || !exercise) {
        return (
            <div className="max-w-5xl mx-auto pb-40 space-y-6">
                <Card className="shadow-sm">
                    <CardHeader className="py-4">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-64" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-20" />
                                <Skeleton className="h-10 w-20" />
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i}>
                            <CardHeader className="bg-muted/30">
                                <Skeleton className="h-5 w-full" />
                            </CardHeader>
                            <CardContent className="py-6 space-y-4">
                                <Skeleton className="h-24 w-full" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-10 w-32" />
                                    <Skeleton className="h-10 flex-1" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Determine questions visible under current filter
    const visibleQuestions = (exercise.questions || []).filter(q => {
        if (!filterReviewOnly) return true;
        const answer = submission.answers.find(a => a.questionId === q.id);
        const correctOption = q.options?.find(o => o.isCorrect)?.label;
        const isCorrect = answer?.isCorrect === true ||
            ((answer?.points || 0) > 0 && q.type === QuestionType.MCQ) ||
            (answer?.selectedOption && correctOption && answer.selectedOption.trim() === correctOption.trim());
        const hasAnswer = !!answer?.selectedOption || !!answer?.essayText;

        // Needs review: Essay questions, Incorrect MCQ, Unanswered questions
        return q.type === QuestionType.ESSAY || !isCorrect || !hasAnswer;
    });

    return (
        /* FB-12: pb-40 prevents bottom content from ever being obscured by the fixed footer */
        <div className="max-w-5xl mx-auto pb-40 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {/* Sticky Header with Title and Scores */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b -mx-1 px-1 pb-3 mb-6">
                <Card className="border-l-4 border-l-primary shadow-sm bg-card mt-2">
                    <CardHeader className="py-2.5 px-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 h-8 w-8 -ml-1">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <div>
                                    <CardTitle className="text-base md:text-lg font-bold whitespace-pre-wrap leading-tight">
                                        {formatExerciseTitle(exercise.title).split('\n')[0]}
                                    </CardTitle>
                                    {/* FB-08: elevated font sizes from text-[10px] to text-xs */}
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs text-muted-foreground">
                                        <span className="font-bold text-foreground">{submission.studentName || submission.studentId}</span>
                                        <span className="opacity-50">|</span>
                                        <span>Nộp: {submission.submittedAt ? format(new Date(submission.submittedAt), 'HH:mm dd/MM') : 'N/A'}</span>
                                        {autoCollected && (
                                            <>
                                                <span className="opacity-50">|</span>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "h-5 px-2 text-xs font-semibold border",
                                                        getSubmissionStatusPresentation(submission.status).badgeClassName
                                                    )}
                                                >
                                                    {getSubmissionStatusPresentation(submission.status).label}
                                                </Badge>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* FB-19: Prominent scores header with WCAG AA sizes & semantic colors */}
                            <div className="flex gap-2 shrink-0 self-end md:self-center items-center">
                                <SubmissionExceptionActions
                                    submissionId={submission.id}
                                    submission={submission}
                                    isReviewMode={isReviewMode}
                                    onSubmissionUpdated={fetchData}
                                />
                                <div className="flex flex-col items-center bg-secondary/40 px-3 py-1 rounded-md border border-border min-w-[65px]">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">MCQ</span>
                                    <span className="text-base font-bold text-foreground">{displayedMcqScore}</span>
                                </div>
                                <div className="flex flex-col items-center bg-secondary/40 px-3 py-1 rounded-md border border-border min-w-[65px]">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Tự luận</span>
                                    <span className="text-base font-bold text-yellow-600 dark:text-yellow-500">{displayedEssayScore}</span>
                                </div>
                                <div className="flex flex-col items-center bg-primary/10 px-3.5 py-1 rounded-md border border-primary/20 min-w-[75px]">
                                    <span className="text-xs text-primary/80 uppercase font-semibold">Tổng</span>
                                    <span className={cn("text-base font-black", totalScorePres.scoreClassName)}>
                                        {displayedTotalScore}/{exercise.totalPoints}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {autoCollected && (
                            <div className="mt-2 flex items-start gap-2 text-xs text-red-700 dark:text-red-300 bg-red-500/10 p-2 rounded border border-red-500/30">
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>
                                    <strong>Hệ thống tự thu bài khi hết hạn.</strong>{' '}
                                    {isBlankAutoAttempt
                                        ? 'Học sinh không để lại câu trả lời nào nên bài này không cần chấm — điểm 0 được giữ nguyên.'
                                        : 'Phần tự luận chưa được chấm, hãy chấm và lưu điểm như bình thường nếu cần.'}
                                </span>
                            </div>
                        )}
                        {!isReviewMode && totalCalculated > exercise.totalPoints && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-red-600 bg-red-500/10 p-1.5 rounded border border-red-500/20">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>Giới hạn điểm tối đa là {exercise.totalPoints} điểm.</span>
                            </div>
                        )}
                    </CardHeader>
                </Card>
            </div>

            {/* FB-20: Question Matrix / Navigator & Quick Jump Bar */}
            <Card className="border shadow-sm bg-card mb-6">
                <CardContent className="p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">
                                Ma trận câu hỏi ({exercise.questions?.length || 0}):
                            </span>
                            <Badge variant="outline" className="h-5 px-1.5 text-xs border-emerald-500/40 text-emerald-700 bg-emerald-500/10 dark:text-emerald-400">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {questionStats.correct} đúng
                            </Badge>
                            {questionStats.incorrect > 0 && (
                                <Badge variant="outline" className="h-5 px-1.5 text-xs border-red-500/40 text-red-700 bg-red-500/10 dark:text-red-400">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    {questionStats.incorrect} sai
                                </Badge>
                            )}
                            {questionStats.essay > 0 && (
                                <Badge variant="outline" className="h-5 px-1.5 text-xs border-amber-500/40 text-amber-700 bg-amber-500/10 dark:text-amber-400">
                                    <PenTool className="h-3 w-3 mr-1" />
                                    {questionStats.essay} tự luận
                                </Badge>
                            )}
                            {questionStats.unanswered > 0 && (
                                <Badge variant="outline" className="h-5 px-1.5 text-xs border-muted text-muted-foreground bg-muted/50">
                                    {questionStats.unanswered} chưa làm
                                </Badge>
                            )}
                        </div>

                        {/* Toggle to only show questions needing teacher attention */}
                        <Button
                            variant={filterReviewOnly ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterReviewOnly(!filterReviewOnly)}
                            className="h-7 text-xs font-medium self-start sm:self-auto"
                        >
                            {filterReviewOnly ? "Hiện tất cả câu hỏi" : "Chỉ hiện câu cần xem lại"}
                        </Button>
                    </div>

                    {/* Matrix grid pills for jumping to each question */}
                    <div className="flex flex-wrap gap-1.5">
                        {exercise.questions?.map((q, idx) => {
                            const answer = submission.answers.find(a => a.questionId === q.id);
                            const isEssay = q.type === QuestionType.ESSAY;
                            const correctOption = q.options?.find(o => o.isCorrect)?.label;
                            const isCorrect = answer?.isCorrect === true ||
                                ((answer?.points || 0) > 0 && q.type === QuestionType.MCQ) ||
                                (answer?.selectedOption && correctOption && answer.selectedOption.trim() === correctOption.trim());
                            const hasAnswer = !!answer?.selectedOption || !!answer?.essayText;
                            const grade = essayGrades.get(q.id!);
                            const isEssayGraded = isEssay && (grade?.points !== undefined && (grade.points > 0 || !!grade.feedback));

                            let pillColor = "border-muted-foreground/30 bg-muted/40 text-muted-foreground hover:bg-muted";
                            let statusTitle = "Chưa làm";

                            if (isEssay) {
                                if (isEssayGraded) {
                                    pillColor = "border-blue-500/50 bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25";
                                    statusTitle = `Tự luận (${grade?.points ?? 0}đ)`;
                                } else {
                                    pillColor = "border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25";
                                    statusTitle = "Tự luận (Chưa chấm)";
                                }
                            } else if (hasAnswer) {
                                if (isCorrect) {
                                    pillColor = "border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25";
                                    statusTitle = "Đúng";
                                } else {
                                    pillColor = "border-red-500/50 bg-red-500/15 text-red-700 dark:text-red-300 hover:bg-red-500/25";
                                    statusTitle = "Sai";
                                }
                            }

                            return (
                                <button
                                    key={q.id}
                                    type="button"
                                    onClick={() => {
                                        if (filterReviewOnly && !isEssay && isCorrect) {
                                            setFilterReviewOnly(false);
                                        }
                                        setTimeout(() => scrollToQuestion(q.id!), 50);
                                    }}
                                    title={`Câu ${idx + 1}: ${statusTitle}`}
                                    className={cn(
                                        "h-7 w-7 rounded-md border text-xs font-bold transition-all flex items-center justify-center cursor-pointer",
                                        pillColor
                                    )}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Questions list */}
            <div className="space-y-6">
                {visibleQuestions.length === 0 ? (
                    <Card className="p-8 text-center bg-muted/20 border-dashed">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-foreground">Không có câu nào cần xem lại</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Học sinh đã trả lời đúng tất cả các câu trắc nghiệm và bài không có câu tự luận nào chưa chấm.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilterReviewOnly(false)}
                            className="mt-4 text-xs h-8"
                        >
                            Hiện tất cả câu hỏi
                        </Button>
                    </Card>
                ) : (
                    visibleQuestions.map((q) => {
                        const originalIndex = (exercise.questions || []).findIndex(item => item.id === q.id);
                        const idx = originalIndex >= 0 ? originalIndex : 0;
                        const answer = submission.answers.find(a => a.questionId === q.id);
                        const grade = essayGrades.get(q.id!) || { points: 0, feedback: '' };

                        // Derive the correct answer label properly from options
                        const correctOption = q.options?.find(o => o.isCorrect)?.label;
                        const correctOptionText = q.options?.find(o => o.isCorrect)?.optionText;
                        const selectedOptionText = q.options?.find(o => o.label === answer?.selectedOption)?.optionText;

                        // Determine status
                        const isCorrect = answer?.isCorrect === true ||
                            ((answer?.points || 0) > 0 && q.type === QuestionType.MCQ) ||
                            (answer?.selectedOption && correctOption && answer.selectedOption.trim() === correctOption.trim());

                        const hasAnswer = !!answer?.selectedOption || !!answer?.essayText;

                        return (
                            <Card
                                key={q.id}
                                id={`question-card-${q.id}`}
                                className={cn(
                                    "border transition-all duration-200",
                                    !hasAnswer ? "opacity-90 bg-muted/30" : "bg-card shadow-sm hover:shadow-md"
                                )}
                            >
                                <CardHeader className="bg-muted/30 border-b pb-3 pt-3">
                                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                        <div className="flex gap-3 min-w-0">
                                            <Badge variant="outline" className="h-7 w-7 rounded-full flex items-center justify-center p-0 shrink-0 bg-background text-xs font-bold">
                                                {idx + 1}
                                            </Badge>
                                            <div className="min-w-0">
                                                <div className="font-medium leading-normal text-base text-foreground break-words whitespace-pre-wrap">
                                                    {q.questionText}
                                                </div>
                                                {q.imageUrl && (
                                                    <div className="mt-3 rounded-md overflow-hidden border border-border bg-muted/20 max-w-2xl">
                                                        <Image
                                                            src={q.imageUrl}
                                                            alt={`Question ${idx + 1} image`}
                                                            width={1200}
                                                            height={700}
                                                            className="w-full h-auto object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <Badge variant="secondary" className="text-xs font-normal">
                                                        {q.type === QuestionType.MCQ ? 'Trắc nghiệm' : 'Tự luận'}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs font-normal">
                                                        {q.points} điểm
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    {q.type === QuestionType.MCQ ? (
                                        <div className="space-y-3">
                                            <div className={cn(
                                                "p-4 rounded-lg border flex flex-col gap-3 transition-colors",
                                                isCorrect === true ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400" :
                                                    (hasAnswer ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400" : "bg-muted border-dashed")
                                            )}>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <div className="flex items-start gap-2">
                                                        <span className="font-semibold text-xs uppercase opacity-75 shrink-0">Câu trả lời:</span>
                                                        <div className="flex flex-row items-center flex-wrap gap-1.5 min-w-0">
                                                            <span className="text-base font-bold">{answer?.selectedOption || '(Chưa làm)'}</span>
                                                            {answer?.selectedOption && selectedOptionText && (
                                                                <span className="text-base font-bold">-</span>
                                                            )}
                                                            {selectedOptionText && (
                                                                <span className="text-xs opacity-90 break-words">{selectedOptionText}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {hasAnswer && (
                                                        <div className="flex items-center gap-1.5 font-bold text-xs shrink-0">
                                                            {isCorrect ? (
                                                                <>
                                                                    <CheckCircle2 className="h-4 w-4 shrink-0" /> Chính xác
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle className="h-4 w-4 shrink-0" /> Sai
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Always show correct answer for teacher */}
                                            <div className="text-xs bg-muted/50 p-3 rounded-md border border-border space-y-1">
                                                <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                                    <span className="text-muted-foreground font-semibold">Đáp án đúng:</span>
                                                    <div className="flex flex-row items-center flex-wrap gap-1.5 min-w-0">
                                                        <span className="font-bold text-foreground">{correctOption || 'N/A'}</span>
                                                        {correctOption && correctOptionText && (
                                                            <span className="font-bold text-foreground">-</span>
                                                        )}
                                                        {correctOptionText && (
                                                            <span className="text-xs opacity-90 break-words">{correctOptionText}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Essay Section
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground text-xs uppercase font-bold">Bài làm của học sinh</Label>
                                                <div className="p-4 bg-muted/30 rounded-lg border min-h-[100px] whitespace-pre-wrap break-words font-sans text-foreground/90 leading-relaxed text-sm">
                                                    {normalizeEssayText(answer?.essayText)}
                                                </div>
                                            </div>

                                            {!isReviewMode && q.rubric && (
                                                <div className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 p-3 rounded border border-blue-500/20 whitespace-pre-wrap">
                                                    <strong>Gợi ý chấm điểm (Rubric):</strong> {q.rubric}
                                                </div>
                                            )}

                                            {/* FB-19: Clear essay score input with validation */}
                                            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-dashed">
                                                <div className="w-full md:w-36 space-y-1.5 shrink-0">
                                                    <Label className="text-xs font-semibold">Điểm số (tối đa {q.points}đ)</Label>
                                                    {isReviewMode ? (
                                                        <div className="h-9 px-3 py-2 border rounded-md bg-muted/30 font-bold text-sm flex items-center">
                                                            {grade.points} <span className="text-muted-foreground ml-1 font-normal text-xs">/ {q.points}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="relative">
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                max={q.points}
                                                                step="0.25"
                                                                className="pr-12 text-sm font-bold h-9"
                                                                value={grade.points}
                                                                onChange={(e) => handleGradeChange(q.id!, 'points', e.target.value)}
                                                            />
                                                            <span className="absolute right-3 top-2 text-xs text-muted-foreground font-medium">/ {q.points}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-full space-y-1.5">
                                                    <Label className="text-xs font-semibold">Nhận xét câu trả lời</Label>
                                                    {isReviewMode ? (
                                                        <div className="min-h-[72px] p-3 border rounded-md bg-muted/30 text-xs italic whitespace-pre-wrap break-words">
                                                            {grade.feedback || 'Không có nhận xét'}
                                                        </div>
                                                    ) : (
                                                        <Textarea
                                                            placeholder="Nhập nhận xét cho câu trả lời này..."
                                                            className="min-h-[72px] resize-none text-xs"
                                                            value={grade.feedback}
                                                            onChange={(e) => handleGradeChange(q.id!, 'feedback', e.target.value)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                )}

                {/* Overall Teacher Comments */}
                <Card className="mt-8 border-primary/20 bg-primary/5 shadow-inner">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base font-bold">Nhận xét chung</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 pb-4">
                        {isReviewMode ? (
                            <div className="p-4 bg-background border rounded-lg italic text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto text-xs">
                                {teacherComment || 'Giáo viên chưa để lại nhận xét chung.'}
                            </div>
                        ) : (
                            <Textarea
                                placeholder="Nhập nhận xét chung cho toàn bộ bài làm của học sinh..."
                                value={teacherComment}
                                onChange={(e) => setTeacherComment(e.target.value)}
                                rows={4}
                                className="bg-background border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs sm:text-sm"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* FB-12: Solid, high-contrast footer without text leaking through */}
            <div className="fixed bottom-0 left-0 right-0 p-3.5 bg-background/95 backdrop-blur-md border-t shadow-lg z-50">
                <div className="container mx-auto max-w-5xl flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                        {isReviewMode ? "Chế độ xem lại bài làm" : isBlankAutoAttempt ? "Bài tự thu (không cần chấm)" : "Đang chấm điểm"}
                    </span>
                    <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
                        <Button variant="outline" onClick={onBack} className="min-w-[90px] h-9 text-xs">
                            {isReviewMode ? "Quay lại" : "Hủy bỏ"}
                        </Button>
                        {isGradeable && (
                            <Button onClick={handleSaveGrade} disabled={isSubmitting} className="min-w-[130px] h-9 text-xs font-semibold">
                                <Save className="mr-2 h-4 w-4" /> Lưu điểm
                            </Button>
                        )}
                        {!isReviewMode && isBlankAutoAttempt && (
                            <span className="flex items-center text-xs text-muted-foreground italic">
                                Bài tự thu không có câu trả lời — không cần chấm điểm.
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
