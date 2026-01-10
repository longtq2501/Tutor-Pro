# Notification Module - Issues & Optimization

## Context
Xây dựng hạ tầng điều phối sự kiện (Event-driven) và truyền tải dữ liệu thời gian thực (SSE) theo cơ chế Code First. Triển khai giao diện quản lý thông báo, trạng thái Unread/Read tập trung và tối ưu trải nghiệm tương tác.

## Metrics & KPIs
- **Event Latency:** < 200ms (từ lúc bắn Event đến lúc lưu DB và đẩy qua SSE).
- **Query Performance:** < 50ms cho truy vấn "Unread Notifications" nhờ Index chiến lược.
- **Real-time Delivery:** Thông báo xuất hiện trên UI < 500ms sau khi nhận tín hiệu từ Server.
- **Connection Stability:** Duy trì Heartbeat 30s/lần; tự động kết nối lại (Auto-reconnect) mượt mà.

## Performance Issues
- [ ] [P1-High] Tối ưu hóa việc tải danh sách thông báo khi số lượng bản ghi lớn (> 1000).
  - Target: Sử dụng Pagination hoặc Virtual Scroll.

## UX Issues
- [ ] [P2-Medium] Cải thiện âm thanh thông báo nhẹ nhàng khi có thông báo mới.

## UI Issues
- [ ] [P3-Low] Tùy chỉnh màu sắc icon thông báo theo mức độ nghiêm trọng (Info, Warning, Error).

---

## Completed Work (Archive)

### Infrastructure & Core Logic
- [x] [P0-Critical] **Entity Notification & Indexing**
  - Solution: Triển khai Code First với Index `idx_recipient_read` và `idx_created_at`.
  - Impact: Truy vấn thông báo chưa đọc mượt mà < 50ms.
- [x] [P0-Critical] **Real-time SSE Engine**
  - Solution: Xây dựng `SseEmittersManager` và `NotificationScheduler` (Heartbeat).
  - Tested: Duy trì kết nối ổn định trên môi trường Docker. ✅
- [x] [P0-Critical] **Event-Driven Integration**
  - Solution: Tích hợp sự kiện vào luồng nộp bài, chấm bài, giao bài và lịch học.
  - Fix: Chuyển từ `@TransactionalEventListener` sang `@EventListener` để giải quyết lỗi mất event bài tập. ✅

### Frontend & User Interface
- [x] [P0-Critical] **Real-time Stream Integration**
  - Solution: Triển khai `useSSE` hook với cơ chế Auto-reconnect.
- [x] [P1-High] **Global State Management**
  - Solution: `NotificationBell` đồng bộ Badge Unread Count theo thời gian thực.
- [x] [P2-Medium] **Interactive Components**
  - Solution: Tích hợp `sonner` (Toast) và `NotificationList` (Popover) với chức năng "Mark as read".

### Code Quality (Refactor)
- [x] [P0-Critical] **Clean Code Implementation**
  - Solution: Refactor toàn bộ Module Notification (Backend) theo `CLEAN_CODE_CRITERIA.md`.
  - Result: 100% file có Javadoc, đặt tên chuẩn, log lỗi có Context. ✅
- [x] [P1-High] **DRY Refactoring**
  - Solution: Trung tâm hóa logic tạo & gửi thông báo vào `NotificationService.createAndSend`.
  - Result: Giảm 70% code lặp lại tại `NotificationListener`. ✅