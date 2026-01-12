// ============================================================================
// 📁 student-list/hooks/useStudentModals.ts
// ============================================================================
import { useState } from 'react';
import type { Student } from '@/lib/types';

export interface StudentModalState {
  showModal: boolean;
  editingStudent: Student | null;
  openCreate: () => void;
  openEdit: (student: Student) => void;
  closeStudentModal: () => void;

  showAddSessionModal: boolean;
  selectedStudentIdForSession: number | null;
  openAddSession: (studentId: number) => void;
  closeAddSession: () => void;

  showRecurringModal: boolean;
  selectedStudentForSchedule: Student | null;
  openSchedule: (student: Student) => void;
  closeSchedule: () => void;
}

export function useStudentModals(): StudentModalState {
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [selectedStudentIdForSession, setSelectedStudentIdForSession] = useState<number | null>(null);

  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [selectedStudentForSchedule, setSelectedStudentForSchedule] = useState<Student | null>(null);

  const openCreate = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const openEdit = (student: Student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const closeStudentModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const openAddSession = (studentId: number) => {
    setSelectedStudentIdForSession(studentId);
    setShowAddSessionModal(true);
  };

  const closeAddSession = () => {
    setShowAddSessionModal(false);
    setSelectedStudentIdForSession(null);
  };

  const openSchedule = (student: Student) => {
    setSelectedStudentForSchedule(student);
    setShowRecurringModal(true);
  };

  const closeSchedule = () => {
    setShowRecurringModal(false);
    setSelectedStudentForSchedule(null);
  };

  return {
    // Student Modal
    showModal,
    editingStudent,
    openCreate,
    openEdit,
    closeStudentModal,

    // Add Session Modal
    showAddSessionModal,
    selectedStudentIdForSession,
    openAddSession,
    closeAddSession,

    // Schedule Modal
    showRecurringModal,
    selectedStudentForSchedule,
    openSchedule,
    closeSchedule,
  };
}