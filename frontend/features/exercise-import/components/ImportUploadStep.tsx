import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, FileText, Upload } from 'lucide-react';
import React, { useState } from 'react';

interface ImportUploadStepProps {
    onParse: (content: string) => void;
    isLoading: boolean;
    error: string | null;
}

const SAMPLE_FORMAT = `=== THÔNG TIN BÀI TẬP ===
Tiêu đề: Bài tập mẫu
Mô tả: Mô tả bài tập
Thời gian: 45
Tổng điểm: 100

=== PHẦN 1: TRẮC NGHIỆM ===
[MCQ-1] Thủ đô của Việt Nam là gì?
A. Hà Nội
B. Hồ Chí Minh
C. Đà Nẵng
D. Hải Phòng
ANSWER: A
POINTS: 10

=== PHẦN 2: TỰ LUẬN ===
[ESSAY-1] Viết một đoạn văn giới thiệu bản thân.
POINTS: 20
RUBRIC: Ngữ pháp (10), Nội dung (10)`;

export const ImportUploadStep: React.FC<ImportUploadStepProps> = ({ onParse, isLoading, error }) => {
    const [content, setContent] = useState('');

    const handleParse = () => {
        if (!content.trim()) return;
        onParse(content);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Import Exercise - Step 1</CardTitle>
                        <CardDescription>Paste your exercise content below in the structured format.</CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <FileText className="mr-2 h-4 w-4" />
                                Format Guide
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Exercise Format Guide</DialogTitle>
                                <DialogDescription>
                                    Follow this structure closely to ensure your exercise is parsed correctly.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="p-4 bg-muted rounded-md text-sm font-mono whitespace-pre-wrap">
                                    {SAMPLE_FORMAT}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <p className="font-semibold mb-2">Notes:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Metadata section is required at the top.</li>
                                        <li>MCQ questions must have 4 options (A, B, C, D) and an ANSWER field.</li>
                                        <li>Points usually sum up to the Total Points defined in metadata.</li>
                                        <li>Keywords like "=== PHẦN", "ANSWER:", "POINTS:" are case-sensitive helpers.</li>
                                    </ul>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Textarea
                    placeholder="Paste exercise content here..."
                    className="min-h-[600px] font-mono text-sm"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button
                    onClick={handleParse}
                    disabled={!content.trim() || isLoading}
                    size="lg"
                >
                    {isLoading ? (
                        <>Parsing...</>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Parse Content
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};
