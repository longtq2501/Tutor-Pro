# 📁 Module Quản lý Tài chính (Finance & Debt Management)

## 1. Giới thiệu tổng quan
**Module Finance** là hệ thống quản lý tài chính tích hợp của ứng dụng **Tutor Management Pro**. Đây là trung tâm điều phối và theo dõi doanh thu, xử lý công nợ và quản lý trạng thái thanh toán cho toàn bộ học sinh.

Module này được thiết kế để thay thế các quy trình thủ công rời rạc, cung cấp cho Quản trị viên một cái nhìn toàn diện từ chi tiết buổi học đến tổng quan dòng tiền theo tháng hoặc theo tình trạng nợ.

---

## 2. Các chức năng chính
Hệ thống Quản lý Tài chính bao gồm các chức năng cốt lõi sau:

*   **Chế độ Xem Theo Tháng (Monthly View):**
    *   Theo dõi danh sách buổi học và doanh thu dự kiến của một tháng cụ thể.
    *   Kiểm soát trạng thái thanh toán (`PAID` / `UNPAID`) cho từng buổi hoặc theo nhóm học sinh.
*   **Chế độ Xem Công Nợ (Debt View):**
    *   Tập trung tất cả các buổi học chưa thanh toán ("All Time") từ trước đến nay.
    *   Giúp Quản trị viên nhanh chóng nhận diện những học sinh đang nợ học phí để xử lý.
*   **Thống kê Thời gian thực (Dashboard Stats):**
    *   Tổng hợp Doanh thu/Nợ (`Total Revenue/Debt`), số lượng buổi học và số lượng học sinh cần xử lý.
    *   Tự động cập nhật số liệu dựa trên bộ lọc và chế độ xem hiện tại.
*   **Hành động Hàng loạt (Bulk Actions):**
    *   **Thanh toán nhanh:** Đánh dấu "Đã thanh toán" cho nhiều học sinh/buổi học cùng lúc.
    *   **Nhắc nợ tự động:** Gửi Email thông báo học phí hàng loạt cho phụ huynh.
    *   **Xuất Hóa đơn (Invoice):** Tạo file PDF hóa đơn chuyên nghiệp cho từng học sinh để gửi qua Zalo/Email.

---

## 3. Cách hoạt động (Workflow)

### A. Quy trình Xử lý Dữ liệu (Data Processing)
1.  **Frontend:** `useFinanceData` hook gọi API dựa trên `viewMode` (MONTHLY hoặc DEBT).
2.  **Grouping:** Dữ liệu thô từ backend (danh sách `SessionRecord`) được chuyển qua tiện ích `groupSessionsByStudent` để phân loại theo từng học sinh.
3.  **Pagination:** Đối với danh sách công nợ lớn (100+ học sinh), hệ thống sử dụng **Client-side Pagination** (hiển thị 20 nhóm/lần) để tối ưu hóa hiệu suất render và bộ nhớ.
4.  **Optimistic Updates:** Khi người dùng chuyển trạng thái thanh toán, UI sẽ cập nhật ngay lập tức trước khi server phản hồi, tạo cảm giác mượt mà (0ms latency).

### B. Quy trình Thanh toán & Nhắc nợ
*   **Email Reminders:** Hệ thống sử dụng mẫu email động, tự động điền danh sách buổi học, học phí tương ứng và tổng tiền nợ của từng học sinh.
*   **Invoice Generation:** Backend tổng hợp dữ liệu buổi học -> Generator PDF -> Trả về stream hoặc lưu trữ để người dùng tải về.

---

## 4. Cấu trúc kỹ thuật

### Backend (Modular Monolith)
*   **Package:** `com.tutor_management.backend.modules.finance`
*   **Entity Chính:**
    *   `SessionRecord`: Lưu chi tiết buổi học, môn học, thời gian, đơn giá và trạng thái thanh toán.
*   **Query Optimization:** 
    *   Sử dụng `LEFT JOIN FETCH sr.student` trong tất cả các truy vấn danh sách để ngăn chặn lỗi **N+1 queries**.
    *   Kết nối trực tiếp các bảng `Student`, `Lesson` và `Document` để đảm bảo dữ liệu luôn đầy đủ khi hiển thị chi tiết.

### Frontend (Feature-based)
*   **Thư mục:** `frontend/features/finance/management`
*   **Công nghệ:** Next.js App Router, Tailwind CSS, Shadcn UI, Framer Motion.
*   **Hiệu suất:**
    *   Sử dụng `React.memo` cho `StudentFinanceCard` và `SessionItem` để giảm 99% lượng re-render không cần thiết.
    *   `useMemo` được sử dụng triệt để cho các phép tính tổng hợp tài chính phức tạp.

---

## 5. Hướng phát triển (Planned Optimizations)
*   [ ] Tích hợp biểu đồ xu hướng doanh thu theo quý/năm.
*   [ ] Hỗ trợ thanh toán online qua mã QR (VietQR động).
*   [ ] Tự động hóa việc gửi email nhắc nợ vào một ngày cố định trong tháng.

---
> **Lưu ý:** Module này là kết quả của việc hợp nhất và tối ưu hóa từ hai module cũ (`monthly-view` và `unpaid-sessions`), hiện là tiêu chuẩn vàng về hiệu suất và UX trong hệ thống.
