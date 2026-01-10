# 🔔 Module Thông Báo (Real-time Notifications)

## 1. Giới thiệu tổng quan
**Module Notification** là hệ thống giao tiếp thời gian thực của **Tutor Management Pro**. Hệ thống cho phép tự động gửi các thông báo quan trọng đến người dùng (Gia sư và Học sinh) dựa trên các sự kiện nghiệp vụ phát sinh, giúp tăng tính tương tác và đảm bảo thông tin được truyền tải tức thì.

Module này sử dụng cơ chế **Event-Driven Architecture** ở Backend kết hợp với **Server-Sent Events (SSE)** để đẩy dữ liệu xuống Frontend mà không cần người dùng phải tải lại trang.

---

## 2. Các chức năng chính
Hệ thống quản lý thông báo bao gồm các chức năng cốt lõi sau:

*   **Thông báo thời gian thực (Real-time Notifications):**
    *   Nhận thông báo ngay lập tức qua **Toast** (bản tin ngắn) và cập nhật **Badge** (số lượng chưa đọc) trên quả chuông.
    *   Tự động phân loại thông báo: Bài tập mới được nộp (`EXAM_SUBMITTED`), Đã chấm điểm (`EXAM_GRADED`), Được giao bài tập (`EXAM_ASSIGNED`), Bài tập cập nhật (`EXAM_UPDATED`), Lịch học mới (`SCHEDULE_CREATED`), Hệ thống (`SYSTEM`).
*   **Quản lý danh sách thông báo (Notification List):**
    *   Xem danh sách thông báo trong **Popover** tiện lợi.
    *   Hiển thị icon theo loại, nội dung tóm tắt và **thời gian tương đối** (ví dụ: "vừa xong", "5 phút trước").
*   **Tương tác thông báo:**
    *   **Đánh dấu đã đọc:** Người dùng có thể click vào từng thông báo để chuyển trạng thái.
    *   **Đánh dấu tất cả đã đọc:** Tính năng dọn sạch hộp thư chỉ với một click.
*   **Cơ chế kết nối bền bỉ:**
    *   Hỗ trợ tự động kết nối lại (Auto-reconnect) khi mất mạng.
    *   Hệ thống **Heartbeat** duy trì kết nối qua Docker/Proxy.

---

## 3. Cách hoạt động (Workflow)

### A. Quy trình phát sinh thông báo (Backend Flow)
1.  **Business Logic:** Một hành động xảy ra (ví dụ: Học sinh nộp bài tập, Giáo viên giao bài mới).
2.  **Event Publishing:** Service tương ứng bắn sự kiện (`ExamSubmittedEvent`, `ExamAssignedEvent`, `ScheduleCreatedEvent`, vv.).
3.  **Listener Handling:** `NotificationListener` bắt sự kiện, lưu thông tin vào Database MySQL.
4.  **Real-time Push:** `SseEmittersManager` tìm kết nối còn hiệu lực của người nhận và đẩy dữ liệu qua luồng SSE.

### B. Quy trình hiển thị dữ liệu (Frontend Flow)
1.  **Connection:** Khi người dùng đăng nhập, `useSSE` hook thiết lập kết nối tới `/api/notifications/stream`.
2.  **Listening:** Khi có dòng dữ liệu mới, hook sẽ gọi callback để hiện **Toast** và báo cho **React Query**.
3.  **Invalidation:** React Query làm mới (refetch) dữ liệu về `unread-count` và `list` để đảm bảo UI đồng bộ 100%.

---

## 4. Cấu trúc kỹ thuật

### Backend (Event-Driven)
*   **Package:** `com.tutor_management.backend.modules.notification`
*   **Entity:** `Notification` (Lưu lịch sử thông báo, trạng thái `isRead`).
*   **Infrastructure:**
    *   `SseEmittersManager`: Quản lý bộ nhớ các kết nối SSE theo `userId`.
    *   `NotificationListener`: Xử lý logic tách biệt (Decoupled) khỏi nghiệp vụ chính.
*   **Optimized Query:** Sử dụng Index `idx_recipient_read` để lấy số lượng chưa đọc cực nhanh (< 10ms).

### Frontend (User Experience)
*   **Thư mục:** `frontend/features/notifications`
*   **Component:**
    *   `NotificationBell`: Nút quả chuông kèm badge động.
    *   `NotificationList`: Danh sách hiển thị cuộn trang (ScrollArea) và các nút hành động.
*   **State Management:** Sử dụng `@tanstack/react-query` để quản lý trạng thái đồng bộ giữa local cache và server.

---

## 5. Hướng phát triển (Planned Optimizations)
*   [ ] Hỗ trợ thông báo qua Email/Zalo cho các sự kiện khẩn cấp.
*   [ ] Cho phép người dùng tùy chỉnh bật/tắt các loại thông báo.
*   [ ] Tích hợp tính năng "Xóa thông báo" vĩnh viễn khỏi danh sách.

---

## 6. Hướng dẫn Kiểm thử (Testing Guide)

Để đảm bảo hệ thống hoạt động ổn định, hãy thực hiện các Test Case sau:

