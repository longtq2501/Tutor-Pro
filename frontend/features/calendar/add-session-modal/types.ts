// ============================================================================
// FILE: add-session-modal/types.ts
// ============================================================================
export interface AddSessionModalProps {
  onClose: () => void;
  onSubmit: (sessions: number, hoursPerSession: number, sessionDate: string, month: string) => void;
  initialDate?: string;
}