import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Question } from '@/features/exercise-import/types/exercise.types';
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
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg leading-relaxed">
                        {question.questionText}
                    </CardTitle>
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap ml-4">
                        {question.points} points
                    </span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={`essay-${question.id}`}>Your Answer</Label>
                    <Textarea
                        id={`essay-${question.id}`}
                        placeholder="Type your answer here..."
                        className="min-h-[200px] resize-y font-normal"
                        value={essayText}
                        onChange={(e) => onTextChange(e.target.value)}
                    />
                    <div className="flex justify-end text-xs text-muted-foreground">
                        {wordCount} words
                    </div>
                </div>

                {question.rubric && (
                    <div className="bg-muted p-4 rounded-md text-sm">
                        <h4 className="font-semibold mb-1">Grading Rubric:</h4>
                        <p className="whitespace-pre-wrap text-muted-foreground">
                            {question.rubric}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
