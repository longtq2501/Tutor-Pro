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
import { Edit, FileText, Play, Plus, Trash2, UserPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
    const [exercises, setExercises] = useState<ExerciseListItemResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseListItemResponse | null>(null);
    const [assignStudentId, setAssignStudentId] = useState<string>('');
    const [assignDeadline, setAssignDeadline] = useState<string>('');
    const [isAssigning, setIsAssigning] = useState(false);

    const loadExercises = async () => {
        try {
            setIsLoading(true);
            let data: ExerciseListItemResponse[];

            if (role === 'STUDENT') {
                data = await exerciseService.getAssigned();
                setExercises(data);
            } else {
                data = await exerciseService.getAll();
                setExercises(data);
            }
        } catch (error) {
            toast.error("Failed to load exercises");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadExercises();
        if (role !== 'STUDENT') {
            loadStudents();
        }
    }, [role]);

    const loadStudents = async () => {
        try {
            const data = await studentsApi.getAll();
            setStudents(data.filter(s => s.active && s.accountId)); // Only active students with accounts
        } catch (error) {
            console.error("Failed to load students", error);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this exercise?")) return;
        try {
            await exerciseService.delete(id);
            toast.success("Exercise deleted");
            loadExercises();
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
        } catch (error) {
            toast.error("Không thể giao bài tập");
        } finally {
            setIsAssigning(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading exercises...</div>;
    }

    return (
        <Card>
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
                <CardTitle className="text-lg">Danh sách bài tập ({exercises.length})</CardTitle>
                {(role === 'TEACHER' || role === 'ADMIN') && (
                    <Button onClick={onCreateNew} size="sm" className="h-8">
                        <Plus className="mr-2 h-4 w-4" /> Tạo mới
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-0 sm:p-4">
                {exercises.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Chưa có bài tập nào.
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
                                        <TableRow key={ex.id} className="cursor-pointer hover:bg-muted/50" onClick={() => {
                                            console.log("Exercise row clicked:", ex.id, "Title:", ex.title);
                                            if (role === 'STUDENT') onSelectExercise(ex, 'PLAY');
                                            else onSelectExercise(ex, 'GRADE');
                                        }}>
                                            <TableCell className="py-2 px-4 font-medium max-w-[350px]">
                                                <div className="whitespace-pre-wrap leading-tight text-sm">{formatExerciseTitle(ex.title)}</div>
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
                                                <div className="flex justify-end gap-2">
                                                    {role === 'STUDENT' ? (
                                                        <div className="flex gap-2">
                                                            {ex.submissionId && (ex.submissionStatus === 'SUBMITTED' || ex.submissionStatus === 'GRADED') ? (
                                                                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onSelectExercise({ ...ex, id: ex.submissionId! }, 'REVIEW'); }}>
                                                                    <FileText className="mr-2 h-4 w-4" /> Xem kết quả
                                                                </Button>
                                                            ) : null}
                                                            <Button size="sm" onClick={(e) => { e.stopPropagation(); onSelectExercise(ex, 'PLAY'); }}>
                                                                <Play className="mr-2 h-4 w-4" /> {ex.submissionId ? 'Làm tiếp' : 'Làm bài'}
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Button variant="ghost" size="icon" onClick={(e) => handleOpenAssign(ex, e)} title="Giao bài">
                                                                <UserPlus className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onSelectExercise(ex, 'GRADE'); }}>
                                                                <FileText className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={(e) => handleDelete(ex.id, e)}>
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
                                <Card key={ex.id} className="overflow-hidden border shadow-sm" onClick={() => {
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
                                                    <Button size="sm" className="w-full text-xs h-8" onClick={(e) => { e.stopPropagation(); onSelectExercise(ex, 'PLAY'); }}>
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
                                    <SelectValue placeholder="Chọn học sinh" />
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
                            {isAssigning ? "Đang giao..." : "Giao bài tập"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};
