import React from 'react';
import { User } from 'lucide-react';

export const TutorStudentGridEmptyState = () => {
    return (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Chưa có học sinh nào được giao bài</h3>
            <p className="text-sm text-muted-foreground mt-1">Hãy giao bài tập từ thư viện để theo dõi tiến độ.</p>
        </div>
    );
};
