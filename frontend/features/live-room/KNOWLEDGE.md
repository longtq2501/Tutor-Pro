# Knowledge Ledger - Live Room WebSocket Infrastructure

## WebSocket Infrastructure & Presence - 2026-01-18

### 1. Bối cảnh & Vấn đề
- **Vấn đề:** Tính năng Live Teaching yêu cầu sự đồng bộ hóa thời gian thực (whiteboard, chat, trạng thái người tham gia). Ban đầu dự án thiếu cấu hình WebSocket, không có cơ chế xác thực kết nối và không có cách nào để phát hiện người dùng ngắt kết nối đột ngột.
- **Nhu cầu thực tế:** Tutor và Student cần thấy nhau online, drawing đồng bộ và nhận thông báo lỗi rõ ràng nếu có vấn đề kết nối.
- **Tầm quan trọng:** Đây là "xương sống" của trải nghiệm học trực tuyến. Thiếu cơ chế heartbeat và dọn dẹp room sẽ dẫn đến tình trạng "phòng ma" (Zombie rooms) và tính phí sai lệch (billing errors).

### 2. Giải pháp kỹ thuật
- **Công nghệ sử dụng:** Spring WebSocket, STOMP, SockJS, Spring Security, ConcurrentHashMap (Presence Tracking).
- **Tại sao chọn giải pháp này?**
  - **STOMP:** Cung cấp mô hình pub-sub và message mapping giống REST, dễ quản lý hơn WebSocket thuần.
  - **PresenceService (In-memory):** Thay vì ghi DB mỗi 30s khi nhận heartbeat (gây overload DB ở quy mô lớn), chúng tôi sử dụng `ConcurrentHashMap` để track trạng thái trong bộ nhớ.
- **Kiến trúc tổng quát:** Client gửi heartbeat -> `PresenceService` update RAM -> Scheduler quét RAM định kỳ để sync DB và phát hiện timeout.
- **Cách triển khai chính:**
  1. **WebSocketConfig:** Đăng ký endpoint `/ws/room` và cấu hình message broker.
  2. **WebSocketAuthInterceptor:** Chặn kết nối `CONNECT` để xác thực **Room Token** (JWT dành riêng cho phòng học).
  3. **PresenceService:** Quản lý map `roomId:userId -> LocalDateTime` để track hoạt động.
  4. **OnlineSessionWebSocketController:** Endpoint nhận heartbeat từ client.
  5. **WebSocketExceptionHandler:** Bắt các ngoại lệ và gửi trả lỗi cấu trúc `ApiResponse` về `/user/queue/errors`.
  6. **Scheduler:** Chạy mỗi 60 giây để quét và xử lý các session không có hoạt động.

### 3. Bài học thực tế
- **Insight quan trọng:** 
  - `Principal` trong WebSocket Controller không tự động là entity `User`. Nó phụ thuộc vào cách ta set trong Interceptor. Sử dụng `principal.getName()` để lưu User ID là cách tiếp cận sạch nhất.
  - Phân tách **Main JWT** (auth ứng dụng) và **Room Token** (auth phòng học) giúp tăng bảo mật đáng kể: Room Token ngắn hạn, chỉ có quyền trong 1 phòng cụ thể.
- **Trade-offs:** Chấp nhận độ trễ dọn dẹp entry trong RAM (threshold 2 phút) so với việc phải poll DB liên tục để đảm bảo hiệu năng tối đa.
- **Best practices cụ thể:** 
  - Luôn sử dụng `@EntityGraph` khi fetch OnlineSession trong scheduler để tránh N+1 query khi kiểm tra Tutor/Student.
  - Sử dụng `@SendToUser` thay vì gửi broadcast cho các thông báo lỗi cá nhân.
- **Pitfalls cần tránh:** 
  - **NPE:** Truy cập `student.getUser()` khi relationship là một chiều (User -> Student). Cần dùng `userRepository.findByStudentId()` để tra cứu ngược lại.
  - **Dependency:** Quên thêm `spring-boot-starter-websocket` vào `pom.xml` dẫn đến lỗi không tìm thấy các class annotation.

### 4. Ảnh hưởng hệ thống
- **Impact:** Toàn bộ module Online Session và Billing (vì billing dựa trên thời gian tham gia thực tế).
- **Scalability:** `PresenceService` có thể nâng cấp lên Redis nếu triển khai Multi-node (Sticky sessions hoặc Shared state).
- **Maintenance:** Cần theo dõi log của `WebSocketExceptionHandler` để phát hiện các mẫu lỗi kết nối từ phía client.

### 5. Tài liệu tham khảo thực tế
- [Spring Framework WebSocket Documentation](https://docs.spring.io/spring-framework/reference/web/websocket.html)
- [Baeldung: WebSockets with Spring Security](https://www.baeldung.com/spring-security-websockets)
- **Tool debug:** Chrome DevTools -> Network -> WS tab (kiểm tra STOMP frames).
