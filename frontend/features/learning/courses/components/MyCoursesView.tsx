'use client';

import React from 'react';
import { useMyCourses } from '../hooks/useStudentCourses';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Clock, ChevronRight, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MyCoursesViewProps {
    onCourseSelect: (courseId: number) => void;
}

export default function MyCoursesView({ onCourseSelect }: MyCoursesViewProps) {
    const { data: courses = [], isLoading } = useMyCourses();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">Chưa có khóa học nào</CardTitle>
                    <CardDescription className="max-w-xs">
                        Bạn chưa được giao lộ trình học tập nào. Hãy liên hệ với gia sư để được cấp quyền truy cập.
                    </CardDescription>
                </CardContent>
            </Card>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'Đã hoàn thành';
            case 'IN_PROGRESS': return 'Đang học';
            case 'NOT_STARTED': return 'Chưa bắt đầu';
            default: return status;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((assignment) => (
                <Card key={assignment.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden flex flex-col">
                    <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-background relative overflow-hidden">
                        <div className="absolute top-4 right-4">
                            <Badge className={cn("font-medium border shadow-sm", getStatusColor(assignment.status))}>
                                {getStatusText(assignment.status)}
                            </Badge>
                        </div>
                        <BookOpen className="absolute -bottom-4 -left-4 h-24 w-24 text-primary/10 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <CardHeader className="space-y-1">
                        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                            {assignment.courseTitle}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            Giao ngày {new Date(assignment.assignedDate).toLocaleDateString('vi-VN')}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                        <div className="space-y-3">
                            <div className="flex justify-between items-end text-sm">
                                <span className="text-muted-foreground font-medium">Tiến độ</span>
                                <span className="text-primary font-bold">{assignment.progressPercentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000 ease-out"
                                    style={{ width: `${assignment.progressPercentage}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-0 border-t bg-muted/50 mt-auto">
                        <Button
                            variant="ghost"
                            className="w-full justify-between hover:bg-primary hover:text-primary-foreground group/btn transition-all mt-4"
                            onClick={() => onCourseSelect(assignment.courseId)}
                        >
                            <span>Tiếp tục học</span>
                            <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
