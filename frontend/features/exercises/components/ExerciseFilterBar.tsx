'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LessonCategoryDTO } from '@/features/learning/lessons/types';

/**
 * Filter bar for exercise searching and category selection.
 */
interface ExerciseFilterBarProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    selectedCategory: string;
    setSelectedCategory: (val: string) => void;
    categories: LessonCategoryDTO[];
}

export const ExerciseFilterBar: React.FC<ExerciseFilterBarProps> = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories
}) => {
    return (
        <div className="px-4 py-3 border-b bg-muted/20 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm bài tập..."
                    className="pl-9 h-9 border-muted-foreground/20 focus:border-primary transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground text-muted-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <div className="w-full sm:w-[200px]">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-9 border-muted-foreground/20 shadow-sm focus:ring-1">
                        <SelectValue placeholder="Tất cả danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                        {categories.map((cat: LessonCategoryDTO) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
