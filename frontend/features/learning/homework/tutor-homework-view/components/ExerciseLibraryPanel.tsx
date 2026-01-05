
// ============================================================================
// FILE: ExerciseLibraryPanel.tsx
// ============================================================================
import React, { useMemo } from 'react';
import { useMasterExercises } from '@/features/documents/hooks/useMasterDocuments';
import VisualDocumentCard from './VisualDocumentCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const ExerciseLibraryPanel = () => {
    const { data: exercises = [], isLoading } = useMasterExercises();
    const [search, setSearch] = React.useState('');

    const filteredExercises = useMemo(() => {
        if (!search) return exercises;
        const lower = search.toLowerCase();
        return exercises.filter(ex => ex.title.toLowerCase().includes(lower));
    }, [exercises, search]);

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px] w-full max-w-sm border-r border-border pr-6">
            <div className="mb-4 space-y-2">
                <h3 className="font-semibold text-lg tracking-tight">Thư viện bài tập</h3>
                <p className="text-xs text-muted-foreground">Kéo thả bài tập vào học sinh để giao bài</p>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm bài tập..."
                    className="pl-9 bg-secondary/20"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {isLoading ? (
                    <div className="text-sm text-center py-10 text-muted-foreground">Đang tải...</div>
                ) : filteredExercises.length === 0 ? (
                    <div className="text-sm text-center py-10 text-muted-foreground">Không tìm thấy bài tập nào</div>
                ) : (
                    filteredExercises.map(doc => (
                        <VisualDocumentCard key={doc.id} document={doc} />
                    ))
                )}
            </div>
        </div>
    );
};
