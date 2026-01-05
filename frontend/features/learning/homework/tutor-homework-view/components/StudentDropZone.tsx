
// ============================================================================
// FILE: StudentDropZone.tsx
// ============================================================================
import React, { useState } from 'react';
import { User, ClipboardList, ArrowDownToLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Student } from '@/lib/types';
import type { Document } from '@/lib/types';

interface StudentDropZoneProps {
    student: Student;
    isSelected: boolean;
    onSelect: (studentId: number) => void;
    onDropDocument: (studentId: number, document: Document) => void;
}

export const StudentDropZone = ({
    student,
    isSelected,
    onSelect,
    onDropDocument
}: StudentDropZoneProps) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Essential to allow dropping
        setIsOver(true);
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = () => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsOver(false);

        try {
            const data = e.dataTransfer.getData('application/json');
            if (data) {
                const document = JSON.parse(data) as Document;
                onDropDocument(student.id, document);
            }
        } catch (error) {
            console.error('Failed to parse dropped data', error);
        }
    };

    return (
        <div
            onClick={() => onSelect(student.id)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer group select-none",
                isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-transparent bg-secondary/30 hover:bg-secondary/50",
                isOver && "border-primary border-dashed bg-primary/10 scale-[1.02] ring-2 ring-primary/20"
            )}
        >
            <div className="relative mb-3">
                <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold transition-transform",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary",
                    isOver && "scale-110"
                )}>
                    {student.name.charAt(0)}
                </div>
                {/* Badge for Drag State */}
                {isOver && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg animate-bounce">
                        <ArrowDownToLine size={14} />
                    </div>
                )}
            </div>

            <h3 className="font-semibold text-center text-sm mb-1">{student.name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ClipboardList size={12} />
                <span>Giao bài tập</span>
            </div>
        </div>
    );
};
