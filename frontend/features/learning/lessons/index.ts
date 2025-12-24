/**
 * Admin Lesson Management Module
 * Main entry point for ADMIN/TUTOR lesson management features
 * 
 * ⚠️ IMPORTANT: Component name changed to avoid conflict
 * - OLD: LessonViewWrapper (conflicts with STUDENT component in lesson-view-wrapper/)
 * - NEW: AdminLessonManager (clear naming for ADMIN/TUTOR)
 */

// Export main component (default export)
export { default } from './components/AdminLessonManager';

// Named export
export { AdminLessonManager } from './components/AdminLessonManager';

// Export hooks
export * from './hooks/useAdminLessons';
export * from './hooks/useLessonLibrary';
export * from './hooks/useStudents';

// Export types
export * from './types';

// Export components for custom layouts
export { LessonForm } from './components/LessonForm';
export { AdminLessonsTab } from './components/AdminLessonsTab';
export { LessonLibraryTab } from './components/LessonLibraryTab';
export { CreateLessonDialog } from './components/CreateLessonDialog';
export { EditLessonDialog } from './components/EditLessonDialog';
export { AssignStudentsDialog } from './components/AssignStudentsDialog';