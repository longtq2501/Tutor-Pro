
'use client';

import { useState, useEffect } from 'react';
import { User, Plus, Edit2, Trash2, Calendar, DollarSign, Clock, Power, Repeat, Sparkles } from 'lucide-react';
import { studentsApi, sessionsApi } from '@/lib/api';
import type { Student, SessionRecordRequest } from '@/lib/types';
import StudentModal from './StudentModal';
import AddSessionModal from './AddSessionModal';
import RecurringScheduleModal from './RecurringScheduleModal';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [selectedStudentIdForSession, setSelectedStudentIdForSession] = useState<number | null>(null);
  
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [selectedStudentForSchedule, setSelectedStudentForSchedule] = useState<Student | null>(null);

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsApi.getAll();
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSchedule = (student: Student) => {
    setSelectedStudentForSchedule(student);
    setShowRecurringModal(true);
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
    if (!confirm('CẢNH BÁO: Xóa học sinh sẽ xóa toàn bộ lịch sử học và doanh thu liên quan. Bạn có chắc chắn?')) {
      return;
    }
    try {
      await studentsApi.delete(id);
      await loadStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Không thể xóa học sinh!');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await studentsApi.toggleActive(id);
      await loadStudents();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Không thể thay đổi trạng thái!');
    }
  };

  const openAddSessionModal = (studentId: number) => {
    setSelectedStudentIdForSession(studentId);
    setShowAddSessionModal(true);
  };

  const handleAddSessionSubmit = async (
    sessionsCount: number,
    hoursPerSession: number,
    sessionDate: string,
    month: string,
  ) => {
    if (!selectedStudentIdForSession) return;
    try {
      const requestData: SessionRecordRequest = {
        studentId: selectedStudentIdForSession,
        month: month,
        sessions: sessionsCount,
        sessionDate: sessionDate,
        hoursPerSession: hoursPerSession
      };
      
      await sessionsApi.create(requestData);
      setShowAddSessionModal(false);
      setSelectedStudentIdForSession(null);
      await loadStudents(); // Reload to update stats
      alert(`Đã thêm buổi học thành công!`);
    } catch (error) {
      console.error('Error adding session:', error);
      alert('Không thể thêm buổi học!');
    }
  };

  const filteredStudents = students.filter(student => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return student.active === true;
    if (filterStatus === 'inactive') return student.active === false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const activeCount = students.filter(s => s.active).length;
  const inactiveCount = students.filter(s => !s.active).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Danh sách học sinh</h2>
          <p className="text-sm text-gray-500 mt-1 flex gap-3">
             <span className="text-green-600 font-medium">{activeCount} đang học</span>
             <span className="text-gray-300">|</span>
             <span className="text-red-500 font-medium">{inactiveCount} đã nghỉ</span>
          </p>
        </div>
        <button
          onClick={handleAddStudent}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Thêm Học Sinh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
        {(['all', 'active', 'inactive'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === status
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {status === 'all' && 'Tất cả'}
            {status === 'active' && 'Đang học'}
            {status === 'inactive' && 'Đã nghỉ'}
          </button>
        ))}
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <User className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">Không tìm thấy học sinh nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`group bg-white rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                student.active ? 'border-gray-200 hover:border-indigo-300' : 'border-gray-100 bg-gray-50 opacity-80'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    student.active ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight">{student.name}</h3>
                    <div className={`text-xs px-2 py-0.5 rounded-full w-fit mt-1 font-medium ${
                      student.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {student.active ? 'Đang học' : 'Đã nghỉ'}
                    </div>
                  </div>
                </div>
                
                {/* Actions Dropdown/Row */}
                <div className="flex gap-1">
                  <button onClick={() => handleEditStudent(student)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteStudent(student.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign size={16} className="text-gray-400 mr-2" />
                  <span className="font-semibold">{formatCurrency(student.pricePerHour)}</span> / giờ
                </div>
                {student.schedule && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <span className="line-clamp-1">{student.schedule}</span>
                  </div>
                )}
                {/* Revenue Snapshot */}
                <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between text-sm">
                   <div className="text-gray-500">Nợ: <span className="text-orange-600 font-bold">{formatCurrency(student.totalUnpaid || 0)}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <button
                    onClick={() => handleSetupSchedule(student)}
                    className="px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                 >
                    <Repeat size={16} />
                    Lịch Cố Định
                 </button>
                 <button
                    onClick={() => openAddSessionModal(student.id)}
                    disabled={!student.active}
                    className="px-3 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                    <Plus size={16} />
                    Buổi Học
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
            setSelectedStudentIdForSession(null);
          }}
          onSubmit={handleAddSessionSubmit}
        />
      )}

      {showRecurringModal && selectedStudentForSchedule && (
        <RecurringScheduleModal
          studentId={selectedStudentForSchedule.id}
          studentName={selectedStudentForSchedule.name}
          existingSchedule={null} // You might want to fetch existing schedule here if your API supports getting by studentID
          onClose={() => {
            setShowRecurringModal(false);
            setSelectedStudentForSchedule(null);
          }}
          onSuccess={() => {
            setShowRecurringModal(false);
            setSelectedStudentForSchedule(null);
            loadStudents();
            alert('✅ Đã lưu thiết lập lịch!');
          }}
        />
      )}
    </div>
  );
}
