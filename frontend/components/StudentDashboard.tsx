'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, FileText, Clock, 
  TrendingUp, CheckCircle, AlertCircle, DollarSign 
} from 'lucide-react';
import { documentsApi, recurringSchedulesApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { SessionRecord, RecurringSchedule } from '@/lib/types';
import type { Document as DocumentType } from '@/lib/types';
import api from '@/lib/api';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [schedule, setSchedule] = useState<RecurringSchedule | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // ✅ CHECK if student ID exists
      if (!user?.studentId) {
        console.error('Student ID not found in user profile');
        setLoading(false);
        return;
      }

      // ✅ Fetch student-specific data from NEW endpoints
      const [mySessions, allDocuments] = await Promise.all([
        api.get(`/student/sessions?month=${currentMonth}`).then(res => res.data),
        documentsApi.getAll(),
      ]);

      setSessions(mySessions || []);
      
      // Filter documents for this student
      const myDocuments = allDocuments.filter(
        doc => !doc.studentId || doc.studentId === user.studentId
      );
      setDocuments(myDocuments);

      // Try to get schedule for this student
      try {
        const scheduleData = await recurringSchedulesApi.getByStudentId(user.studentId);
        setSchedule(scheduleData);
      } catch (error) {
        console.log('No schedule found for student');
      }

    } catch (error) {
      console.error('Error loading student dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // ✅ CHECK if studentId is linked
  if (!user?.studentId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">
          Tài khoản chưa được liên kết
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          Tài khoản của bạn chưa được liên kết với hồ sơ học sinh. 
          Vui lòng liên hệ giáo viên để được hỗ trợ.
        </p>
      </div>
    );
  }

  // Calculate stats
  const currentMonthSessions = sessions.filter(s => s.month === currentMonth);
  const totalHours = currentMonthSessions.reduce((sum, s) => sum + s.hours, 0);
  const totalAmount = currentMonthSessions.reduce((sum, s) => sum + s.totalAmount, 0);
  const paidAmount = currentMonthSessions.filter(s => s.paid).reduce((sum, s) => sum + s.totalAmount, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const completedSessions = currentMonthSessions.filter(s => s.completed).length;
  const upcomingSessions = currentMonthSessions.filter(s => !s.completed);

  // Recent documents
  const recentDocuments = documents.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-border">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          👋 Xin chào, {user?.fullName}!
        </h1>
        <p className="text-muted-foreground">
          Chào mừng bạn trở lại. Đây là tổng quan về quá trình học tập của bạn.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Sessions This Month */}
        <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-bold mb-1 uppercase tracking-wider">
                Buổi Học Tháng Này
              </p>
              <h3 className="text-3xl font-extrabold text-card-foreground group-hover:text-primary transition-colors">
                {currentMonthSessions.length}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {completedSessions} đã hoàn thành
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
          <div className="mt-4 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${currentMonthSessions.length > 0 ? (completedSessions / currentMonthSessions.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Total Hours */}
        <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-bold mb-1 uppercase tracking-wider">
                Tổng Số Giờ
              </p>
              <h3 className="text-3xl font-extrabold text-card-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {totalHours}h
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Trong tháng này
              </p>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <Clock className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20 w-fit px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/30">
            <TrendingUp size={14} className="mr-1.5" /> Tiếp tục phát huy!
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-bold mb-1 uppercase tracking-wider">
                Học Phí Tháng Này
              </p>
              <h3 className="text-2xl font-extrabold text-card-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {formatCurrency(totalAmount)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {unpaidAmount > 0 ? `Còn nợ ${formatCurrency(unpaidAmount)}` : 'Đã thanh toán đầy đủ'}
              </p>
            </div>
            <div className={`p-3 rounded-2xl group-hover:scale-110 transition-transform ${
              unpaidAmount > 0 
                ? 'bg-orange-100 dark:bg-orange-900/30' 
                : 'bg-emerald-100 dark:bg-emerald-900/30'
            }`}>
              {unpaidAmount > 0 ? (
                <AlertCircle className="text-orange-600 dark:text-orange-400" size={24} />
              ) : (
                <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={24} />
              )}
            </div>
          </div>
          <div className="mt-4 w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full h-1.5">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 100}%` }}
            />
          </div>
        </div>

        {/* Documents */}
        <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-bold mb-1 uppercase tracking-wider">
                Tài Liệu
              </p>
              <h3 className="text-3xl font-extrabold text-card-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {documents.length}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tài liệu có sẵn
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <FileText className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-card-foreground">Buổi Học Sắp Tới</h2>
              <p className="text-sm text-muted-foreground">Các buổi học trong tháng này</p>
            </div>
          </div>
          
          <div className="p-6">
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                <Calendar className="mx-auto text-muted-foreground mb-2" size={32} />
                <p className="text-muted-foreground font-medium">Không có buổi học sắp tới</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.slice(0, 5).map((session) => (
                  <div 
                    key={session.id}
                    className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors border border-border"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">
                          {formatDate(session.sessionDate)}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          ⏰ {formatTime(session.sessionDate)} • {session.hoursPerSession}h
                        </p>
                        {session.notes && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            📝 {session.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          session.paid 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                        }`}>
                          {session.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {formatCurrency(session.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Learning Schedule */}
          {schedule && (
            <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Calendar className="text-primary" size={18} />
                  Lịch Học Cố Định
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Các ngày trong tuần
                    </p>
                    <p className="font-bold text-foreground">
                      {schedule.daysOfWeekDisplay}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Thời gian
                    </p>
                    <p className="font-bold text-foreground">
                      {schedule.timeRange}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Số giờ mỗi buổi
                    </p>
                    <p className="font-bold text-foreground">
                      {schedule.hoursPerSession} giờ
                    </p>
                  </div>
                  {schedule.notes && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Ghi chú
                      </p>
                      <p className="text-sm text-foreground">
                        {schedule.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recent Documents */}
          <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <FileText className="text-primary" size={18} />
                Tài Liệu Mới Nhất
              </h3>
            </div>
            <div className="p-6">
              {recentDocuments.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-4">
                  Chưa có tài liệu nào
                </p>
              ) : (
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <FileText className="text-primary" size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {doc.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.categoryDisplayName} • {doc.formattedFileSize}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-card-foreground">Tiến Độ Học Tập</h2>
            <p className="text-sm text-muted-foreground">Thống kê các buổi học đã hoàn thành</p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-muted/30 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-2">
                {completedSessions}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Buổi đã hoàn thành
              </div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-2">
                {totalHours}h
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Tổng số giờ học
              </div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-2">
                {currentMonthSessions.length > 0 
                  ? Math.round((completedSessions / currentMonthSessions.length) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Tỷ lệ hoàn thành
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}