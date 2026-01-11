'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ImportExercise } from '@/features/exercise-import/ImportExercise';
import { ExerciseListItemResponse } from '@/features/exercise-import/types/exercise.types';
import { ExercisePlayer } from '@/features/submission/components/student/ExercisePlayer';
import { TeacherGradingDashboard } from '@/features/submission/components/teacher/TeacherGradingDashboard';
import { GradingView } from '@/features/submission/components/teacher/GradingView';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExerciseList } from './components/ExerciseList';
import { TutorStudentGrid } from './components/TutorStudentGrid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, Library } from 'lucide-react';
import { StudentDetailView } from './components/StudentDetailView';
import { TutorStudentSummaryResponse } from '@/features/exercise-import/types/exercise.types';

type ViewMode = 'LIST' | 'IMPORT' | 'PLAY' | 'GRADE' | 'REVIEW';

export default function ExerciseDashboard() {
    const { user, hasAnyRole } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('LIST');
    const [activeTab, setActiveTab] = useState<'STUDENTS' | 'LIBRARY'>('STUDENTS');
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<TutorStudentSummaryResponse | null>(null);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

    const isTeacher = hasAnyRole(['ADMIN', 'TUTOR']);
    const role = isTeacher ? 'TEACHER' : 'STUDENT';

    const handleSelectExercise = (ex: ExerciseListItemResponse, action: 'PLAY' | 'GRADE' | 'EDIT' | 'REVIEW') => {
        console.log("handleSelectExercise triggered:", { exerciseId: ex.id, action });
        setSelectedExerciseId(ex.id);
        if (action === 'PLAY') setViewMode('PLAY');
        if (action === 'GRADE') setViewMode('GRADE');
        if (action === 'REVIEW') setViewMode('REVIEW');
    };

    const handleBack = () => {
        setViewMode('LIST');
        setSelectedExerciseId(null);
        setSelectedSubmissionId(null);
    };

    if (!user) return null;

    // 1. IMPORT/CREATE MODE (Teacher only)
    if (viewMode === 'IMPORT' && isTeacher) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={handleBack} className="mb-2">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                </Button>
                <ImportExercise />
            </div>
        );
    }

    // 2. PLAY MODE (Student)
    if (viewMode === 'PLAY' && selectedExerciseId) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={handleBack} className="mb-2">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                </Button>
                <ExercisePlayer
                    exerciseId={selectedExerciseId}
                    studentId={String(user.id)}
                    onExit={handleBack}
                />
            </div>
        );
    }

    // 3. GRADE MODE (Teacher)
    if (viewMode === 'GRADE' && (selectedExerciseId || selectedSubmissionId) && isTeacher) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                    </Button>
                    <h2 className="text-xl font-semibold">
                        {selectedSubmissionId ? 'Chấm điểm bài làm' : 'Chấm điểm bài tập'}
                    </h2>
                </div>
                {selectedSubmissionId ? (
                    <GradingView
                        submissionId={selectedSubmissionId}
                        onBack={handleBack}
                        isReviewMode={false}
                    />
                ) : (
                    <TeacherGradingDashboard exerciseId={selectedExerciseId!} />
                )}
            </div>
        );
    }

    // 4. REVIEW MODE (Student/Teacher preview)
    if (viewMode === 'REVIEW' && (selectedExerciseId || selectedSubmissionId)) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={handleBack} className="mb-2">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                </Button>
                <GradingView
                    submissionId={(selectedSubmissionId || selectedExerciseId)!}
                    onBack={handleBack}
                    isReviewMode={true}
                />
            </div>
        );
    }

    // 4. LIST MODE (Default)
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Hệ thống Khảo thí</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isTeacher
                            ? "Quản lý ngân hàng câu hỏi, bài tập và theo dõi tiến độ học sinh."
                            : "Danh sách bài tập và bài kiểm tra dành cho bạn."}
                    </p>
                </div>
            </div>

            {isTeacher ? (
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full space-y-6">
                    <div className="flex justify-between items-center border-b pb-1">
                        <TabsList className="bg-transparent h-auto p-0 gap-6">
                            <TabsTrigger
                                value="STUDENTS"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-sm font-semibold transition-all"
                            >
                                <Users className="h-4 w-4 mr-2" /> Theo học sinh
                            </TabsTrigger>
                            <TabsTrigger
                                value="LIBRARY"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-sm font-semibold transition-all"
                            >
                                <Library className="h-4 w-4 mr-2" /> Thư viện bài tập
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex gap-2">
                            {/* Actions based on active tab could go here */}
                        </div>
                    </div>

                    <TabsContent value="STUDENTS" className="mt-0 outline-none">
                        {selectedStudent ? (
                            <StudentDetailView
                                studentSummary={selectedStudent}
                                onBack={() => setSelectedStudent(null)}
                                onViewExercise={(ex, action) => {
                                    if (action === 'GRADE') {
                                        setSelectedSubmissionId(ex.submissionId || '');
                                        setViewMode('GRADE');
                                    } else if (action === 'REVIEW') {
                                        setSelectedSubmissionId(ex.submissionId || '');
                                        setViewMode('REVIEW');
                                    }
                                }}
                            />
                        ) : (
                            <TutorStudentGrid onSelectStudent={setSelectedStudent} />
                        )}
                    </TabsContent>

                    <TabsContent value="LIBRARY" className="mt-0 outline-none">
                        <ExerciseList
                            role={role}
                            onSelectExercise={handleSelectExercise}
                            onCreateNew={() => setViewMode('IMPORT')}
                        />
                    </TabsContent>
                </Tabs>
            ) : (
                <ExerciseList
                    role={role}
                    onSelectExercise={handleSelectExercise}
                />
            )}
        </div>
    );
}
