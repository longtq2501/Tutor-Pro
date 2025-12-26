export interface RecurringSchedule {
  id: number; // ID LỊCH HỌC ĐỊNH KỲ
  studentId: number; // ID HỌC SINH LIÊN KẾT
  studentName: string; // TÊN HỌC SINH
  daysOfWeek: number[]; // MẢNG CÁC THỨ TRONG TUẦN (VÍ DỤ: [1,3,5] LÀ THỨ 2,4,6)
  daysOfWeekDisplay: string; // CHUỖI HIỂN THỊ CÁC THỨ (VÍ DỤ: "THỨ 2, 4, 6")
  startTime: string; // GIỜ BẮT ĐẦU (ĐỊNH DẠNG "HH:MM")
  endTime: string; // GIỜ KẾT THÚC (ĐỊNH DẠNG "HH:MM")
  timeRange: string; // KHOẢNG THỜI GIAN HIỂN THỊ (VÍ DỤ: "18:00-20:00")
  hoursPerSession: number; // TỔNG SỐ GIỜ MỖI BUỔI HỌC
  startMonth: string; // THÁNG BẮT ĐẦU ÁP DỤNG LỊCH (YYYY-MM)
  endMonth?: string; // THÁNG KẾT THÚC ÁP DỤNG LỊCH (TÙY CHỌN)
  active: boolean; // TRẠNG THÁI LỊCH CÒN HIỆU LỰC HAY KHÔNG
  subject?: string; // MÔN HỌC (VÍ DỤ: "TOÁN", "LÝ")
  notes?: string; // GHI CHÚ RIÊNG CHO LỊCH TRÌNH
  createdAt: string; // THỜI ĐIỂM TẠO LỊCH
  updatedAt: string; // THỜI ĐIỂM CẬP NHẬT GẦN NHẤT
}

export interface RecurringScheduleRequest {
  studentId: number; // ID HỌC SINH CẦN TẠO LỊCH
  daysOfWeek: number[]; // DANH SÁCH CÁC THỨ TRONG TUẦN
  startTime: string; // THỜI GIAN BẮT ĐẦU
  endTime: string; // THỜI GIAN KẾT THÚC
  hoursPerSession: number; // SỐ GIỜ MỖI BUỔI ĐỂ TÍNH TIỀN
  subject?: string; // MÔN HỌC
  startMonth: string; // THÁNG BẮT ĐẦU (YYYY-MM)
  endMonth?: string; // THÁNG KẾT THÚC (NẾU CÓ)
  active?: boolean; // THIẾT LẬP TRẠNG THÁI HOẠT ĐỘNG
  notes?: string; // NỘI DUNG GHI CHÚ
}