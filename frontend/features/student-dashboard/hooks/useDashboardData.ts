// ============================================================================
// FILE: student-dashboard/hooks/useDashboardData.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { api, documentsApi, recurringSchedulesApi } from '@/lib/services';
import type { SessionRecord, RecurringSchedule, Document as DocumentType } from '@/lib/types';

export const useDashboardData = (studentId: number | undefined) => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [schedule, setSchedule] = useState<RecurringSchedule | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        
        const [mySessions, allDocuments] = await Promise.all([
          api.get(`/student/sessions?month=${currentMonth}`).then(res => res.data),
          documentsApi.getAll(),
        ]);

        setSessions(mySessions || []);
        
        const myDocuments = allDocuments.filter(
          doc => !doc.studentId || doc.studentId === studentId
        );
        setDocuments(myDocuments);

        try {
          const scheduleData = await recurringSchedulesApi.getByStudentId(studentId);
          setSchedule(scheduleData);
        } catch (error) {
          console.log('No schedule found for student');
        }

      } catch (error) {
        console.error('Error loading student dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [studentId, currentMonth]);

  return { loading, sessions, documents, schedule, currentMonth };
};