# 📁 Module Calendar Management (Quản Lý Lịch Dạy)

## 1. Giới thiệu tổng quan
Module Calendar là trung tâm điều phối hoạt động giảng dạy, cung cấp giao diện trực quan để quản lý lịch học, theo dõi trạng thái thanh toán và điểm danh.

**Bối cảnh:**
- Module này thuộc ứng dụng **Tutor Management Pro**.
- Đây là công cụ chính để giáo viên theo dõi lịch trình hàng ngày/tháng.
- Được thiết kế để tối ưu hóa việc nhập liệu (drag-n-drop, auto-generate) và báo cáo doanh thu tức thì.

---

## 2. Các chức năng chính
Hệ thống Calendar bao gồm các chức năng cốt lõi sau:

*   **📅 Đa dạng chế độ xem (Multi-View Calendar):**
    *   Hỗ trợ 4 chế độ: Month, Week, Day, List.
    *   Giao diện responsive, tự động chuyển đổi layout trên mobile.
    *   Hiển thị chi tiết thông tin buổi học (Học sinh, Môn, Trạng thái, Học phí).

*   **⚡ Quản lý buổi học thông minh:**
    *   **Thêm mới nhanh:** Modal tối ưu UX, tự động điền thông tin học sinh.
    *   **Drag & Drop:** Kéo thả để dời lịch nhanh chóng (Dnd-Kit Integration).
    *   **Context Menu:** Chuột phải để truy cập nhanh các tác vụ (Sửa, Xóa, Đánh dấu hoàn thành).

*   **🔍 Lọc & Tìm kiếm nâng cao:**
    *   Lọc theo trạng thái (Dự kiến, Đã dạy, Đã hủy).
    *   Tìm kiếm theo tên học sinh hoặc môn học (Client-side filtering cực nhanh).

*   **🤖 Tự động hóa & Báo cáo:**
    *   **Auto-Generate:** Tạo lịch tự động từ lịch định kỳ (Recurring Schedules) chỉ với 1 click.
    *   **Stats Dashboard:** Thống kê doanh thu, số buổi dạy, số giờ dạy theo thời gian thực.
    *   **Export Excel:** Xuất báo cáo chấm công chi tiết để gửi phụ huynh.

---

## 3. Cách hoạt động (Workflow)

### A. Quy trình Tải dữ liệu & Caching
1.  **Bước 1:** `useCalendarData` gọi API lấy danh sách sessions của tháng hiện tại.
2.  **Bước 2:** **Prefetching Strategy:** Tự động tải trước dữ liệu tháng trước và tháng sau để chuyển tháng mượt mà (Instant Navigation).
3.  **Bước 3:** Dữ liệu được cache bởi React Query (staleTime 5 phút) để giảm tải server.

### B. Quy trình Thao tác buổi học (CRUD)
1.  **Thêm/Sửa:** Người dùng thao tác trên Modal -> Gọi API (`/api/sessions`) -> Optimistic UI Update (Cập nhật giao diện ngay lập tức trước khi server phản hồi).
2.  **Kéo thả (Drag-n-Drop):**
    *   User kéo session sang ngày mới using `@dnd-kit`.
    *   Frontend cập nhật vị trí ngay lập tức (Visual feedback).
    *   Gọi API update background. Nếu lỗi, tự động revert vị trí cũ (**Optimistic Rollback**).

---

## 4. Cấu trúc kỹ thuật

### Backend (Modular Monolith)
*   **Package:** `com.tutor_management.backend.modules.finance` (Sessions thuộc Finance module)
*   **Entity Chính:**
    *   `SessionRecord`: Lưu trữ thông tin buổi học, tiền học, trạng thái.
    *   `RecurringSchedule`: Cấu hình lịch lặp lại để sinh SessionRecord.
*   **Query Optimization:**
    *   `@Query` JPQL tùy chỉnh để load dữ liệu theo range ngày.
    *   Indexing trên cột `sessionDate` và `studentId`.

