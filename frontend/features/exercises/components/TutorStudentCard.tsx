import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, PencilLine, CheckCircle2 } from 'lucide-react';
import { TutorStudentSummaryResponse } from '@/features/exercise-import/types/exercise.types';

interface TutorStudentCardProps {
    student: TutorStudentSummaryResponse;
    onClick: (student: TutorStudentSummaryResponse) => void;
}

export const TutorStudentCard: React.FC<TutorStudentCardProps> = ({ student, onClick }) => {
    const completionPercentage = student.totalAssigned > 0
        ? (student.gradedCount / student.totalAssigned) * 100
        : 0;

    return (
        <Card
            className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer"
            onClick={() => onClick(student)}
        >
            <CardHeader className="p-4 flex flex-row items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {student.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                        {student.studentName}
                    </CardTitle>
                    <p className="text-[11px] text-muted-foreground">Lớp: {student.grade || 'N/A'}</p>
                </div>
                <Badge variant="outline" className="text-[10px] h-5">
                    {student.totalAssigned} Bài tập
                </Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-4 pt-0">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-medium text-muted-foreground px-0.5">
                        <span>Tiến độ hoàn thành</span>
                        <span>{Math.round(completionPercentage)}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-1.5" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-orange-50 dark:bg-orange-950/20 rounded-md p-2 flex flex-col items-center">
                        <Clock className="h-3 w-3 text-orange-500 mb-1" />
                        <span className="text-xs font-bold leading-none">{student.pendingCount}</span>
                        <span className="text-[9px] text-muted-foreground">Pending</span>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-md p-2 flex flex-col items-center">
                        <PencilLine className="h-3 w-3 text-blue-500 mb-1" />
                        <span className="text-xs font-bold leading-none">{student.submittedCount}</span>
                        <span className="text-[9px] text-muted-foreground">Submitted</span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/20 rounded-md p-2 flex flex-col items-center">
                        <CheckCircle2 className="h-3 w-3 text-green-500 mb-1" />
                        <span className="text-xs font-bold leading-none">{student.gradedCount}</span>
                        <span className="text-[9px] text-muted-foreground">Graded</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
