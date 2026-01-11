import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Eye, FileText, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { submissionService } from '../../services/submissionService';
import { SubmissionListItemResponse, SubmissionStatusEnum } from '../../types/submission.types';
import { Skeleton } from '@/components/ui/skeleton';

interface SubmissionListProps {
    exerciseId: string;
    onSelectSubmission: (submissionId: string) => void;
}

export const SubmissionList: React.FC<SubmissionListProps> = ({
    exerciseId,
    onSelectSubmission
}) => {
    const [submissions, setSubmissions] = useState<SubmissionListItemResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setIsLoading(true);
                const data = await submissionService.listByExercise(exerciseId);
                setSubmissions(data);
            } catch (err) {
                toast.error("Error", {
                    description: "Failed to load submissions"
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, [exerciseId]);

    if (isLoading) {
        return (
            <Card className="animate-in fade-in duration-500">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-0">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                    Student Submissions ({submissions.length})
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-4">
                {submissions.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                        <div className="flex justify-center">
                            <div className="bg-muted p-4 rounded-full">
                                <FileText className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                        </div>
                        <p className="text-muted-foreground">Chưa có bài nộp nào.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="h-10 hover:bg-transparent">
                                <TableHead className="py-2 px-4">Student</TableHead>
                                <TableHead className="py-2 px-4">Status</TableHead>
                                <TableHead className="py-2 px-4">Submitted At</TableHead>
                                <TableHead className="py-2 px-4 text-center">MCQ</TableHead>
                                <TableHead className="py-2 px-4 text-center">Essay</TableHead>
                                <TableHead className="py-2 px-4 text-center">Total</TableHead>
                                <TableHead className="py-2 px-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.map((sub) => (
                                <TableRow key={sub.id} className="h-12 hover:bg-muted/50 transition-colors">
                                    <TableCell className="py-1 px-4 font-medium">
                                        {sub.studentName || sub.studentId}
                                    </TableCell>
                                    <TableCell className="py-1 px-4">
                                        <Badge variant={
                                            sub.status === SubmissionStatusEnum.GRADED ? 'default' :
                                                sub.status === SubmissionStatusEnum.SUBMITTED ? 'secondary' :
                                                    sub.status === SubmissionStatusEnum.PENDING ? 'outline' : 'secondary'
                                        } className={`px-2 py-0 h-5 text-[10px] ${sub.status === SubmissionStatusEnum.PENDING ? 'border-orange-200 text-orange-600 bg-orange-50 dark:bg-orange-950/20' : ''}`}>
                                            {sub.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-1 px-4 text-xs text-muted-foreground">
                                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('vi-VN') : '-'}
                                    </TableCell>
                                    <TableCell className="py-1 px-4 text-center text-xs font-semibold">{sub.mcqScore ?? '-'}</TableCell>
                                    <TableCell className="py-1 px-4 text-center text-xs">
                                        {sub.status === SubmissionStatusEnum.GRADED ? (
                                            <span className="font-semibold text-yellow-600 dark:text-yellow-500">{sub.essayScore}</span>
                                        ) : sub.status === SubmissionStatusEnum.PENDING ? (
                                            <span className="text-muted-foreground/40 italic text-[10px]">Unstarted</span>
                                        ) : (
                                            <span className="text-muted-foreground italic text-[10px]">Pending</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-1 px-4 font-black text-center text-sm text-primary">
                                        {sub.totalScore ?? '-'}
                                    </TableCell>
                                    <TableCell className="py-1 px-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => onSelectSubmission(sub.id)}
                                            disabled={sub.status === SubmissionStatusEnum.PENDING}
                                            title={sub.status === SubmissionStatusEnum.GRADED ? "View" : sub.status === SubmissionStatusEnum.PENDING ? "Not started" : "Grade"}
                                        >
                                            {sub.status === SubmissionStatusEnum.GRADED ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <FileText className={`h-4 w-4 ${sub.status === SubmissionStatusEnum.PENDING ? 'opacity-20' : ''}`} />
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};
