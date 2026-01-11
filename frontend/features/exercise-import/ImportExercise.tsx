import { Button } from '@/components/ui/button';
import React from 'react';
import { ImportPreviewStep } from './components/ImportPreviewStep';
import { ImportUploadStep } from './components/ImportUploadStep';
import { useImport } from './hooks/useImport';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ImportExerciseProps {
    classId?: string;
    onSuccess?: () => void;
}

export const ImportExercise: React.FC<ImportExerciseProps> = ({ classId, onSuccess }) => {
    const {
        step,
        previewData,
        isLoading,
        error,
        parseText,
        saveExercise,
        goToStep,
        reset
    } = useImport(classId);

    if (step === 3) {
        return (
            <Card className="max-w-md mx-auto mt-8 text-center">
                <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-center text-green-500">
                        <CheckCircle2 className="h-16 w-16" />
                    </div>
                    <h2 className="text-2xl font-bold">Import Successful!</h2>
                    <p className="text-muted-foreground">
                        The exercise has been created and published successfully.
                    </p>
                    <div className="flex gap-2 justify-center pt-2">
                        <Button variant="outline" onClick={reset}>Import Another</Button>
                        {onSuccess && <Button onClick={onSuccess}>View Exercises</Button>}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <span className={step === 1 ? "font-bold text-primary" : ""}>1. Upload Content</span>
                <span>→</span>
                <span className={step === 2 ? "font-bold text-primary" : ""}>2. Preview & Edit</span>
                <span>→</span>
                <span>3. Done</span>
            </div>

            {step === 1 && (
                <ImportUploadStep
                    onParse={(content, cid) => parseText(cid ? content : content, cid)}
                    isLoading={isLoading}
                    error={error}
                />
            )}

            {step === 2 && previewData && (
                <ImportPreviewStep
                    initialData={previewData}
                    onSave={saveExercise}
                    onBack={() => goToStep(1)}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};
