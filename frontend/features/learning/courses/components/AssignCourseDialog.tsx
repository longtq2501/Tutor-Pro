'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Loader2, Users, Check, Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useStudents } from '../../lessons/hooks/useStudents';
import { useCourseAssignments, useAssignCourse, useUnassignCourse } from '../hooks/useAdminCourses';
import type { CourseDTO } from '../types';
import { cn } from '@/lib/utils';

interface AssignCourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: CourseDTO;
}

export function AssignCourseDialog({
    open,
    onOpenChange,
    course,
}: AssignCourseDialogProps) {
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [deadline, setDeadline] = useState<Date | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: students = [], isLoading: isLoadingStudents } = useStudents();
    const { data: assignedStudents = [], isLoading: isLoadingAssigned } = useCourseAssignments(course.id);

    const assignMutation = useAssignCourse();
    const unassignMutation = useUnassignCourse();

    useEffect(() => {
        if (open && assignedStudents.length > 0) {
            setSelectedStudentIds(assignedStudents.map((a) => a.studentId));
        } else if (open) {
            setSelectedStudentIds([]);
        }
    }, [open, assignedStudents]);

    const handleToggleStudent = (studentId: number) => {
        setSelectedStudentIds((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSave = async () => {
        const currentAssignedIds = assignedStudents.map((a) => a.studentId);

        // Students to ADD
        const toAssign = selectedStudentIds.filter(id => !currentAssignedIds.includes(id));

        // Students to REMOVE
        const toUnassign = currentAssignedIds.filter(id => !selectedStudentIds.includes(id));

        try {
            if (toAssign.length > 0) {
                await assignMutation.mutateAsync({
                    id: course.id,
                    data: {
                        studentIds: toAssign,
                        deadline: deadline?.toISOString()
                    },
                });
            }

            for (const studentId of toUnassign) {
                await unassignMutation.mutateAsync({
                    courseId: course.id,
                    studentId: studentId
                });
            }

            onOpenChange(false);
        } catch (error) {
            // Errors handled by hooks
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.phone && s.phone.includes(searchQuery))
    );

    const isSaving = assignMutation.isPending || unassignMutation.isPending;
    const hasChanges = JSON.stringify([...selectedStudentIds].sort()) !==
        JSON.stringify(assignedStudents.map(a => a.studentId).sort()) ||
        deadline !== undefined;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Users className="h-6 w-6 text-primary" />
                        Giao khóa học
                    </DialogTitle>
                    <DialogDescription>
                        Chọn học sinh và đặt hạn hoàn thành cho khóa học "{course.title}"
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto p-6 pt-4 flex flex-col gap-4">
                    {/* Deadline Picker */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            Hạn hoàn thành (Tùy chọn)
                        </Label>
                        <DatePicker
                            value={deadline}
                            onChange={setDeadline}
                            placeholder="Chọn ngày hết hạn..."
                        />
                    </div>

                    <Separator />

                    {/* Search & Stats */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm tên hoặc SĐT học sinh..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                Tổng cộng: <span className="font-medium text-foreground">{students.length}</span> học sinh
                            </span>
                            <Badge variant="secondary">
                                Đã chọn: {selectedStudentIds.length}
                            </Badge>
                        </div>
                    </div>

                    {/* Student List */}
                    <ScrollArea className="h-[280px] border rounded-md p-2">
                        {isLoadingStudents || isLoadingAssigned ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                Không tìm thấy học sinh nào
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredStudents.map((student) => {
                                    const isSelected = selectedStudentIds.includes(student.id);
                                    const isAlreadyAssigned = assignedStudents.some(a => a.studentId === student.id);

                                    return (
                                        <div
                                            key={student.id}
                                            className={cn(
                                                "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-accent",
                                                isSelected && "bg-primary/5 border-primary/30"
                                            )}
                                            onClick={() => handleToggleStudent(student.id)}
                                        >
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => handleToggleStudent(student.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium leading-none">{student.name}</p>
                                                    {isAlreadyAssigned && (
                                                        <Badge variant="outline" className="text-[10px] h-5 bg-background">
                                                            <Check className="h-3 w-3 mr-1" /> Đã giao
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {student.phone || 'Chưa cập nhật SĐT'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className="p-6 pt-2 bg-muted/20 border-t">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
