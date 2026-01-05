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
import { Eye, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { submissionService } from '../../services/submissionService';
import { SubmissionListItemResponse } from '../../types/submission.types';

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
        return <div className="text-center p-8">Loading submissions...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Student Submissions ({submissions.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-4">
                {submissions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No submissions yet.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="h-10 hover:bg-transparent">
                                <TableHead className="py-2 px-4">Student</TableHead>
                                <TableHead className="py-2 px-4">Status</TableHead>
                                <TableHead className="py-2 px-4">Submitted At</TableHead>
                                <TableHead className="py-2 px-4">MCQ</TableHead>
                                <TableHead className="py-2 px-4">Essay</TableHead>
                                <TableHead className="py-2 px-4 text-center">Total</TableHead>
                                <TableHead className="py-2 px-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.map((sub) => (
                                <TableRow key={sub.id} className="h-10">
                                    <TableCell className="py-1 px-4 font-medium">
                                        {sub.studentName || sub.studentId}
                                    </TableCell>
                                    <TableCell className="py-1 px-4 text-xs">
                                        <Badge variant={
                                            sub.status === 'GRADED' ? 'default' :
                                                sub.status === 'SUBMITTED' ? 'secondary' : 'outline'
                                        } className="px-2 py-0 h-5">
                                            {sub.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-1 px-4 text-xs text-muted-foreground">
                                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : '-'}
                                    </TableCell>
                                    <TableCell className="py-1 px-4 text-center">{sub.mcqScore ?? '-'}</TableCell>
                                    <TableCell className="py-1 px-4 text-center">
                                        {sub.status === 'GRADED' ? sub.essayScore : (
                                            <span className="text-muted-foreground italic text-[10px]">Pending</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-1 px-4 font-bold text-center">
                                        {sub.totalScore ?? '-'}
                                    </TableCell>
                                    <TableCell className="py-1 px-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => onSelectSubmission(sub.id)}
                                            title={sub.status === 'GRADED' ? "View" : "Grade"}
                                        >
                                            {sub.status === 'GRADED' ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <FileText className="h-4 w-4" />
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
