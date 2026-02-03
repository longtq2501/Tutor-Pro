import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Question } from '@/features/exercise-import/types/exercise.types';
import { Save } from 'lucide-react';
import React from 'react';

interface EssayQuestionProps {
    question: Question;
    essayText?: string;
    onTextChange: (text: string) => void;
}

export const EssayQuestion: React.FC<EssayQuestionProps> = ({
    question,
    essayText = '',
    onTextChange,
}) => {
    const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

    return (
        <div className="w-full space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-foreground">
                        {question.questionText}
                    </h3>
                    <Badge variant="secondary" className="shrink-0 mt-1 px-3 py-1 text-sm font-bold bg-primary/10 text-primary border-primary/20">
                        {question.points} điểm
                    </Badge>
                </div>
            </div>

            <div className="space-y-4">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200" />
                    <Textarea
                        id={`essay-${question.id}`}
                        placeholder="Nhập câu trả lời của bạn tại đây..."
                        className="relative min-h-[300px] md:min-h-[400px] w-full p-6 text-base md:text-lg bg-card border-border/40 rounded-2xl shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-300 resize-none font-normal leading-relaxed"
                        value={essayText}
                        onChange={(e) => onTextChange(e.target.value)}
                    />
                </div>

                <div className="flex justify-between items-center px-2">
                    {question.rubric && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/40">
                            <span className="font-bold text-primary/70">Rubric sẵn có</span>
                        </div>
                    )}
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                        {wordCount} từ
                    </div>
                </div>

                {question.rubric && (
                    <div className="mt-6 p-5 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Save className="h-12 w-12" />
                        </div>
                        <h4 className="font-bold text-sm text-primary mb-2 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Gợi ý chấm điểm (Rubric)
                        </h4>
                        <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                            {question.rubric}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
