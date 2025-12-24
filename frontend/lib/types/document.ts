export type DocumentCategory = 
  | 'GRAMMAR' | 'VOCABULARY' | 'READING' | 'LISTENING'
  | 'SPEAKING' | 'WRITING' | 'EXERCISES' | 'EXAM'
  | 'PET' | 'FCE' | 'IELTS' | 'TOEIC' | 'OTHER'; // PHÂN LOẠI TÀI LIỆU HỌC TẬP

export interface Document {
  id: number; // ID TÀI LIỆU
  title: string; // TIÊU ĐỀ HIỂN THỊ CỦA TÀI LIỆU
  fileName: string; // TÊN FILE GỐC (VÍ DỤ: EXERCISE_UNIT1.PDF)
  filePath: string; // ĐƯỜNG DẪN LƯU TRỮ (URL CLOUDINARY)
  fileSize: number; // DUNG LƯỢNG FILE TÍNH BẰNG BYTE
  fileType: string; // ĐỊNH DẠNG FILE (VÍ DỤ: APPLICATION/PDF)
  category: DocumentCategory; // MÃ DANH MỤC TÀI LIỆU
  categoryDisplayName: string; // TÊN DANH MỤC HIỂN THỊ TIẾNG VIỆT
  description?: string; // MÔ TẢ CHI TIẾT NỘI DUNG TÀI LIỆU
  studentId?: number; // ID HỌC SINH (NẾU TÀI LIỆU CHỈ DÀNH RIÊNG CHO 1 BẠN)
  studentName?: string; // TÊN HỌC SINH TƯƠNG ỨNG
  downloadCount: number; // TỔNG SỐ LƯỢT TẢI VỀ
  createdAt: string; // NGÀY TẢI LÊN HỆ THỐNG
  updatedAt: string; // NGÀY CẬP NHẬT GẦN NHẤT
  formattedFileSize: string; // DUNG LƯỢNG ĐÃ ĐỊNH DẠNG (VÍ DỤ: 2.5 MB)
}

export interface DocumentUploadRequest {
  title: string; // TIÊU ĐỀ TÀI LIỆU KHI UPLOAD
  category: DocumentCategory; // CHỌN DANH MỤC PHÂN LOẠI
  description?: string; // NHẬP MÔ TẢ (TÙY CHỌN)
  studentId?: number; // CHỈ ĐỊNH HỌC SINH (NẾU CÓ)
}

export interface DocumentStats {
  totalDocuments: number; // TỔNG SỐ FILE TRÊN HỆ THỐNG
  totalSize: number; // TỔNG DUNG LƯỢNG LƯU TRỮ (BYTE)
  formattedTotalSize: string; // TỔNG DUNG LƯỢNG HIỂN THỊ (VÍ DỤ: 500 MB)
  totalDownloads: number; // TỔNG LƯỢT TẢI CỦA TẤT CẢ FILE
  categoryStats: Record<string, number>; // THỐNG KÊ SỐ LƯỢNG FILE THEO TỪNG DANH MỤC
}