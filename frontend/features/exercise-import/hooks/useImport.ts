import { useState } from 'react';
import { exerciseService } from '../services/exerciseService';
import { CreateExerciseRequest, ImportPreviewResponse } from '../types/exercise.types';
import { toast } from 'sonner';

export const useImport = (classId?: string) => {
    const [step, setStep] = useState<number>(1);
    const [previewData, setPreviewData] = useState<ImportPreviewResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const parseText = async (content: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await exerciseService.importPreview(content, classId);
            if (data.isValid) {
                setPreviewData(data);
                setStep(2);
            } else {
                setError(data.validationErrors.join('\n'));
                toast.error("Import Failed", {
                    description: "Please check the errors and try again."
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to parse content');
            toast.error("Error", {
                description: err.message || 'Failed to parse content'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const saveExercise = async (data: CreateExerciseRequest) => {
        setIsLoading(true);
        try {
            if (classId) {
                data.classId = classId;
            }
            await exerciseService.create(data);
            toast.success("Success", {
                description: "Exercise created successfully!"
            });
            setStep(3); // Success step or redirect
        } catch (err: any) {
            toast.error("Error", {
                description: err.message || 'Failed to create exercise'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setStep(1);
        setPreviewData(null);
        setError(null);
    };

    return {
        step,
        previewData,
        isLoading,
        error,
        parseText,
        saveExercise,
        goToStep: setStep,
        reset
    };
};
