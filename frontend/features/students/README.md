# 📁 Module Quản lý Học sinh (Student Management)

## 1. Giới thiệu tổng quan
Module **Quản lý Học sinh** là thành phần cốt lõi của hệ thống **Tutor Management Pro**, chịu trách nhiệm quản lý toàn bộ vòng đời của học sinh, từ khi nhập học đến khi kết thúc lộ trình học tập.

**Bối cảnh:**
- Module này là trung tâm dữ liệu, kết nối với các module Finance, Calendar và Exercise.
- Được thiết kế để tối ưu hóa việc quản lý thông tin cá nhân, lịch học, học phí và mối liên hệ với phụ huynh.
- Phiên bản hiện tại đã được nâng cấp lên **production-ready** với hiệu suất cao và giao diện mobile-first.

---

## 2. Các chức năng chính
Hệ thống Quản lý Học sinh bao gồm các chức năng cốt lõi sau:

*   **Quản lý Hồ sơ Học sinh:**
    *   Lưu trữ thông tin chi tiết (tên, số điện thoại, ngày bắt đầu).
    *   Trạng thái hoạt động (Đang học/Đã nghỉ).
    *   Mối liên kết trực tiếp với Phụ huynh để quản lý thông tin liên lạc tập trung.
    
*   **Thiết lập Lịch học & Học phí:**
    *   Quản lý lịch dự kiến linh hoạt (ví dụ: T2-4-6).
    *   Thiết lập mức phí theo giờ (`pricePerHour`) độc lập cho từng học sinh.
    
*   **Theo dõi Nợ học phí:**
    *   Hiển thị tình trạng nợ hiện tại ngay trên thẻ học sinh.
    *   Tích hợp badge cảnh báo nợ (Red Alert) khi số nợ > 0.

*   **Bộ lọc & Tìm kiếm Nâng cao:**
    *   Tìm kiếm nhanh theo tên học sinh, tên phụ huynh hoặc số điện thoại.
    *   Lọc theo trạng thái (Active/Inactive).

---

## 3. Cách hoạt động (Workflow)

### A. Quy trình Thêm/Sửa Học sinh
1.  **Giao diện:** Người dùng tương tác qua `StudentModal`.
2.  **Logic Form:** `useStudentForm` hook xử lý validation và chuẩn bị dữ liệu `StudentRequest`.
3.  **Xử lý API:** Dữ liệu được gửi qua `studentsApi` đến backend Spring Boot.
4.  **Hành động đặc biệt:** Sử dụng `useScrollLock` để khóa cuộn trang body khi modal mở, đảm bảo trải nghiệm người dùng đồng nhất.

### B. Quy trình Hiển thị Danh sách (Optimized Grid)
*   **Virtualization/Lazy Loading:** Danh sách sử dụng `OptimizedStudentGrid` để render học sinh theo từng đợt (Intersection Observer), giúp duy trì hiệu suất ổn định ngay cả với hàng trăm học sinh.
*   **Skeleton Loading:** Áp dụng `StudentCardSkeleton` giúp giảm hiện tượng layout shift và mang lại cảm giác phản hồi tức thì (< 200ms).

---

## 4. Cấu trúc kỹ thuật

### Backend (Modular Monolith)
*   **Package:** `com.tutor_management.backend.modules.student`
*   **Entity Chính:**
    *   `Student`: Chứa thông tin học sinh và quan hệ `@ManyToOne` với `Parent`.
*   **API Endpoints:**
    *   `GET /api/students` - Lấy danh sách học sinh (có hỗ trợ filter).
    *   `POST /api/students` - Tạo mới học sinh.
    *   `PUT /api/students/{id}` - Cập nhật thông tin học sinh.

### Frontend (Feature-based)
*   **Thư mục:** `frontend/features/students`
*   **Công nghệ:** Next.js 15, Tailwind CSS 4, Lucide React, Framer Motion.
*   **Hiệu suất:**
    *   **Skeleton Strategy:** Chuyển từ Spinner tròn sang Skeleton Card (match 1:1 với UI thật).
    *   **Render Optimization:** Sử dụng `React.memo` cho `UnifiedStudentCard`.
    *   **SOP Compliance:** Toàn bộ components được refactor xuống **< 50 dòng** code mỗi function.

---

## 5. Use Cases & User Stories

### Use Case 1: Thêm học sinh mới và liên kết phụ huynh
**Actor:** Giáo viên/Quản trị viên  
**Luồng chính:**
1. Mở modal "Thêm học sinh".
2. Nhập thông tin và chọn phụ huynh có sẵn từ danh sách thả xuống (searchable).
3. Hệ thống tự động cập nhật số lượng con em cho phụ huynh đó.

---

## 6. Các Tối ưu hóa đã hoàn thành

| Mục tiêu | Giải pháp | Kết quả |
| :--- | :--- | :--- |
| **Tốc độ tải** | Skeleton Loading & Lazy Load Grid | Tránh giật lag, load danh sách cực nhanh. |
| **Giao diện SE** | Mobile-first padding & Responsive Avatar | Không tràn viền trên màn hình 375px. |
| **Code Quality** | Component Extraction & Generic Types | Loại bỏ `any`, file chính < 45 dòng. |
| **UX cuộn** | `useScrollLock` Hook | Sửa lỗi kẹt scroll khi đóng/mở nhiều modal. |

---

## 7. Hướng phát triển

*   [ ] Tích hợp biểu đồ tiến bộ học tập.
*   [ ] Gửi thông báo tự động cho phụ huynh qua Zalo/Email khi tạo hồ sơ.
*   [ ] Hệ thống ghi chú bằng giọng nói cho mỗi buổi học.

---

> **Lưu ý:** Module này đã chuyển sang trạng thái **Done** trong Continuity Ledger và đáp ứng đầy đủ tiêu chuẩn **Clean Code Criteria**.
