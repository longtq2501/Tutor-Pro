export interface ApiResponse<T> {
  success: boolean; // TRẠNG THÁI GỌI API THÀNH CÔNG HAY THẤT BẠI
  message: string; // THÔNG BÁO CHI TIẾT TỪ HỆ THỐNG
  data: T; // DỮ LIỆU CHÍNH TRẢ VỀ (KIỂU GENERIC TÙY THEO ENDPOINT)
  timestamp: string; // THỜI ĐIỂM SERVER PHẢN HỒI (ISO FORMAT)
}

export interface BankInfo {
  bankName: string; // TÊN NGÂN HÀNG (VÍ DỤ: VIETCOMBANK)
  accountNumber: string; // SỐ TÀI KHOẢN THỤ HƯỞNG
  accountName: string; // TÊN CHỦ TÀI KHOẢN (THƯỜNG VIẾT HOA KHÔNG DẤU)
  swiftCode: string; // MÃ ĐỊNH DANH NGÂN HÀNG (DÙNG CHO CHUYỂN KHOẢN QUỐC TẾ)
}