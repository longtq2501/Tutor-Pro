export type HomeworkStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'OVERDUE'; // CÁC TRẠNG THÁI CỦA BÀI TẬP
export type HomeworkPriority = 'LOW' | 'MEDIUM' | 'HIGH'; // MỨC ĐỘ ƯU TIÊN CỦA BÀI TẬP

export interface Homework {
  id: number; // ID BÀI TẬP
  studentId: number; // ID HỌC SINH ĐƯỢC GIAO
  studentName: string; // TÊN HỌC SINH
  sessionRecordId?: number; // LIÊN KẾT VỚI BUỔI HỌC CỤ THỂ (NẾU CÓ)
  title: string; // TIÊU ĐỀ BÀI TẬP
  description?: string; // MÔ TẢ CHI TIẾT YÊU CẦU
  dueDate: string; // HẠN CHÓT NỘP BÀI (DEADLINE)
  status: HomeworkStatus; // TRẠNG THÁI HIỆN TẠI
  priority: HomeworkPriority; // ĐỘ ƯU TIÊN
  attachmentUrls: string[]; // DANH SÁCH FILE ĐỀ BÀI DO GIA SƯ ĐÍNH KÈM
  tutorNotes?: string; // GHI CHÚ CỦA GIA SƯ KHI GIAO BÀI
  submittedAt?: string; // THỜI ĐIỂM HỌC SINH NỘP BÀI
  submissionUrls: string[]; // DANH SÁCH FILE BÀI LÀM CỦA HỌC SINH
  submissionNotes?: string; // GHI CHÚ CỦA HỌC SINH KHI NỘP BÀI
  score?: number; // ĐIỂM SỐ (SAU KHI CHẤM)
  feedback?: string; // NHẬN XÉT CỦA GIA SƯ (SAU KHI CHẤM)
  gradedAt?: string; // THỜI ĐIỂM HOÀN THÀNH CHẤM ĐIỂM
  createdAt: string; // NGÀY TẠO BÀI TẬP
  updatedAt: string; // NGÀY CẬP NHẬT GẦN NHẤT
  isOverdue: boolean; // KIỂM TRA ĐÃ QUÁ HẠN HAY CHƯA
  daysUntilDue?: number; // SỐ NGÀY CÒN LẠI ĐẾN HẠN
}

export interface HomeworkRequest {
  studentId: number; // ID HỌC SINH NHẬN BÀI
  sessionRecordId?: number; // ID BUỔI HỌC LIÊN QUAN
  title: string; // TIÊU ĐỀ BÀI TẬP MỚI
  description?: string; // NỘI DUNG GIAO BÀI
  dueDate: string; // THỜI HẠN PHẢI NỘP
  priority: HomeworkPriority; // THIẾT LẬP ĐỘ ƯU TIÊN
  tutorNotes?: string; // GHI CHÚ CỦA GIA SƯ
  attachmentUrls?: string[]; // DANH SÁCH FILE TÀI LIỆU
}

export interface HomeworkStats {
  totalHomeworks: number; // TỔNG SỐ BÀI TẬP ĐÃ GIAO
  assignedCount: number; // SỐ BÀI CHƯA LÀM
  inProgressCount: number; // SỐ BÀI ĐANG THỰC HIỆN
  submittedCount: number; // SỐ BÀI CHỜ CHẤM ĐIỂM
  gradedCount: number; // SỐ BÀI ĐÃ CHẤM XONG
  overdueCount: number; // SỐ BÀI ĐÃ QUÁ HẠN
  upcomingCount: number; // SỐ BÀI SẮP ĐẾN HẠN
  averageScore: number; // ĐIỂM SỐ TRUNG BÌNH CỦA HỌC SINH
}

export interface HomeworkSubmissionRequest {
  submissionNotes?: string; // GHI CHÚ CỦA HỌC SINH KHI NỘP
  submissionUrls?: string[]; // CÁC ĐƯỜNG DẪN FILE BÀI LÀM
}

export interface HomeworkGradingRequest {
  score: number; // ĐIỂM SỐ CHO BÀI TẬP (0-10)
  feedback?: string; // NHẬN XÉT CHI TIẾT CỦA GIA SƯ
}

export interface HomeworkStatusUpdateRequest {
  status: HomeworkStatus; // CẬP NHẬT TRẠNG THÁI MỚI CHO BÀI TẬP
}