### Frontend (Feature-based)
*   **Thư mục:** `frontend/features/calendar`
*   **Công nghệ:** Next.js 15, React Query v5, Framer Motion, Dnd-Kit.
*   **Components Chính:**
    *   `CalendarView`: Container chính, quản lý state toàn cục.
    *   `CalendarModals`: Quản lý hiển thị các modal (Add, Edit, Day Detail) với `AnimatePresence`.
    *   `useCalendarData`: Hook chuyên biệt xử lý fetching và caching logic.
*   **Hiệu suất:**
    *   **React.memo & useCallback:** Giảm 95% re-renders không cần thiết khi hover hoặc drag.
    *   **Code Splitting:** Lazy load các modal nặng (`DayDetailModal`, `LessonDetailModal`).

### Performance Metrics (Tối ưu hóa P1)
| Metric | Trước khi tối ưu | Sau khi tối ưu | Cải thiện |
|:-------|:----------------:|:--------------:|:---------:|
| Initial Load | ~1.8s | **< 0.8s** | ⚡ 55% |
| Month Navigation | ~0.5s - 1s | **Instant (~0ms)** | 🚀 Prefetching |
| Drag Interaction | Laggy (~50ms) | **Smooth (60fps)** | 🚄 Optimized Dnd |

---

## 5. Use Cases & User Stories

### Use Case 1: Lên lịch tự động đầu tháng
**Actor:** Giáo viên
**Mô tả:** Giáo viên muốn tạo nhanh lịch dạy cho cả tháng dựa trên lịch cố định.
**Luồng chính:**
1. Mở Calendar, nhấn nút "Tự động tạo lịch".
2. Hệ thống quét `RecurringSchedule`, tính toán ngày lễ/nghỉ.
3. Hiển thị thông báo (toast) tiến trình.
4. Lịch mới xuất hiện ngay lập tức trên giao diện.

### Use Case 2: Điều chỉnh lịch dạy đột xuất
**Actor:** Giáo viên
**Mô tả:** Học sinh xin đổi buổi học sang ngày khác.
**Luồng chính:**
1. Giáo viên mở Calendar, tìm buổi học của học sinh.
2. Kéo thả buổi học sang ô ngày mới.
3. Hệ thống cập nhật ngày giờ và tính toán lại doanh thu nếu cần.

---

## 6. API Endpoints Reference

| Method | Endpoint | Mô tả |
|:-------|:---------|:------|
| GET | `/api/sessions/by-month?month=YYYY-MM` | Lấy danh sách buổi học trong tháng (kèm Students) |
| POST | `/api/sessions` | Tạo buổi học mới |
| PUT | `/api/sessions/{id}` | Cập nhật thông tin buổi học |
| DELETE | `/api/sessions/{id}` | Xóa buổi học |
| POST | `/api/recurring-schedules/generate?month=YYYY-MM` | Trigger tạo lịch tự động |
| GET | `/api/sessions/export/excel?month=YYYY-MM` | Tải file báo cáo Excel |

---

## 7. Testing Strategy

### Unit/Integration Tests
*   **Frontend:** Linting strict mode, Prop validation.
*   **Backend:** JUnit 5 test cho `SessionRecordService` (Logic tính tiền, logic trùng lịch).

---

## 8. Hướng phát triển (Planned Optimizations)
*   [ ] Tích hợp Google Calendar Sync (2-way sync).
*   [ ] Thông báo nhắc lịch học qua Zalo/Email.
*   [ ] Chế độ xem "TimelineDay" chi tiết hơn cho lịch dày đặc.

---

## 9. Dependencies & Related Modules
*   **Phụ thuộc vào:**
    *   `Student Module`: Lấy thông tin học sinh để gán vào session.
    *   `Finance Module`: Session là cơ sở để tạo Invoice và tính doanh thu.

---

> **Lưu ý:** Module này đã được migration hoàn toàn sang cấu trúc "Feature-based" và tách biệt logic data fetching ra khỏi UI component để đảm bảo "Single Responsibility Principle".
