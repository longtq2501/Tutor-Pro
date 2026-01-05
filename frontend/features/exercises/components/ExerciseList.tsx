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
import { exerciseService } from '@/features/exercise-import/services/exerciseService';
import { ExerciseListItemResponse, ExerciseStatus } from '@/features/exercise-import/types/exercise.types';
import { format } from 'date-fns';
import { Edit, FileText, Loader2, Play, Plus, Trash2, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { formatExerciseTitle } from '@/lib/utils';
import { studentsApi } from '@/lib/services/student';
import { Student } from '@/lib/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useExercises, useAssignedExercises } from '../hooks/useExercises';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/hooks/useQueryKeys';

interface ExerciseListProps {
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    onSelectExercise: (exercise: ExerciseListItemResponse, action: 'PLAY' | 'GRADE' | 'EDIT' | 'REVIEW') => void;
    onCreateNew?: () => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
    role,
    onSelectExercise,
    onCreateNew
}) => {
    const queryClient = useQueryClient();
    const isStudent = role === 'STUDENT';

    // ⚡ React Query hooks
    const { data: exercises = [], isLoading: isExercisesLoading } = isStudent
        ? useAssignedExercises()
        : useExercises();

    // Students list for assign dialog (Keep as useQuery for consistency)
    const { data: students = [], isLoading: isStudentsLoading } = useQuery({
        queryKey: queryKeys.students.all,
        queryFn: async () => {
            const data = await studentsApi.getAll();
            return data.filter(s => s.active && s.accountId);
        },
        enabled: !isStudent
    });

    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseListItemResponse | null>(null);
    const [assignStudentId, setAssignStudentId] = useState<string>('');
    const [assignDeadline, setAssignDeadline] = useState<string>('');
    const [isAssigning, setIsAssigning] = useState(false);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this exercise?")) return;
        try {
            await exerciseService.delete(id);
            toast.success("Exercise deleted");
            queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all });
        } catch (error) {
            toast.error("Failed to delete exercise");
        }
    };

    const handleOpenAssign = (ex: ExerciseListItemResponse, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedExercise(ex);
        setAssignDeadline(ex.deadline ? new Date(ex.deadline).toISOString().slice(0, 16) : '');
        setIsAssignDialogOpen(true);
    };

    const handleAssign = async () => {
        if (!selectedExercise || !assignStudentId) return;
        try {
            setIsAssigning(true);
            await exerciseService.assign(selectedExercise.id, {
                studentId: assignStudentId,
                deadline: assignDeadline ? new Date(assignDeadline).toISOString() : undefined
            });
            toast.success("Đã giao bài tập thành công");
            setIsAssignDialogOpen(false);
            setAssignStudentId('');
            setAssignDeadline('');
            queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all });
        } catch (error) {
            toast.error("Không thể giao bài tập");
        } finally {
            setIsAssigning(false);
        }
    };

    // ✨ Professional Loading State (Skeletons)
    if (isExercisesLoading) {
        return (
            <Card className="animate-in fade-in duration-500">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-8 w-24" />
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-dashed last:border-0">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-64" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                    Danh sách bài tập ({exercises.length})
                    {isExercisesLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </CardTitle>
                {(role === 'TEACHER' || role === 'ADMIN') && (
                    <Button onClick={onCreateNew} size="sm" className="h-8 shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Tạo mới
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-0 sm:p-4">
                {exercises.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                        <div className="flex justify-center">
                            <div className="bg-muted p-4 rounded-full">
                                <FileText className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                        </div>
                        <p className="text-muted-foreground">Chưa có bài tập nào.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop: Table VIEW */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="py-2 px-4">Tiêu đề</TableHead>
                                        <TableHead className="py-2 px-4">Trạng thái</TableHead>
                                        <TableHead className="py-2 px-4">Thời gian</TableHead>
                                        <TableHead className="py-2 px-4">Điểm</TableHead>
                                        <TableHead className="py-2 px-4">Ngày tạo</TableHead>
                                        <TableHead className="py-2 px-4 text-right">Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {exercises.map((ex) => (
                                        <TableRow key={ex.id} className="cursor-pointer group hover:bg-muted/50 transition-colors" onClick={() => {
                                            if (role === 'STUDENT') onSelectExercise(ex, 'PLAY');
                                            else onSelectExercise(ex, 'GRADE');
                                        }}>
                                            <TableCell className="py-2 px-4 font-medium max-w-[350px]">
                                                <div className="whitespace-pre-wrap leading-tight text-sm group-hover:text-primary transition-colors">
                                                    {formatExerciseTitle(ex.title)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-1 px-4">
                                                <Badge variant={ex.status === ExerciseStatus.PUBLISHED ? 'default' : 'secondary'} className="px-2 py-0 h-5 text-[10px]">
                                                    {ex.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-1 px-4 text-xs">{ex.timeLimit ? `${ex.timeLimit}p` : '∞'}</TableCell>
                                            <TableCell className="py-1 px-4 text-xs font-bold">{ex.totalPoints}</TableCell>
                                            <TableCell className="py-1 px-4 text-xs text-muted-foreground">{ex.createdAt ? format(new Date(ex.createdAt), 'dd/MM/yyyy') : '-'}</TableCell>
                                            <TableCell className="py-1 px-4 text-right">
                                                <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    {role === 'STUDENT' ? (
                                                        <div className="flex gap-2">
                                                            {ex.submissionId && (ex.submissionStatus === 'SUBMITTED' || ex.submissionStatus === 'GRADED') ? (
                                                                <Button size="sm" variant="outline" className="h-8" onClick={(e) => { e.stopPropagation(); onSelectExercise({ ...ex, id: ex.submissionId! }, 'REVIEW'); }}>
                                                                    <FileText className="mr-2 h-4 w-4" /> Xem kết quả
                                                                </Button>
                                                            ) : null}
                                                            <Button size="sm" className="h-8 shadow-sm" onClick={(e) => { e.stopPropagation(); onSelectExercise(ex, 'PLAY'); }}>
                                                                <Play className="mr-2 h-4 w-4" /> {ex.submissionId ? 'Làm tiếp' : 'Làm bài'}
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleOpenAssign(ex, e)} title="Giao bài">
                                                                <UserPlus className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onSelectExercise(ex, 'GRADE'); }}>
                                                                <FileText className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={(e) => handleDelete(ex.id, e)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile: Card View */}
                        <div className="md:hidden space-y-3 p-4">
                            {exercises.map((ex) => (
                                <Card key={ex.id} className="overflow-hidden border shadow-sm hover:border-primary/50 transition-all active:scale-[0.98]" onClick={() => {
                                    if (role === 'STUDENT') onSelectExercise(ex, 'PLAY');
                                    else onSelectExercise(ex, 'GRADE');
                                }}>
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-sm leading-tight text-foreground whitespace-pre-wrap pr-2">
                                                {formatExerciseTitle(ex.title)}
                                            </h3>
                                            <Badge variant={ex.status === ExerciseStatus.PUBLISHED ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                                                {ex.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-2 text-[11px] text-muted-foreground border-y py-2 border-dashed">
                                            <div className="flex items-center">
                                                <span className="w-16">Thời gian:</span>
                                                <span className="font-medium text-foreground">{ex.timeLimit ? `${ex.timeLimit}p` : '∞'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-16">Điểm:</span>
                                                <span className="font-bold text-foreground">{ex.totalPoints}</span>
                                            </div>
                                            <div className="flex items-center col-span-2">
                                                <span className="w-16">Ngày tạo:</span>
                                                <span className="text-foreground">{ex.createdAt ? format(new Date(ex.createdAt), 'dd/MM/yyyy') : '-'}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 pt-1">
                                            {role === 'STUDENT' ? (
                                                <>
                                                    {ex.submissionId && (ex.submissionStatus === 'SUBMITTED' || ex.submissionStatus === 'GRADED') && (
                                                        <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={(e) => { e.stopPropagation(); onSelectExercise({ ...ex, id: ex.submissionId! }, 'REVIEW'); }}>
                                                            <FileText className="mr-1.5 h-3.5 w-3.5" /> Xem kết quả
                                                        </Button>
                                                    )}
                                                    <Button size="sm" className="w-full text-xs h-8 shadow-sm" onClick={(e) => { e.stopPropagation(); onSelectExercise(ex, 'PLAY'); }}>
                                                        <Play className="mr-1.5 h-3.5 w-3.5" /> {ex.submissionId ? 'Làm tiếp' : 'Làm bài'}
                                                    </Button>
                                                </>
                                            ) : (
                                                <div className="flex gap-2 w-full">
                                                    <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={(e) => handleOpenAssign(ex, e)}>
                                                        <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Giao
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={(e) => { e.stopPropagation(); onSelectExercise(ex, 'GRADE'); }}>
                                                        <FileText className="mr-1.5 h-3.5 w-3.5" /> Chấm
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500 h-8 w-8 p-0" onClick={(e) => handleDelete(ex.id, e)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>

            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Giao bài tập</DialogTitle>
                        <DialogDescription>
                            Chọn học sinh để giao bài tập "{selectedExercise?.title}"
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="student">Học sinh</Label>
                            <Select onValueChange={setAssignStudentId} value={assignStudentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder={isStudentsLoading ? "Đang tải..." : "Chọn học sinh"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map(s => (
                                        <SelectItem key={s.id} value={s.accountId || ''}>
                                            {s.name} ({s.accountEmail})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline">Hạn chót (Tùy chọn)</Label>
                            <Input
                                id="deadline"
                                type="datetime-local"
                                value={assignDeadline}
                                onChange={(e) => setAssignDeadline(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleAssign} disabled={!assignStudentId || isAssigning}>
                            {isAssigning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang giao...
                                </>
                            ) : "Giao bài tập"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};
