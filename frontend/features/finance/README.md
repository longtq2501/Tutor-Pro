# 📁 Module Quản lý Tài chính (Finance Management)

## 1. Giới thiệu tổng quan
Module **Quản lý Tài chính** là hệ thống xử lý dòng tiền, học phí và hóa đơn của **Tutor Management Pro**. Nó hợp nhất việc theo dõi buổi học, quản lý nợ và xuất hóa đơn chuyên nghiệp vào một bảng điều khiển duy nhất.

**Bối cảnh:**
- Module này chuyển đổi từ việc quản lý bảng tính rời rạc sang một hệ thống quản lý tập trung.
- Giải quyết vấn đề dữ liệu không đồng nhất giữa Dashboard và chi tiết tài chính.
- Cung cấp công cụ cho phép gia sư quản lý hàng trăm buổi học và hàng chục học sinh chỉ với vài thao tác.

---

## 2. Các chức năng chính
Hệ thống Quản lý Tài chính bao gồm các chức năng cốt lõi sau:

*   **Bảng điều khiển Tài chính (Finance Dashboard):**
    *   Xem tổng quan doanh thu, số nợ và số học sinh đang học.
    *   Chế độ xem linh hoạt: `Monthly View` (Theo tháng) và `Unpaid Sessions` (Số buổi chưa đóng).
    
*   **Quản lý Buổi học (Session Tracking):**
    *   Ghi nhận buổi học với trạng thái: `Đã dạy`, `Đã thanh toán`.
    *   Tính năng `Toggle Payment` và `Toggle Completed` cực nhanh với xử lý phía client.
    *   Nhân bản buổi học (`Duplicate`) để tiết kiệm thời gian nhập liệu.

*   **Hệ thống Hóa đơn (Invoice System):**
    *   Xem trước hóa đơn chi tiết cho từng học sinh.
    *   Xuất file PDF chuyên nghiệp với mã VietQR động để nhận thanh toán.
    *   Gửi hóa đơn hàng loạt qua Email cho phụ huynh.

*   **Xuất dữ liệu (Data Export):**
    *   Xuất danh sách buổi học ra file Excel phục vụ lưu trữ và đối soát thủ công.

---

## 3. Cách hoạt động (Workflow)

### A. Quy trình Chốt lương & Xuất hóa đơn
1.  **Ghi nhận:** Giáo viên đánh dấu hoàn thành các buổi học trong tháng.
2.  **Kiểm tra:** Hệ thống tự động tính toán tổng học phí dựa trên số giờ dạy và đơn giá từng học sinh.
3.  **Xuất bản:** Người dùng chọn "Tải PDF" hoặc "Gửi Email" trực tiếp từ giao diện.
4.  **Tối ưu:** Sử dụng **Backend PDF Generation (iText)** thay vì frontend để đảm bảo định dạng chuyên nghiệp và tốc độ < 500ms.

### B. Quy trình Đối soát nợ
*   **Cơ chế:** Sử dụng `useQuery` với `Stale-While-Revalidate` để đảm bảo số liệu nợ luôn khớp với màn hình Dashboard.
*   **Hành động:** Khi một buổi học được đánh dấu "Đã thanh toán", cache của Dashboard và Student List sẽ được invalidation ngay lập tức (Optimistic Updates).

---

## 4. Cấu trúc kỹ thuật

### Backend (Modular Monolith)
*   **Package:** `com.tutor_management.backend.modules.session` & `invoice`
*   **Query Optimization:** 
    *   Sử dụng **JPQL Custom Queries** để tính toán stats trực tiếp trên DB, tránh load toàn bộ object vào RAM.
    *   Caffeine Caching cho các thống kê doanh thu nặng.
*   **API Endpoints:**
    *   `GET /api/sessions/month/{month}` - Lấy dữ liệu tài chính theo tháng.
    *   `POST /api/invoices/generate` - Tạo dữ liệu xem trước hóa đơn.
    *   `GET /api/sessions/export/excel` - Xuất Excel.

### Frontend (Feature-based)
*   **Thư mục:** `frontend/features/finance`
*   **Hiệu suất:**
    *   **Load Time:** Cải thiện **75%** tốc độ tải ban đầu nhờ view-level skeletons.
    *   **Memory:** Giảm **80%** mức chiếm dụng bộ nhớ bằng cách tối ưu hóa các vòng lặp rendering.
    *   **SOP Compliance:** Toàn bộ components (`FinanceHeader`, `FinanceStats`) được tách nhỏ xuống **< 50 dòng**.

---

## 5. Use Cases & User Stories

### Use Case 1: Xuất hóa đơn tổng hợp cuối tháng
**Actor:** Gia sư  
**Mô tả:** Cuối tháng, gia sư cần gửi thông báo học phí cho tất cả phụ huynh.  
**Luồng chính:**
1. Chọn tháng hiện tại.
2. Nhấn "Gửi tất cả hóa đơn" (Batch Email).
3. Hệ thống gửi email kèm PDF và mã QR thanh toán cho từng phụ huynh tương ứng.

---

## 6. Các Tối ưu hóa đã hoàn thành (Metrics)

| Chỉ số | Trước tối ưu | Sau tối ưu |
| :--- | :--- | :--- |
| **Initial Page Load** | ~2.5s (Spinner) | **< 0.8s (Skeleton)** |
| **Data Consistency** | Thường lệch giữa Dash/Finance | **Khớp 100% (SWR)** |
| **Tính di động** | Bị tràn ngang trên mobile | **Phẳng 100% (SE Optimized)** |
| **Code Maintainability** | File hàng trăm dòng | **Minified components (< 50 lines)** |

---

## 7. Hướng phát triển

*   [ ] Tự động nhắc nợ qua Telegram/Zalo Bot.
*   [ ] Tích hợp API Ngân hàng để tự động xác nhận thanh toán khi tiền về tài khoản.
*   [ ] Dự báo doanh thu cho 3 tháng tiếp theo dựa trên lịch học cố định.

---

> **Lưu ý:** Module này đã chuyển sang trạng thái **Done** và là tiêu chuẩn cho thiết kế Dashboard của toàn bộ hệ thống.
