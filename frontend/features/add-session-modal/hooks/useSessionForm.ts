// ============================================================================
// FILE: add-session-modal/hooks/useSessionForm.ts
// ============================================================================
import { useState } from 'react';

const getDefaultDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const useSessionForm = (initialDate?: string) => {
  const [sessions, setSessions] = useState(1);
  const [hoursPerSession, setHoursPerSession] = useState(2);
  const [sessionDate, setSessionDate] = useState(initialDate || getDefaultDate());

  const totalHours = sessions * hoursPerSession;
  const month = sessionDate.substring(0, 7);

  const validate = () => {
    if (sessions < 1 || hoursPerSession < 0.5 || !sessionDate) {
      alert('Vui lòng kiểm tra lại thông tin');
      return false;
    }
    return true;
  };

  return {
    sessions, setSessions,
    hoursPerSession, setHoursPerSession,
    sessionDate, setSessionDate,
    totalHours, month, validate
  };
};