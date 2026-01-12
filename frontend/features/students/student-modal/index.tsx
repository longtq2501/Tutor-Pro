// ============================================================================
// 📁 student-modal/index.tsx
// ============================================================================
'use client';

import type { Student } from '@/lib/types';
import { useParents } from './hooks/useParents';
import { useStudentForm } from './hooks/useStudentForm';
import { StudentModalHeader } from './components/StudentModalHeader';
import { StudentFormFields } from './components/StudentFormFields';
import { StudentModalFooter } from './components/StudentModalFooter';
import { useScrollLock } from '@/lib/hooks/useScrollLock';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * StudentModal Component
 * Provides a form for creating or editing student information.
 * Adheres to 50-line SOP by delegating to sub-components.
 */
export default function StudentModal({ student, onClose, onSuccess }: StudentModalProps) {
  const { parents, loading: loadingParents } = useParents();
  const { formData, loading, updateField, submit } = useStudentForm(student, onSuccess);

  useScrollLock();

  return (
    <div role="dialog" className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300 ease-out">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-card rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 ease-out border border-border">
        <StudentModalHeader isEdit={!!student} onClose={onClose} />

        <div className="px-8 py-6 overflow-y-auto custom-scrollbar flex-1 bg-muted/20">
          <StudentFormFields
            formData={formData}
            parents={parents}
            loadingParents={loadingParents}
            updateField={updateField}
          />
        </div>

        <StudentModalFooter
          isEdit={!!student}
          loading={loading}
          onClose={onClose}
          onSubmit={submit}
        />
      </div>
    </div>
  );
}