import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AlertTriangle, Check, CheckCircle2, Edit2, Plus, Save, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    CreateExerciseRequest,
    ExerciseStatus,
    ImportPreviewResponse,
    QuestionPreview,
    QuestionType
} from '../types/exercise.types';

interface ImportPreviewStepProps {
    initialData: ImportPreviewResponse;
    onSave: (data: CreateExerciseRequest) => void;
    onBack: () => void;
    isLoading: boolean;
}

export const ImportPreviewStep: React.FC<ImportPreviewStepProps> = ({
    initialData,
    onSave,
    onBack,
    isLoading
}) => {
    const [metadata, setMetadata] = useState(initialData.metadata);
    const [questions, setQuestions] = useState<QuestionPreview[]>(initialData.questions);
    const [editingQuestion, setEditingQuestion] = useState<{ index: number; data: QuestionPreview } | null>(null);

    // Verify total points match
    const calculatedTotal = questions.reduce((sum, q) => sum + (q.points || 0), 0);
    const hasPointsMismatch = metadata.totalPoints !== undefined && metadata.totalPoints !== calculatedTotal;

    // Optional: Auto-update ONLY if metadata totalPoints is 0 or undefined
    useEffect(() => {
        if (!metadata.totalPoints || metadata.totalPoints === 0) {
            setMetadata(prev => ({ ...prev, totalPoints: calculatedTotal }));
        }
    }, [calculatedTotal]);

    const handleSaveQuestion = () => {
        if (editingQuestion) {
            const newQuestions = [...questions];
            newQuestions[editingQuestion.index] = editingQuestion.data;
            setQuestions(newQuestions);
            setEditingQuestion(null);
        }
    };

    const handleDeleteQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handlePublish = () => {
        if (!metadata.title) {
            toast.error("Validation Error", {
                description: "Title is required"
            });
            return;
        }

        if (questions.length === 0) {
            toast.error("Validation Error", {
                description: "At least one question is required"
            });
            return;
        }

        // Transform QuestionPreview to QuestionRequest
        const questionRequests = questions.map((q, idx) => ({
            type: q.type,
            questionText: q.questionText,
            points: q.points,
            orderIndex: idx, // Re-index to ensure order
            rubric: q.rubric,
            // Map options if MCQ
            options: q.options?.map(o => ({
                label: o.label,
                optionText: o.optionText
            })),
            correctAnswer: q.options?.find(o => o.isCorrect)?.label
        }));

        const request: CreateExerciseRequest = {
            title: metadata.title,
            description: metadata.description,
            timeLimit: metadata.timeLimit,
            totalPoints: metadata.totalPoints || 0,
            status: ExerciseStatus.PUBLISHED,
            questions: questionRequests
        };

        onSave(request);
    };

    return (
        <div className="space-y-6">
            {/* Metadata Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Exercise Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            value={metadata.title || ''}
                            onChange={e => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Exercise Title"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Time Limit (minutes)</Label>
                        <Input
                            type="number"
                            value={metadata.timeLimit || ''}
                            onChange={e => setMetadata(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={metadata.description || ''}
                            onChange={e => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Total Points (Metadata)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                value={metadata.totalPoints || 0}
                                onChange={e => setMetadata(prev => ({ ...prev, totalPoints: parseInt(e.target.value) || 0 }))}
                                className={cn(hasPointsMismatch && "border-yellow-500 focus-visible:ring-yellow-500")}
                            />
                            {hasPointsMismatch && (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-500 bg-yellow-50 shrink-0">
                                    <AlertTriangle className="h-3 w-3 mr-1" /> Mismatch
                                </Badge>
                            )}
                        </div>
                        {hasPointsMismatch && (
                            <p className="text-[10px] text-yellow-600 mt-1">
                                Metadata: {metadata.totalPoints} vs Questions: {calculatedTotal}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Questions ({questions.length})</h3>
                    <Button variant="outline" size="sm" onClick={() => {
                        const newQ: QuestionPreview = {
                            type: QuestionType.MCQ,
                            questionText: "New Question",
                            points: 10,
                            orderIndex: questions.length,
                            options: [
                                { label: "A", optionText: "Option A", isCorrect: true },
                                { label: "B", optionText: "Option B", isCorrect: false },
                                { label: "C", optionText: "Option C", isCorrect: false },
                                { label: "D", optionText: "Option D", isCorrect: false },
                            ]
                        };
                        setQuestions([...questions, newQ]);
                        setEditingQuestion({ index: questions.length, data: newQ });
                    }}>
                        <Plus className="h-4 w-4 mr-2" /> Add Question
                    </Button>
                </div>

                <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                        {questions.map((q, idx) => (
                            <Card key={idx} className="relative group">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">#{idx + 1}</Badge>
                                            <Badge className={cn(
                                                q.type === QuestionType.MCQ ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                            )}>
                                                {q.type}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">{q.points} pts</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" onClick={() => setEditingQuestion({ index: idx, data: q })}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteQuestion(idx)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="text-base mt-2">{q.questionText}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {q.type === QuestionType.MCQ ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                            {q.options?.map((opt, i) => (
                                                <div key={i} className={cn(
                                                    "p-2 rounded border flex items-center gap-2 text-sm",
                                                    opt.isCorrect ? "border-green-500 bg-green-50" : "border-gray-200"
                                                )}>
                                                    <span className={cn(
                                                        "font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs",
                                                        opt.isCorrect ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"
                                                    )}>{opt.label}</span>
                                                    <span>{opt.optionText}</span>
                                                    {opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-sm bg-muted p-3 rounded">
                                            <p className="font-semibold mb-1">Rubric:</p>
                                            <p>{q.rubric || 'No rubric provided'}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Edit Question Dialog */}
            <Dialog open={!!editingQuestion} onOpenChange={(open) => !open && setEditingQuestion(null)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Question</DialogTitle>
                    </DialogHeader>
                    {editingQuestion && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-3">
                                    <Label>Question Text</Label>
                                    <Textarea
                                        value={editingQuestion.data.questionText}
                                        onChange={e => setEditingQuestion({
                                            ...editingQuestion,
                                            data: { ...editingQuestion.data, questionText: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label>Points</Label>
                                    <Input
                                        type="number"
                                        value={editingQuestion.data.points}
                                        onChange={e => setEditingQuestion({
                                            ...editingQuestion,
                                            data: { ...editingQuestion.data, points: parseInt(e.target.value) || 0 }
                                        })}
                                    />
                                </div>
                            </div>

                            {editingQuestion.data.type === QuestionType.MCQ && (
                                <div className="space-y-2">
                                    <Label>Options</Label>
                                    {editingQuestion.data.options?.map((opt, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <Button
                                                variant={opt.isCorrect ? "default" : "outline"}
                                                size="sm"
                                                className={cn("w-10 h-10 p-0", opt.isCorrect && "bg-green-500 hover:bg-green-600")}
                                                onClick={() => {
                                                    const newOptions = editingQuestion.data.options?.map((o, idx) => ({
                                                        ...o,
                                                        isCorrect: idx === i
                                                    }));
                                                    setEditingQuestion({
                                                        ...editingQuestion,
                                                        data: { ...editingQuestion.data, options: newOptions }
                                                    });
                                                }}
                                            >
                                                {opt.label}
                                            </Button>
                                            <Input
                                                value={opt.optionText}
                                                onChange={e => {
                                                    const newOptions = [...(editingQuestion.data.options || [])];
                                                    newOptions[i].optionText = e.target.value;
                                                    setEditingQuestion({
                                                        ...editingQuestion,
                                                        data: { ...editingQuestion.data, options: newOptions }
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {editingQuestion.data.type === QuestionType.ESSAY && (
                                <div>
                                    <Label>Rubric</Label>
                                    <Textarea
                                        value={editingQuestion.data.rubric || ''}
                                        onChange={e => setEditingQuestion({
                                            ...editingQuestion,
                                            data: { ...editingQuestion.data, rubric: e.target.value }
                                        })}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingQuestion(null)}>Cancel</Button>
                        <Button onClick={handleSaveQuestion}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bottom Actions */}
            <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={onBack}>Back to Import</Button>
                <div className="space-x-2">
                    {/* Draft saving could be added here */}
                    <Button onClick={handlePublish} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                        {isLoading ? "Publishing..." : <>Publish Exercise <Check className="ml-2 h-4 w-4" /></>}
                    </Button>
                </div>
            </div>
        </div>
    );
};
