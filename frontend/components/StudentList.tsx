// src/components/StudentList.tsx
'use client';

import { useState, useEffect } from 'react';
import { User, Plus, Edit2, Trash2, Calendar, DollarSign } from 'lucide-react';
import { studentsApi, sessionsApi } from '@/lib/api';
import type { Student } from '@/lib/types';
import StudentModal from './StudentModal';
import AddSessionModal from './AddSessionModal';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [selectedStudentIdForSession, setSelectedStudentIdForSession] = useState<number | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (showAddSessionModal || showModal) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }

    return () => {
        document.body.style.overflow = 'unset';
    };
  }, [showAddSessionModal, showModal]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsApi.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm('Xóa học sinh sẽ xóa toàn bộ lịch sử học của học sinh này. Bạn có chắc?')) {
      return;
    }

    try {
      await studentsApi.delete(id);
      loadStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Không thể xóa học sinh!');
    }
  };

  // --- 🆕 THAY THẾ HÀM handleAddSession (MỞ MODAL) ---
    const openAddSessionModal = (studentId: number) => {
        setSelectedStudentIdForSession(studentId);
        setShowAddSessionModal(true);
      };
      
      // --- 🆕 HÀM SUBMIT XỬ LÝ DỮ LIỆU TỪ MODAL ---
      const handleAddSessionSubmit = async (sessionsCount: number, hoursPerSession: number) => {
      if (!selectedStudentIdForSession) return;
      const currentMonth = new Date().toISOString().slice(0, 7);
      const totalHours = sessionsCount * hoursPerSession;  // Tính tổng giờ thực tế
      try {
        await sessionsApi.create({
          studentId: selectedStudentIdForSession,
          month: currentMonth,
          sessions: sessionsCount,
          hoursPerSession: hoursPerSession  // Truyền tổng giờ thay vì giờ mỗi buổi (đảm bảo backend tính đúng)
        });
        
        setShowAddSessionModal(false);  // Đóng modal
        setSelectedStudentIdForSession(null);
        loadStudents();  // Reload để cập nhật totals nếu backend tính lại
        alert(`Đã thêm ${totalHours} giờ thành công!`);  // Alert dựa trên tổng giờ
      } catch (error) {
        console.error('Error adding session:', error);
        alert('Không thể thêm buổi học!');
      }
    };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Danh sách học sinh</h2>
          <button
            onClick={handleAddStudent}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Thêm học sinh
          </button>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-16">
            <User className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg mb-4">Chưa có học sinh nào</p>
            <button
              onClick={handleAddStudent}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Thêm học sinh đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="border rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full p-3 mr-3">
                      <User className="text-indigo-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {student.name}
                      </h3>
                      {student.phone && (
                        <p className="text-sm text-gray-600">{student.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2" size={16} />
                    {student.schedule}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="mr-2" size={16} />
                    {formatCurrency(student.pricePerHour)}/giờ
                  </div>
                </div>

                {student.notes && (
                  <p className="text-sm text-gray-600 mb-4 italic">
                    {student.notes}
                  </p>
                )}

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Đã thu:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(student.totalPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Chưa thu:</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(student.totalUnpaid)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openAddSessionModal(student.id)}
                  className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 rounded-lg font-medium transition-colors"
                >
                  + Thêm buổi học
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <StudentModal
          student={editingStudent}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadStudents();
          }}
        />
      )}

      {showAddSessionModal && selectedStudentIdForSession && (
           <AddSessionModal
           onClose={() => {
               setShowAddSessionModal(false);
               setSelectedStudentIdForSession(null); // Đảm bảo reset ID khi đóng
           }}
           onSubmit={handleAddSessionSubmit}
       />
      )}
    </>
  );
}