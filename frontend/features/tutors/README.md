# 📁 Module Tutor Management (Quản Lý Gia Sư)

## 1. Giới thiệu tổng quan
Module Tutor Management cung cấp các công cụ toàn diện cho Admin quản lý hồ sơ gia sư, theo dõi hiệu suất, và đảm bảo tính toàn vẹn dữ liệu trong hệ thống Tutor Management Pro.

**Bối cảnh:**
- Module này thuộc ứng dụng **Tutor Management Pro**
- Đây là trung tâm để Admin quản lý đội ngũ gia sư (CRUD), phân quyền và theo dõi doanh thu.
- Được thiết kế để hỗ trợ mô hình Multi-tenancy (Đa người thuê), đảm bảo dữ liệu giữa các gia sư được cô lập tuyệt đối.

---

## 2. Các chức năng chính
Hệ thống Tutor Management bao gồm các chức năng cốt lõi sau:

*   **Quản Lý Hồ Sơ Gia Sư (CRUD):**
    *   Tạo mới, Cập nhật, Xóa hồ sơ gia sư.
    *   **Atomic User Creation:** Tự động tạo tài khoản đăng nhập (User) khi tạo hồ sơ Gia sư trong cùng một transaction.
    *   Tìm kiếm theo tên/email và lọc theo trạng thái gói đăng ký (Active/Expired).

*   **Thống Kê & Hiệu Suất (Stats):**
    *   Xem nhanh số lượng học sinh đang hoạt động.
    *   Tổng số buổi dạy trong tháng hiện tại.
    *   Tổng doanh thu (Paid + Unpaid) với định dạng tiền tệ chuẩn Việt Nam.
    *   **Data Isolation:** Số liệu thống kê được tính toán riêng biệt cho từng gia sư.

*   **Bảo Mật & Cô Lập Dữ Liệu:**
    *   Đảm bảo mỗi gia sư chỉ truy cập được dữ liệu của chính mình (Học sinh, Buổi học, Lịch trình, Bài tập).
    *   Cơ chế `SecurityContextHolder` lọc dữ liệu tự động ở tầng Service/Repository.

---

## 3. Cách hoạt động (Workflow)

### A. Quy trình Tạo Gia Sư Mới
1.  **Bước 1:** Admin nhập thông tin: Full Name, Email, Password, Phone, Plan.
2.  **Bước 2:** Hệ thống kiểm tra sự tồn tại của Email trong cả bảng `users` và `tutors`.
3.  **Bước 3:** Backend thực hiện Transaction:
    *   Tạo `User` với role `TUTOR`.
    *   Tạo `Tutor` liên kết với `User` vừa tạo.
4.  **Kết quả:** Tài khoản gia sư sẵn sàng sử dụng ngay lập tức mà không cần bước đăng ký phụ.

### B. Quy trình Xem & Thống Kê
1.  **Bước 1:** Admin chọn một gia sư từ danh sách.
2.  **Bước 2:** Hệ thống gọi API `getTutorStats(id)`.
3.  **Bước 3:** Backend thực hiện các query tổng hợp (Aggregation Queries):
    *   `countByTutorIdAndActiveTrue`: Đếm học sinh.
    *   `sumSessionsByMonthAndTutorId`: Đếm số buổi.
    *   `getFinanceSummaryByTutorId`: Tính tổng doanh thu.

---

## 4. Cấu trúc kỹ thuật

### Backend (Modular Monolith)
*   **Package:** `com.tutor_management.backend.modules.tutor`
*   **Entity Chính:**
    *   `Tutor`: Chứa thông tin nghiệp vụ (Phone, Plan, Status), quan hệ 1-1 với `User`.
    *   `User`: Chứa thông tin xác thực (Email, Password, Role).
*   **Query Optimization:** 
    *   Sử dụng `@EntityGraph` để fetch eager thông tin User khi query Tutor, tránh N+1.
    *   Index trên các trường `userId`, `email`, `subscriptionStatus`.
