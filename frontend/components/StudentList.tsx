
'use client';

import { useState, useEffect } from 'react';
import { User, Plus, Edit2, Trash2, Calendar, DollarSign, Repeat, Search, Filter } from 'lucide-react';
import { studentsApi, sessionsApi } from '../lib/api';
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
  const [searchTerm, setSearchTerm] = useState('');

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
      await loadStudents(); 
      alert(`Đã thêm buổi học thành công!`);
    } catch (error) {
      console.error('Error adding session:', error);
      alert('Không thể thêm buổi học!');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'active' ? student.active :
      !student.active;
      
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-3">
           <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
           <p className="text-muted-foreground font-medium animate-pulse">Đang tải danh sách...</p>
        </div>
      </div>
    );
  }

  const activeCount = students.filter(s => s.active).length;
  const inactiveCount = students.filter(s => !s.active).length;

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="bg-card rounded-3xl shadow-sm border border-border p-6">
         <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Title & Stats */}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-card-foreground flex items-center justify-center lg:justify-start gap-3">
                 <User className="text-indigo-600 dark:text-indigo-400" />
                 Danh sách học sinh
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm font-medium">
                 <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {activeCount} đang học
                 </span>
                 <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">
                    {inactiveCount} đã nghỉ
                 </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm học sinh..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  />
               </div>

               <button
                 onClick={handleAddStudent}
                 className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap"
               >
                 <Plus size={20} />
                 Thêm Học Sinh
               </button>
            </div>
         </div>

         {/* Filter Tabs */}
         <div className="mt-6 flex justify-center lg:justify-start">
            <div className="bg-muted p-1.5 rounded-xl flex gap-1">
              {(['all', 'active', 'inactive'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    filterStatus === status
                      ? 'bg-background text-primary shadow-sm scale-100'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  {status === 'all' && 'Tất cả'}
                  {status === 'active' && 'Đang học'}
                  {status === 'inactive' && 'Đã nghỉ'}
                </button>
              ))}
            </div>
         </div>
      </div>

      {/* Student Grid */}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border-2 border-dashed border-border">
          <div className="bg-muted p-6 rounded-full mb-4">
            <User className="text-muted-foreground" size={48} />
          </div>
          <h3 className="text-lg font-bold text-card-foreground">Không tìm thấy học sinh nào</h3>
          <p className="text-muted-foreground mt-1">Thử thay đổi bộ lọc hoặc tìm kiếm lại.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className={`
                group relative bg-card rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                ${student.active 
                   ? 'border-border hover:border-primary' 
                   : 'border-border bg-muted/30 opacity-80 hover:opacity-100'}
              `}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className={`
                     w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm transition-transform group-hover:scale-105
                     ${student.active 
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'}
                  `}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground leading-tight group-hover:text-primary transition-colors">
                      {student.name}
                    </h3>
                    <div className={`text-xs px-2.5 py-1 rounded-full w-fit mt-1.5 font-bold flex items-center gap-1.5 ${
                      student.active 
                        ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                        : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${student.active ? 'bg-emerald-500' : 'bg-destructive'}`} />
                      {student.active ? 'Đang học' : 'Đã nghỉ'}
                    </div>
                  </div>
                </div>
                
                {/* Edit Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 bg-background/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-border">
                  <button onClick={() => handleEditStudent(student)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Sửa">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteStudent(student.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Xóa">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-sm text-muted-foreground bg-slate-50 dark:bg-muted/50 p-3 rounded-xl border border-border">
                  <div className="bg-white dark:bg-background p-1.5 rounded-md shadow-sm mr-3 text-primary border border-border">
                    <DollarSign size={16} />
                  </div>
                  <span className="font-bold text-foreground">{formatCurrency(student.pricePerHour)}</span>
                  <span className="text-muted-foreground ml-1">/ giờ</span>
                </div>

                {student.schedule && (
                  <div className="flex items-center text-sm text-muted-foreground bg-slate-50 dark:bg-muted/50 p-3 rounded-xl border border-border">
                     <div className="bg-white dark:bg-background p-1.5 rounded-md shadow-sm mr-3 text-primary border border-border">
                        <Calendar size={16} />
                     </div>
                     <span className="font-medium line-clamp-1">{student.schedule}</span>
                  </div>
                )}
                
                {/* Revenue Snapshot */}
                <div className="flex justify-between items-center text-sm pt-2">
                   <span className="text-muted-foreground font-bold">Đang nợ</span>
                   <span className={`font-bold ${
                      (student.totalUnpaid || 0) > 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'
                   }`}>
                      {formatCurrency(student.totalUnpaid || 0)}
                   </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3">
                 <button
                    onClick={() => handleSetupSchedule(student)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-muted text-foreground hover:bg-slate-200 dark:hover:bg-accent border border-border rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                 >
                    <Repeat size={16} />
                    Lịch
                 </button>
                 <button
                    onClick={() => openAddSessionModal(student.id)}
                    disabled={!student.active}
                    className="px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                 >
                    <Plus size={16} />
                    Buổi Học
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
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
          existingSchedule={null}
          onClose={() => {
            setShowRecurringModal(false);
            setSelectedStudentForSchedule(null);
          }}
          onSuccess={() => {
            setShowRecurringModal(false);
            setSelectedStudentForSchedule(null);
            loadStudents();
          }}
        />
      )}
    </div>
  );
}
