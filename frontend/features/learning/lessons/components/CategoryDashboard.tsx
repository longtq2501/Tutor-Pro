import { useLessonCategories } from '../hooks/useLessonCategories';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Layers, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CategoryDashboardProps {
    onSelectCategory: (categoryId: number | null) => void;
    lessonCounts?: Record<number, number>; // Maps categoryId to count
}

export function CategoryDashboard({ onSelectCategory, lessonCounts = {} }: CategoryDashboardProps) {
    const { categories, isLoading } = useLessonCategories();

    if (isLoading) {
        return (
            <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <Layers className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
                    Chưa có danh mục nào
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Vui lòng tạo danh mục trong Kho Học Liệu trước
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* "All" Category Card */}
            <Card
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-l-slate-500 overflow-hidden relative"
                onClick={() => onSelectCategory(null)}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 group-hover:scale-110 transition-transform">
                            <Layers className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        {lessonCounts[-1] !== undefined && (
                            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
                                {lessonCounts[-1]}
                            </Badge>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors">
                            Tất cả bài giảng
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-[90%] line-clamp-2">
                            Xem toàn bộ danh sách bài giảng đang dạy
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Dynamic Categories */}
            {categories.map((category) => (
                <Card
                    key={category.id}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 overflow-hidden relative"
                    style={{ borderLeftColor: category.color || '#3b82f6' }}
                    onClick={() => onSelectCategory(category.id)}
                >
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{
                            background: `linear-gradient(135deg, ${category.color}10 0%, transparent 100%)`
                        }}
                    />
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div
                                className="p-3 rounded-xl group-hover:scale-110 transition-transform shadow-sm"
                                style={{ backgroundColor: `${category.color}20` }}
                            >
                                <BookOpen
                                    className="w-6 h-6"
                                    style={{ color: category.color || '#3b82f6' }}
                                />
                            </div>
                            {lessonCounts[category.id] !== undefined && (
                                <Badge
                                    variant="outline"
                                    className="border-0 font-bold"
                                    style={{
                                        backgroundColor: `${category.color}15`,
                                        color: category.color
                                    }}
                                >
                                    {lessonCounts[category.id]}
                                </Badge>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                {category.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {category.description || 'Không có mô tả'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