*   **API Endpoints:**
    *   `GET /api/admin/tutors` - Lấy danh sách phân trang & lọc.
    *   `GET /api/admin/tutors/{id}/stats` - Lấy thống kê hiệu suất.
    *   `POST /api/admin/tutors` - Tạo gia sư & tài khoản User.

### Frontend (Feature-based)
*   **Thư mục:** `frontend/features/tutors`
*   **Công nghệ:** Next.js 15 (App Router), React Query, Shadcn UI, Tailwind CSS.
*   **Components Chính:**
    *   `TutorTable`: Hiển thị danh sách, hỗ trợ responsive (Table cho Desktop, Card cho Mobile).
    *   `TutorFormModal`: Form tạo/chỉnh sửa với Validation (React Hook Form + Zod).
    *   `TutorDetailModal`: Xem chi tiết và thống kê (Read-only mode).
    *   `TutorStatsCard`: Widget hiển thị số liệu với xử lý hiển thị số lớn (Truncate + Tooltip).
*   **Hiệu suất:**
    *   `onView` action giúp trải nghiệm mượt mà, không cần chuyển trang.
    *   Sử dụng Skeleton Loading cho trải nghiệm người dùng tốt hơn.

---

## 5. Use Cases & User Stories

### Use Case 1: Tạo tài khoản cho gia sư mới
**Actor:** Admin
**Mô tả:** Admin thêm một gia sư mới vào hệ thống để họ có thể bắt đầu giảng dạy.
**Luồng chính:**
1. Admin mở modal "Add Tutor".
2. Nhập thông tin cá nhân và gói đăng ký.
3. Nhấn "Save". Hệ thống tự động tạo tài khoản đăng nhập và hồ sơ.

### Use Case 2: Kiểm tra hiệu suất gia sư
**Actor:** Admin
**Mô tả:** Admin muốn xem nhanh doanh thu và số lượng học sinh của một gia sư cụ thể.
**Luồng chính:**
1. Admin click vào một dòng trong bảng danh sách gia sư.
2. Modal "Tutor Details" hiện ra.
3. Admin xem các thẻ số liệu (Students, Sessions, Revenue) được cập nhật theo thời gian thực.

---

## 6. Optimization & Performance Metrics

### Đã hoàn thành (Optimizations)
1.  **Backend Pagination:** Chuyển đổi toàn bộ list API sang phân trang (Pageable), giảm tải bộ nhớ server cho danh sách lớn.
2.  **Data Isolation (Security):** Tách biệt dữ liệu tuyệt đối giữa các gia sư (Students, Sessions, Exercises) bằng `tutor_id`.
3.  **UI Performance:**
    *   Refactor `TutorTable` để hỗ trợ Mobile (Card View) -> Tăng trải nghiệm trên thiết bị di động.
    *   Lazy loading stats data khi mở Modal -> Giảm tải cho trang danh sách chính.

---

## 8. Hướng phát triển (Planned Optimizations)

*   [ ] Tích hợp tính năng Export danh sách gia sư ra Excel.
*   [ ] Thêm biểu đồ tăng trưởng doanh thu theo tháng (Chart.js/Recharts).
*   [ ] Cron job tự động chuyển trạng thái "Expired" khi hết hạn gói đăng ký.
*   [ ] Gửi email thông báo tự động khi tạo tài khoản thành công.

---

## 9. Dependencies

*   **Phụ thuộc vào:**
    *   `Auth Module` - Để quản lý User và Role.
    *   `Finance Module/Session Records` - Để tính toán doanh thu và số buổi.
    *   `Student Module` - Để đếm số lượng học sinh.

---

> **Lưu ý:** Module này đóng vai trò nền tảng cho tính năng Multi-tenancy của toàn bộ hệ thống. Bất kỳ thay đổi nào về `Tutor` entity cần được kiểm tra kỹ lưỡng về tác động đến các module con (Student, Finance, Exercise).
