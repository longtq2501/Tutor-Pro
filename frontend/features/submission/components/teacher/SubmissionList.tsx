import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
    ArrowUpDown,
    Eye,
    FileText,
    Filter,
    Loader2,
    PenTool,
    RotateCcw,
    Search,
    X,
} from 'lucide-react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { submissionService } from '../../services/submissionService';
import { SubmissionListItemResponse, SubmissionStatusEnum } from '../../types/submission.types';
import {
    getScorePresentation,
    getSubmissionStatusPresentation,
    isAutoCollected,
    isBlankAutoCollected,
    needsManualGrading,
} from '../../constants/submissionStatus';
import { Skeleton } from '@/components/ui/skeleton';
import { SubmissionExceptionActions } from './SubmissionExceptionActions';

interface SubmissionListProps {
    exerciseId: string;
    onSelectSubmission: (submissionId: string) => void;
}

type SortOption =
    | 'submittedAt_desc'
    | 'submittedAt_asc'
    | 'name_asc'
    | 'name_desc'
    | 'score_desc'
    | 'score_asc';

export const SubmissionList: React.FC<SubmissionListProps> = ({
    exerciseId,
    onSelectSubmission,
}) => {
    const [submissions, setSubmissions] = useState<SubmissionListItemResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // FB-06: Filters and sorting state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [needsGradingOnly, setNeedsGradingOnly] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('submittedAt_desc');

    const fetchSubmissions = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await submissionService.listByExercise(exerciseId);
            setSubmissions(data);
        } catch {
            toast.error("Lỗi", {
                description: "Không thể tải danh sách bài nộp"
            });
        } finally {
            setIsLoading(false);
        }
    }, [exerciseId]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    // Count of submissions that need manual teacher grading
    const needsGradingCount = useMemo(() => {
        return submissions.filter(needsManualGrading).length;
    }, [submissions]);

    // Whether any non-default filter is active
    const hasActiveFilters = useMemo(() => {
        return (
            searchTerm.trim() !== '' ||
            statusFilter !== 'ALL' ||
            needsGradingOnly ||
            sortBy !== 'submittedAt_desc'
        );
    }, [searchTerm, statusFilter, needsGradingOnly, sortBy]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('ALL');
        setNeedsGradingOnly(false);
        setSortBy('submittedAt_desc');
    };

    // Filter and sort submissions
    const filteredSubmissions = useMemo(() => {
        return submissions
            .filter((sub) => {
                // Search term filter
                if (searchTerm.trim()) {
                    const query = searchTerm.trim().toLowerCase();
                    const name = (sub.studentName || '').toLowerCase();
                    const id = (sub.studentId || '').toLowerCase();
                    if (!name.includes(query) && !id.includes(query)) {
                        return false;
                    }
                }

                // Quick filter: needs manual grading
                if (needsGradingOnly && !needsManualGrading(sub)) {
                    return false;
                }

                // Status filter
                if (statusFilter !== 'ALL' && sub.status !== statusFilter) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'submittedAt_asc':
                        return new Date(a.submittedAt || 0).getTime() - new Date(b.submittedAt || 0).getTime();
                    case 'submittedAt_desc':
                        return new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime();
                    case 'name_asc':
                        return (a.studentName || a.studentId || '').localeCompare(b.studentName || b.studentId || '', 'vi');
                    case 'name_desc':
                        return (b.studentName || b.studentId || '').localeCompare(a.studentName || a.studentId || '', 'vi');
                    case 'score_desc':
                        return (b.totalScore ?? -1) - (a.totalScore ?? -1);
                    case 'score_asc':
                        return (a.totalScore ?? 9999) - (b.totalScore ?? 9999);
                    default:
                        return 0;
                }
            });
    }, [submissions, searchTerm, statusFilter, needsGradingOnly, sortBy]);

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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <span>Bài nộp của học sinh</span>
                        <Badge variant="secondary" className="text-xs font-semibold px-2">
                            {filteredSubmissions.length}/{submissions.length}
                        </Badge>
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    </CardTitle>

                    {/* Quick filter: Needs manual grading */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant={needsGradingOnly ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNeedsGradingOnly(!needsGradingOnly)}
                            className="h-8 text-xs font-medium gap-1.5"
                        >
                            <PenTool className="h-3.5 w-3.5" />
                            Cần chấm tay
                            {needsGradingCount > 0 && (
                                <Badge
                                    variant={needsGradingOnly ? "secondary" : "default"}
                                    className="ml-0.5 px-1.5 py-0 h-4 text-[11px] font-bold"
                                >
                                    {needsGradingCount}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </div>

                {/* FB-06 Toolbar: Search, Status Filter, Sort, Reset */}
                <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t">
                    {/* Search by name/id */}
                    <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Tìm theo tên học sinh..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 pr-7 h-8 text-xs"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground p-0.5"
                                title="Xóa tìm kiếm"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter by status */}
                    <div className="w-[150px]">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-8 text-xs">
                                <div className="flex items-center gap-1.5 truncate">
                                    <Filter className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <SelectValue placeholder="Trạng thái" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL" className="text-xs">Tất cả trạng thái</SelectItem>
                                <SelectItem value={SubmissionStatusEnum.SUBMITTED} className="text-xs">Đã nộp</SelectItem>
                                <SelectItem value={SubmissionStatusEnum.AUTO_SUBMITTED} className="text-xs">Tự thu</SelectItem>
                                <SelectItem value={SubmissionStatusEnum.GRADED} className="text-xs">Đã chấm</SelectItem>
                                <SelectItem value={SubmissionStatusEnum.PENDING} className="text-xs">Chờ làm</SelectItem>
                                <SelectItem value={SubmissionStatusEnum.DRAFT} className="text-xs">Đang làm</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort by */}
                    <div className="w-[160px]">
                        <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                            <SelectTrigger className="h-8 text-xs">
                                <div className="flex items-center gap-1.5 truncate">
                                    <ArrowUpDown className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <SelectValue placeholder="Sắp xếp" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="submittedAt_desc" className="text-xs">Mới nộp nhất</SelectItem>
                                <SelectItem value="submittedAt_asc" className="text-xs">Cũ nhất</SelectItem>
                                <SelectItem value="name_asc" className="text-xs">Tên học sinh (A-Z)</SelectItem>
                                <SelectItem value="name_desc" className="text-xs">Tên học sinh (Z-A)</SelectItem>
                                <SelectItem value="score_desc" className="text-xs">Điểm cao nhất</SelectItem>
                                <SelectItem value="score_asc" className="text-xs">Điểm thấp nhất</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reset filters */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                            title="Đặt lại bộ lọc"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Đặt lại
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-4">
                {submissions.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                        <div className="flex justify-center">
                            <div className="bg-muted p-4 rounded-full">
                                <FileText className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Chưa có bài nộp nào.</p>
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                        <div className="flex justify-center">
                            <div className="bg-muted p-4 rounded-full">
                                <Filter className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-foreground">Không tìm thấy bài nộp phù hợp</p>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            Không có bài nộp nào khớp với điều kiện tìm kiếm hoặc bộ lọc hiện tại.
                        </p>
                        <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs h-8">
                            Xóa bộ lọc
                        </Button>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="h-10 hover:bg-transparent">
                                <TableHead className="py-2 px-4 text-xs font-semibold">Học sinh</TableHead>
                                <TableHead className="py-2 px-4 text-xs font-semibold">Trạng thái</TableHead>
                                <TableHead className="py-2 px-4 text-xs font-semibold">Nộp lúc</TableHead>
                                <TableHead className="py-2 px-4 text-center text-xs font-semibold">Trắc nghiệm</TableHead>
                                <TableHead className="py-2 px-4 text-center text-xs font-semibold">Tự luận</TableHead>
                                <TableHead className="py-2 px-4 text-center text-xs font-semibold">Tổng</TableHead>
                                <TableHead className="py-2 px-4 text-right text-xs font-semibold">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubmissions.map((sub) => {
                                // FB-09/FB-22: labels and colours come from the shared module,
                                // so "Tự thu" looks identical on every teacher screen.
                                const presentation = getSubmissionStatusPresentation(sub.status);
                                const autoCollected = isAutoCollected(sub);
                                const blankAutoCollected = isBlankAutoCollected(sub);
                                const scorePres = getScorePresentation(sub.totalScore, { autoSubmitted: autoCollected });

                                return (
                                <TableRow key={sub.id} className="h-12 hover:bg-muted/50 transition-colors">
                                    <TableCell className="py-2 px-4 text-xs font-medium text-foreground">
                                        {sub.studentName || sub.studentId}
                                    </TableCell>
                                    <TableCell className="py-2 px-4">
                                        {/* FB-08: elevated badge text size to text-xs */}
                                        <Badge
                                            variant="outline"
                                            className={`px-2 py-0.5 h-6 text-xs font-medium border ${presentation.badgeClassName}`}
                                            title={autoCollected ? 'Hệ thống tự thu khi hết hạn' : presentation.label}
                                        >
                                            {blankAutoCollected ? `${presentation.label} (trắng)` : presentation.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-2 px-4 text-xs text-muted-foreground">
                                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('vi-VN') : '-'}
                                    </TableCell>
                                    <TableCell className="py-2 px-4 text-center text-xs font-semibold">{sub.mcqScore ?? '-'}</TableCell>
                                    <TableCell className="py-2 px-4 text-center text-xs">
                                        {blankAutoCollected ? (
                                            <span className="text-muted-foreground/60 italic text-xs">Không cần chấm</span>
                                        ) : sub.status === SubmissionStatusEnum.GRADED ? (
                                            <span className="font-semibold text-yellow-600 dark:text-yellow-500">{sub.essayScore}</span>
                                        ) : sub.status === SubmissionStatusEnum.PENDING ? (
                                            <span className="text-muted-foreground/50 italic text-xs">Chưa làm</span>
                                        ) : (
                                            <span className="text-amber-600 dark:text-amber-400 font-medium italic text-xs">Chờ chấm</span>
                                        )}
                                    </TableCell>
                                    {/* FB-22: Semantic color for total score */}
                                    <TableCell className="py-2 px-4 text-center">
                                        {sub.totalScore !== undefined && sub.totalScore !== null ? (
                                            <span className={`text-sm font-black ${scorePres.scoreClassName}`}>
                                                {sub.totalScore}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-2 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => onSelectSubmission(sub.id)}
                                                disabled={sub.status === SubmissionStatusEnum.PENDING}
                                                title={
                                                    blankAutoCollected ? 'Tự thu — không có câu trả lời'
                                                        : sub.status === SubmissionStatusEnum.GRADED ? 'Xem bài'
                                                            : sub.status === SubmissionStatusEnum.PENDING ? 'Chưa làm'
                                                                : autoCollected ? 'Chấm bài tự thu' : 'Chấm bài'
                                                }
                                            >
                                                {sub.status === SubmissionStatusEnum.GRADED && !blankAutoCollected ? (
                                                    <Eye className="h-4 w-4" />
                                                ) : (
                                                    <FileText className={`h-4 w-4 ${sub.status === SubmissionStatusEnum.PENDING ? 'opacity-20' : ''}`} />
                                                )}
                                            </Button>
                                            {/* FB-04: inline exception menu so a tutor can fix a collected
                                                attempt without opening the full grading page first. */}
                                            <SubmissionExceptionActions
                                                compact
                                                submissionId={sub.id}
                                                submission={sub}
                                                onSubmissionUpdated={fetchSubmissions}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};
