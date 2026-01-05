import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Question, QuestionType } from '@/features/exercise-import/types/exercise.types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';
import React from 'react';

interface MCQQuestionProps {
    question: Question;
    selectedAnswer?: string;
    onAnswerChange: (answer: string) => void;
}

export const MCQQuestion: React.FC<MCQQuestionProps> = ({
    question,
    selectedAnswer,
    onAnswerChange,
}) => {
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
            <CardContent className="space-y-3">
                {question.options?.map((option) => {
                    const isSelected = selectedAnswer === option.label;
                    return (
                        <div
                            key={option.label}
                            className={cn(
                                "flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent",
                                isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-transparent bg-muted"
                            )}
                            onClick={() => onAnswerChange(option.label)}
                        >
                            <div className="flex-shrink-0 mt-0.5 mr-3">
                                {isSelected ? (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-grow">
                                <div className="font-semibold text-sm mb-1 text-muted-foreground">
                                    Option {option.label}
                                </div>
                                <div className="text-sm">
                                    {option.optionText}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};
