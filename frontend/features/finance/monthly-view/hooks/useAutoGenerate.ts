// 📁 monthly-view/hooks/useAutoGenerate.ts
import { useState, useEffect } from 'react';
import { recurringSchedulesApi } from '@/lib/services';

export function useAutoGenerate(selectedMonth: string) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [count, setCount] = useState(0);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    checkAutoGenerate();
  }, [selectedMonth]);

  const checkAutoGenerate = async () => {
    if (sessionStorage.getItem(`ignore_auto_${selectedMonth}`)) return;
    
    try {
      const checkResult = await recurringSchedulesApi.checkMonth(selectedMonth);
      if (!checkResult.hasSessions) {
        const countResult = await recurringSchedulesApi.countSessions(selectedMonth);
        if (countResult.count > 0) {
          setCount(countResult.count);
          setShowPrompt(true);
        }
      }
    } catch (error) {
      console.error('Error checking auto-generate:', error);
    }
  };

  const generate = async (onSuccess?: () => void) => {
    try {
      setGenerating(true);
      const result = await recurringSchedulesApi.generateSessions(selectedMonth);
      alert(`✅ ${result.message || 'Đã tạo xong các buổi học!'}`);
      setShowPrompt(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error generating sessions:', error);
      alert('❌ Không thể tạo buổi học tự động.');
    } finally {
      setGenerating(false);
    }
  };

  const dismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem(`ignore_auto_${selectedMonth}`, 'true');
  };

  return { showPrompt, count, generating, generate, dismiss };
}
