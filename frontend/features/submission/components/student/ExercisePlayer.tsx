import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { exerciseService } from '@/features/exercise-import/services/exerciseService';
import { Exercise, QuestionType } from '@/features/exercise-import/types/exercise.types';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Save, Menu } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { submissionService } from '../../services/submissionService';
import { CreateSubmissionRequest, SubmissionResponse } from '../../types/submission.types';
import { EssayQuestion } from './EssayQuestion';
import { MCQQuestion } from './MCQQuestion';
import { QuestionNav } from './QuestionNav';
import { useAutoSave } from '../../hooks/useAutoSave';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn, formatExerciseTitle } from '@/lib/utils';

interface ExercisePlayerProps {
    exerciseId: string;
    studentId?: string;
    onExit?: () => void;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ exerciseId, studentId, onExit }) => {
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, { selectedOption?: string; essayText?: string }>>(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    // Auto-save hook (Must be at top level, not conditional)
    const { isSaving, lastSaved } = useAutoSave(exerciseId, answers);

    // Fetch exercise and existing submission
    useEffect(() => {
        const fetchData = async () => {
            try {
                const exerciseData = await exerciseService.getById(exerciseId);
                setExercise(exerciseData);

                if (exerciseData.timeLimit) {
                    // TODO: Calculate remaining time based on start time if already started
                    // For now, simple reset
                    setTimeLeft(exerciseData.timeLimit * 60);
                }

                // Try load draft if studentId is present
                if (studentId) {
                    try {
                        const submission = await submissionService.getByExerciseAndStudent(exerciseId, studentId);
                        if (submission) {
                            // Rehydrate answers
                            const answerMap = new Map();
                            submission.answers.forEach(a => {
                                answerMap.set(a.questionId, {
                                    selectedOption: a.selectedOption,
                                    essayText: a.essayText
                                });
                            });
                            setAnswers(answerMap);
                            if (submission.status !== 'DRAFT') {
                                setSubmissionResult(submission);
                            }
                        }
                    } catch (e) {
                        // No submission found, ignore
                    }
                }
            } catch (err) {
                toast.error("Error", {
                    description: "Failed to load exercise"
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [exerciseId, studentId]);

    // Timer
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || submissionResult) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null || prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, submissionResult]);

    // Auto-submit on timeout
    useEffect(() => {
        if (timeLeft === 0 && !submissionResult && !isSubmitting) {
            handleSubmit();
            toast.warning("Hết giờ!", {
                description: "Bài làm của bạn đã được tự động nộp."
            });
        }
    }, [timeLeft, submissionResult, isSubmitting]);

    const handleAnswerChange = (questionId: string, value: any) => {
        const newAnswers = new Map(answers);
        const current = newAnswers.get(questionId) || {};
        newAnswers.set(questionId, { ...current, ...value });
        setAnswers(newAnswers);
    };

    const handleSaveDraft = async () => {
        if (!exercise) return;
        try {
            const request: CreateSubmissionRequest = {
                exerciseId: exercise.id,
                answers: Array.from(answers.entries()).map(([qId, val]) => ({
                    questionId: qId,
                    ...val
                }))
            };
            await submissionService.saveDraft(request);
            toast("Lưu nháp thành công", {
                description: "Tiến độ của bạn đã được lưu."
            });
        } catch (e) {
            toast.error("Lỗi", {
                description: "Không thể lưu nháp"
            });
        }
    };

    const handleSubmit = async () => {
        if (!exercise) return;
        setIsSubmitting(true);
        try {
            const request: CreateSubmissionRequest = {
                exerciseId: exercise.id,
                answers: Array.from(answers.entries()).map(([qId, val]) => ({
                    questionId: qId,
                    ...val
                }))
            };
            const result = await submissionService.submit(request);
            setSubmissionResult(result);
            toast.success("Nộp bài thành công!", {
                description: `Bạn đạt ${result.mcqScore} điểm trắc nghiệm.`
            });
        } catch (e) {
            toast.error("Lỗi", {
                description: "Không thể nộp bài"
            });
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
    if (!exercise) return <div className="p-8 text-center text-muted-foreground">Không tìm thấy bài tập</div>;

    if (submissionResult) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <Card className="max-w-2xl w-full mx-4 shadow-lg border-2 border-primary/20 bg-card">
                    <CardContent className="pt-10 pb-8 text-center space-y-8">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                            <CheckCircle className="h-24 w-24 text-green-500 relative z-10 mx-auto" />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-2">Hoàn Thành!</h2>
                            <p className="text-muted-foreground">Bài làm của bạn đã được ghi nhận.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-muted/50 rounded-xl border">
                                <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Trắc nghiệm</div>
                                <div className="text-3xl font-bold text-primary">{submissionResult.mcqScore || 0}</div>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-xl border">
                                <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Tự luận</div>
                                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">
                                    {submissionResult.status === 'GRADED' ? (submissionResult.essayScore || 0) : '?'}
                                </div>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-xl border">
                                <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Tổng điểm</div>
                                <div className="text-3xl font-bold text-foreground">
                                    {submissionResult.totalScore || submissionResult.mcqScore}
                                </div>
                            </div>
                        </div>

                        {submissionResult.status !== 'GRADED' && (
                            <div className="bg-blue-500/10 text-blue-700 dark:text-blue-300 p-4 rounded-xl text-sm">
                                Các câu hỏi tự luận sẽ được giáo viên chấm điểm sau. Bạn sẽ nhận được thông báo khi có kết quả.
                            </div>
                        )}

                        <Button onClick={onExit} size="lg" className="w-full">Quay về trang chủ</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQuestion = exercise.questions?.[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / (exercise.questions?.length || 1)) * 100;
    const answeredCount = answers.size;
    const totalCount = exercise.questions?.length || 0;

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 border-b bg-card z-30 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-80">
                            <div className="flex flex-col h-full bg-card">
                                <SidebarContent
                                    exercise={exercise}
                                    currentQuestionIndex={currentQuestionIndex}
                                    setCurrentQuestionIndex={(idx: number) => {
                                        setCurrentQuestionIndex(idx);
                                        setIsMobileNavOpen(false);
                                    }}
                                    timeLeft={timeLeft}
                                    isSaving={isSaving}
                                    onSaveDraft={() => { handleSaveDraft(); setIsMobileNavOpen(false); }}
                                    onSubmit={() => { handleSubmit(); setIsMobileNavOpen(false); }}
                                    isSubmitting={isSubmitting}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <h2 className="font-bold text-sm whitespace-pre-wrap line-clamp-2 max-w-[200px] leading-tight">
                        {formatExerciseTitle(exercise.title)}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <div className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono font-bold border",
                        timeLeft && timeLeft < 300 ? "bg-red-500/10 text-red-600 border-red-500/20 animate-pulse" : "bg-primary/5 text-primary border-primary/20"
                    )}>
                        <Clock className="h-3.5 w-3.5" />
                        {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar (Left) */}
            <div className="hidden md:flex w-80 border-r bg-card flex-col shrink-0 h-full">
                <SidebarContent
                    exercise={exercise}
                    currentQuestionIndex={currentQuestionIndex}
                    setCurrentQuestionIndex={setCurrentQuestionIndex}
                    timeLeft={timeLeft}
                    isSaving={isSaving}
                    onSaveDraft={handleSaveDraft}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-background/50 h-full md:pt-0 pt-14">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-8">
                        {/* Question Badge and Nav (Mobile only) */}
                        <div className="md:hidden flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-[10px]">
                                Câu {currentQuestionIndex + 1} / {exercise?.questions?.length || 0}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                                {exercise?.questions?.[currentQuestionIndex]?.type === QuestionType.MCQ ? 'Trắc nghiệm' : 'Tự luận'}
                            </span>
                        </div>

                        <Card className="shadow-sm border-border/60">
                            <CardContent className="p-4 md:p-6">
                                {exercise?.questions?.[currentQuestionIndex]?.type === QuestionType.MCQ ? (
                                    <MCQQuestion
                                        question={exercise.questions[currentQuestionIndex]}
                                        selectedAnswer={answers.get(exercise.questions[currentQuestionIndex].id || '')?.selectedOption}
                                        onAnswerChange={(val) => handleAnswerChange(exercise.questions![currentQuestionIndex].id || '', { selectedOption: val })}
                                    />
                                ) : exercise?.questions?.[currentQuestionIndex] ? (
                                    <EssayQuestion
                                        question={exercise.questions[currentQuestionIndex]}
                                        essayText={answers.get(exercise.questions[currentQuestionIndex].id || '')?.essayText || ''}
                                        onTextChange={(val) => handleAnswerChange(exercise.questions![currentQuestionIndex].id || '', { essayText: val })}
                                    />
                                ) : null}
                            </CardContent>
                        </Card>

                        {/* Sticky Navigation Footer (Mobile) */}
                        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t p-3 flex gap-3 z-30">
                            <Button
                                variant="outline"
                                className="flex-1 h-10 text-xs"
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            >
                                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Trước
                            </Button>

                            {currentQuestionIndex < (exercise.questions?.length || 0) - 1 ? (
                                <Button
                                    className="flex-1 h-10 text-xs"
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                >
                                    Tiếp theo <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                </Button>
                            ) : (
                                <Button
                                    className="flex-1 h-10 text-xs bg-green-600 hover:bg-green-700 text-white"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    Nộp bài <CheckCircle className="ml-1.5 h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>

                        {/* Desktop Navigation Buttons */}
                        <div className="hidden md:flex justify-between items-center pt-4">
                            <Button
                                variant="outline"
                                size="lg"
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                className="w-32"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Trước
                            </Button>

                            <div className="flex gap-4">
                                {currentQuestionIndex < (exercise.questions?.length || 0) - 1 ? (
                                    <Button
                                        size="lg"
                                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                        className="w-40"
                                    >
                                        Tiếp theo <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        className="bg-green-600 hover:bg-green-700 text-white w-40"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        Nộp bài <CheckCircle className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for Sidebar Content
const SidebarContent = ({
    exercise,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    timeLeft,
    isSaving,
    onSaveDraft,
    onSubmit,
    isSubmitting,
    answers
}: any) => {
    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b flex-shrink-0">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">Làm bài tập</h2>
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono font-bold",
                            timeLeft && timeLeft < 300 ? "bg-red-500/10 text-red-600 animate-pulse" : "bg-primary/10 text-primary"
                        )}>
                            <Clock className="h-4 w-4" />
                            {timeLeft !== null ? formatTimeHelper(timeLeft) : '--:--'}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground font-medium">Tiến độ bài làm</span>
                            <span className="font-bold">{Math.round((currentQuestionIndex + 1) / (exercise.questions?.length || 1) * 100)}%</span>
                        </div>
                        <Progress value={((currentQuestionIndex + 1) / (exercise.questions?.length || 1)) * 100} className="h-1.5" />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <QuestionNav
                    questions={exercise.questions || []}
                    currentIndex={currentQuestionIndex}
                    answers={answers}
                    onQuestionClick={setCurrentQuestionIndex}
                />
            </div>

            <div className="p-4 border-t bg-muted/20 space-y-3 mt-auto flex-shrink-0">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-muted-foreground italic h-4">
                        {isSaving ? "Đang tự động lưu..." : "Đã lưu tất cả thay đổi"}
                    </span>
                </div>
                <Button variant="outline" className="w-full justify-start h-10 font-medium" onClick={onSaveDraft}>
                    <Save className="mr-2 h-4 w-4" /> Lưu nháp
                </Button>
                <Button
                    className="w-full bg-primary hover:bg-primary/90 h-11 font-bold text-base shadow-lg shadow-primary/20"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                >
                    <CheckCircle className="mr-2 h-5 w-5" /> Nộp bài
                </Button>
            </div>
        </div>
    );
};

const formatTimeHelper = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
