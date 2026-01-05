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

type ViewMode = 'LIST' | 'IMPORT' | 'PLAY' | 'GRADE' | 'REVIEW';

export default function ExerciseDashboard() {
    const { user, hasAnyRole } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('LIST');
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

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
    if (viewMode === 'GRADE' && selectedExerciseId && isTeacher) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                    </Button>
                    <h2 className="text-xl font-semibold">Chấm điểm bài tập</h2>
                </div>
                <TeacherGradingDashboard exerciseId={selectedExerciseId} />
            </div>
        );
    }

    // 4. REVIEW MODE (Student)
    if (viewMode === 'REVIEW' && selectedExerciseId) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={handleBack} className="mb-2">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                </Button>
                <GradingView
                    submissionId={selectedExerciseId} // Note: This will need to be the SUBMISSION ID, not exercise ID
                    onBack={handleBack}
                    isReviewMode={true}
                />
            </div>
        );
    }

    // 4. LIST MODE (Default)
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Hệ thống Khảo thí</h1>
                    <p className="text-muted-foreground">
                        {isTeacher
                            ? "Quản lý ngân hàng câu hỏi, bài tập và chấm điểm."
                            : "Danh sách bài tập và bài kiểm tra của bạn."}
                    </p>
                </div>
            </div>

            <ExerciseList
                role={role}
                onSelectExercise={handleSelectExercise}
                onCreateNew={() => setViewMode('IMPORT')}
            />
        </div>
    );
}
