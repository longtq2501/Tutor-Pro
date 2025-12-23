'use client';

import React, { useEffect, useState } from 'react';
import { lessonLibraryApi, studentsApi } from '@/lib/api';
import type { AdminLesson, Student } from '@/lib/types';
import { Users, UserPlus, UserMinus } from 'lucide-react';

export default function LessonLibrary() {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<AdminLesson | null>(null);
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lessonsData, studentsData] = await Promise.all([
        lessonLibraryApi.getAll(),
        studentsApi.getAll()
      ]);
      setLessons(lessonsData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAssign = async (lesson: AdminLesson) => {
    setSelectedLesson(lesson);
    try {
      const assigned = await lessonLibraryApi.getAssignedStudents(lesson.id);
      setAssignedStudents(assigned);
      setSelectedStudentIds(assigned.map(s => s.id));
    } catch (error) {
      console.error('Error:', error);
    }
    setShowAssignModal(true);
  };

  const handleAssign = async () => {
    if (!selectedLesson) return;
    
    const currentIds = assignedStudents.map(s => s.id);
    const toAssign = selectedStudentIds.filter(id => !currentIds.includes(id));
    const toUnassign = currentIds.filter(id => !selectedStudentIds.includes(id));

    try {
      if (toAssign.length > 0) {
        await lessonLibraryApi.assignToStudents(selectedLesson.id, toAssign);
      }
      if (toUnassign.length > 0) {
        await lessonLibraryApi.unassignFromStudents(selectedLesson.id, toUnassign);
      }
      setShowAssignModal(false);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleStudent = (studentId: number) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Thư viện Bài giảng</h1>

      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-card border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{lesson.tutorName}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {lesson.assignedStudentCount} học sinh
                  </span>
                  <span>{lesson.totalViewCount} lượt xem</span>
                </div>
              </div>
              <button
                onClick={() => handleShowAssign(lesson)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <UserPlus size={18} />
                Giao bài
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Giao bài: {selectedLesson.title}</h2>
            
            <div className="space-y-2 mb-6">
              {students.map((student) => (
                <label key={student.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    className="w-4 h-4"
                  />
                  <span>{student.name}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAssign}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Lưu
              </button>
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}