### Case 1: Test nhanh bằng Endpoint (Developer Only)
*   **Mô tả:** Giả lập một sự kiện nộp bài để kiểm tra luồng SSE và UI.
*   **Thực hiện:**
    1.  Đăng nhập vào Dashboard, lấy `Bearer Token` từ Network tab.
    2.  Chạy lệnh curl:
        ```bash
        curl -X POST http://localhost:8080/api/notifications/test-trigger \
             -H "Authorization: Bearer <YOUR_TOKEN>"
        ```
*   **Kết quả mong đợi:**
    - Xuất hiện thông báo Toast ở góc màn hình.
    - Badge trên quả chuông tăng thêm 1.
    - Mở Popover thấy thông báo "Bài tập mới được nộp" với thời gian "vừa xong".

### Case 2: Test luồng nghiệp vụ thực tế (End-to-End)
*   **Kịch bản:** Học sinh nộp bài tập -> Gia sư nhận thông báo.
*   **Thực hiện:**
    1.  Dùng tài khoản **Học sinh** vào làm và nộp một bài tập bất kỳ.
    2.  Mở Dashboard của tài khoản **Gia sư** (người tạo bài tập đó) ở một trình duyệt khác/tab ẩn danh.
*   **Kết quả mong đợi:** Gia sư nhận được thông báo thời gian thực ngay khi học sinh nhấn "Nộp bài".

### Case 3: Quản lý trạng thái thông báo
*   **Thao tác:**
    1.  Click vào một thông báo chưa đọc (nền xanh nhạt).
    2.  Nhấn nút "Đánh dấu tất cả đã đọc".
*   **Kết quả mong đợi:**
    - Khi click từng cái: Thông báo đó mất nền xanh, Badge giảm đi 1.
    - Khi nhấn đọc tất cả: Badge biến mất hoàn toàn, tất cả thông báo chuyển về trạng thái thường.

### Case 4: Kiểm tra tính bền bỉ (Resilience)
*   **Thực hiện:**
    1.  Tắt và bật lại Service Backend (`docker compose restart backend`).
    2.  HOẶC ngắt kết nối mạng tạm thời và bật lại.
*   **Kết quả mong đợi:** Frontend phải tự động re-connect SSE (kiểm tra ở console: `SSE connection opened successfully`) mà không cần F5.

### Case 5: Thông báo Giao bài tập (Teacher → Student)
*   **Kịch bản:** Giáo viên giao bài tập cho học sinh.
*   **Thực hiện:**
    1.  Đăng nhập tài khoản **Giáo viên/Admin**.
    2.  Vào module Bài tập, chọn một bài tập và gán cho một học sinh cụ thể.
    3.  Mở Dashboard của tài khoản **Học sinh** đó ở tab/trình duyệt khác.
*   **Kết quả mong đợi:**
    - Học sinh nhận thông báo "Bạn có bài tập mới" **ngay lập tức** không cần reload.
    - Nội dung thông báo hiển thị tên giáo viên và tiêu đề bài tập.

### Case 6: Thông báo Cập nhật bài tập (Teacher → Students)
*   **Kịch bản:** Giáo viên chỉnh sửa nội dung bài tập đã giao.
*   **Thực hiện:**
    1.  Đăng nhập tài khoản **Giáo viên**.
    2.  Cập nhật một bài tập đã được giao cho nhiều học sinh (thay đổi đề bài hoặc thời hạn).
    3.  Kiểm tra Dashboard của các tài khoản **Học sinh** đã được giao bài đó.
*   **Kết quả mong đợi:**
    - **Tất cả học sinh** được giao bài đều nhận thông báo "Bài tập đã cập nhật".
    - Thông báo yêu cầu học sinh kiểm tra lại nội dung.

### Case 7: Thông báo Lịch học mới (Teacher → Student)
*   **Kịch bản:** Giáo viên tạo lịch học định kỳ cho học sinh.
*   **Thực hiện:**
    1.  Đăng nhập tài khoản **Giáo viên**.
    2.  Vào module Lịch học, tạo lịch học mới cho một học sinh (chọn ngày, giờ, môn học).
    3.  Kiểm tra Dashboard của tài khoản **Học sinh** đó.
*   **Kết quả mong đợi:**
    - Học sinh nhận thông báo "Lịch học mới" với thông tin môn học, ngày trong tuần và giờ học.
    - Badge cập nhật ngay lập tức.

### Case 8: Kiểm tra độ trễ Real-time (Sync Bug Fix)
*   **Mục đích:** Xác minh việc sửa lỗi "ghost notifications" - badge nhảy số chậm và danh sách trống.
*   **Thực hiện:**
    1.  Mở **Console trình duyệt** (F12 → Console tab).
    2.  Chạy lệnh test trigger (hoặc thực hiện một hành động thực tế như nộp bài).
    3.  Quan sát console và UI đồng thời.
*   **Kết quả mong đợi:**
    - Console hiển thị log `SSE Notification received` **ngay lập tức** (< 500ms).
    - Badge quả chuông tăng số **đồng thời** với log.
    - Mở Popover thấy thông báo mới **không cần reload** trang.
    - **Không còn** tình trạng badge có số nhưng danh sách trống.

---
> **Lưu ý:** Module này được thiết kế theo nguyên lý **Open-Closed Principle**, cho phép dễ dàng thêm các loại sự kiện mới mà không cần sửa đổi mã nguồn cốt lõi của hệ thống thông báo.
