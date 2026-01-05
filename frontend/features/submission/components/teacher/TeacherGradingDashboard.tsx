import React, { useState } from 'react';
import { GradingView } from './GradingView';
import { SubmissionList } from './SubmissionList';

interface TeacherGradingDashboardProps {
    exerciseId: string;
}

export const TeacherGradingDashboard: React.FC<TeacherGradingDashboardProps> = ({ exerciseId }) => {
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleBack = () => {
        setSelectedSubmissionId(null);
        setRefreshKey(prev => prev + 1); // Increment key to trigger re-fetch
    };

    if (selectedSubmissionId) {
        return (
            <GradingView
                submissionId={selectedSubmissionId}
                onBack={handleBack}
            />
        );
    }

    return (
        <SubmissionList
            key={`${exerciseId}-${refreshKey}`}
            exerciseId={exerciseId}
            onSelectSubmission={setSelectedSubmissionId}
        />
    );
};
