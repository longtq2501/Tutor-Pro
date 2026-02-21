Task List: Auth & User Profile Features

[x] TASK-01: Google OAuth2 Login (Backend)
Scope: Spring Boot

Tích hợp Spring Security OAuth2 Client cho Google
Tạo hoặc map user từ Google account vào User entity hiện tại (by email)
Issue JWT sau khi OAuth2 success
Xử lý trường hợp email đã tồn tại với tài khoản thường → merge hoặc báo lỗi rõ ràng
Tham khảo: security_config.md, jwt_service_design.md, entity_design.md


[x] TASK-02: Google OAuth2 Login (Frontend)
Scope: Next.js

Thêm nút "Đăng nhập bằng Google" vào trang login
Xử lý OAuth2 redirect flow, nhận JWT từ backend và lưu vào store/cookie
Xử lý các edge case: user huỷ, lỗi từ Google
Tham khảo: ui-state.md, functions.md, error-handling.md


[x] TASK-03: Thêm trường Avatar vào User Entity (Backend)
Scope: Spring Boot — Code First / Migration

Thêm trường avatarUrl (hoặc lưu file tùy chiến lược) vào User entity
Tạo migration (nếu dùng Flyway/Liquibase) hoặc để JPA auto-update
Cập nhật DTO, Service, REST endpoint:

PUT /users/me/avatar — upload hoặc nhận URL


Xử lý lưu trữ file (local / S3 / Cloudinary — AI Agent quyết định theo context hiện tại)
Tham khảo: entity_design.md, dto_design.md, rest_api_design.md


[x] TASK-04: Upload Avatar (Frontend)
Scope: Next.js

UI upload avatar: preview trước khi submit, crop nếu cần
Gọi API PUT /users/me/avatar
Cập nhật avatar realtime trên UI sau khi upload thành công (cập nhật store)
Tham khảo: image.md, ui-state.md


[x] TASK-05: Trang Thông Tin Cá Nhân — Profile Page (Frontend)
Scope: Next.js

Route: /profile hoặc /settings/profile
Layout: Avatar lớn + các thông tin cá nhân, có thể edit inline hoặc qua form
Các thao tác CRUD data cá nhân (đọc, sửa thông tin, đổi avatar, đổi mật khẩu nếu applicable)
Tham khảo: file-conventions.md, data-patterns.md, ui-libraries.md


[x] TASK-08: Profile Edit (Frontend)
Scope: Next.js

Hỗ trợ cập nhật fullName và các thông tin cơ bản
Tích hợp validation với react-hook-form + zod
Cập nhật AuthContext realtime


[x] TASK-06: Avatar Menu ở Header (Frontend)
Scope: Next.js

Góc màn hình (header): hiển thị avatar nhỏ của user đang đăng nhập
Click → dropdown/popover có các tuỳ chọn: Thông tin cá nhân, Đăng xuất, (và các item khác nếu cần)
Điều hướng đến /profile khi chọn "Thông tin cá nhân"
Tham khảo: ui-libraries.md, interactivity.md, ui-state.md


[x] TASK-07: API Lấy & Cập Nhật Thông Tin Cá Nhân (Backend)
Scope: Spring Boot

GET /users/me — trả về full profile của user hiện tại
PUT /users/me — cập nhật các trường thông tin cá nhân
Validate input, trả lỗi chuẩn
Tham khảo: rest_api_design.md, service_design.md, error_handling_design.md


Thứ tự thực hiện gợi ý
TASK-01 → TASK-03 → TASK-07   (backend foundation)
     ↓         ↓         ↓
TASK-02 → TASK-04 → TASK-05 → TASK-06   (frontend build on top)