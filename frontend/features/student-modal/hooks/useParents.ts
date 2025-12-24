// ============================================================================
// 📁 student-modal/hooks/useParents.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { parentsApi } from '@/lib/services';
import type { Parent } from '@/lib/types';

export function useParents() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadParents();
  }, []);
  
  const loadParents = async () => {
    try {
      setLoading(true);
      const data = await parentsApi.getAll();
      setParents(data);
    } catch (error) {
      console.error('Error loading parents:', error);
    } finally {
      setLoading(false);
    }
  };

  return { parents, loading };
}