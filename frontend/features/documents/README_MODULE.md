# 📁 Module Kho Tài Liệu (Document Management)

## 1. Giới thiệu tổng quan
**Module Document** là kho lưu trữ tài liệu tập trung của hệ thống **Tutor Management Pro**. Đây là nơi Quản trị viên quản lý toàn bộ tài nguyên học thuật bao gồm: bài giảng (PDF), bài tập (Word), đề thi, hình ảnh và các tài liệu hỗ trợ giảng dạy khác.

Module này đóng vai trò là "Single Source of Truth" (Nguồn dữ liệu duy nhất) cho các tài nguyên số trong hệ thống, cho phép các module khác (như Lesson, Finance, Homework) truy xuất và sử dụng lại tài liệu một cách hiệu quả.

---

## 2. Các chức năng chính
Hệ thống Kho tài liệu bao gồm các chức năng cốt lõi sau:

*   **Quản lý Danh mục (Categories):**
    *   Phân loại tài liệu theo chủ đề (Ngữ pháp, Từ vựng, IELTS, Đề thi...).
    *   Tùy chỉnh linh hoạt: Mỗi danh mục có thể được gán **màu sắc** và **biểu tượng (emoji)** riêng để dễ dàng nhận diện.
*   **Quản lý Tài liệu (Documents):**
    *   **Tải lên (Upload):** Hỗ trợ đa dạng định dạng (PDF, Docx, Pptx, Image). Tự động lưu trữ an toàn trên Cloudinary.
    *   **Xem trước (Preview):** Tính năng xem PDF và ảnh trực tiếp trên trình duyệt mà không cần tải về.
    *   **Tải xuống (Download):** Truy xuất link trực tiếp từ Cloudinary một cách bảo mật.
    *   **Tìm kiếm & Lọc:** Tìm kiếm nhanh theo tên tài liệu hoặc lọc theo danh mục.
*   **Thống kê (Analytics):**
    *   Tổng hợp số lượng tài liệu, tổng lượt tải xuống và dung lượng lưu trữ đang sử dụng.

---

## 3. Cách hoạt động (Workflow)

### A. Quy trình Tải tài liệu (Upload Flow)
1.  **Frontend:** Người dùng chọn file và điền thông tin (Tên, Danh mục, Mô tả).
2.  Data được đóng gói dưới dạng `Multipart/form-data`.
3.  **Backend:** `DocumentController` nhận request.
4.  `DocumentService` đẩy file vật lý lên **Cloudinary API**.
5.  Cloudinary trả về `URL` và `PublicID`.
6.  Backend lưu `Metadata` (Tên file, URL, ID, Size) vào Database **MySQL**.
7.  **Kết quả:** Tài liệu xuất hiện ngay lập tức trong danh sách với đầy đủ thông tin.

### B. Quy trình Quản lý Dữ liệu
*   **Caching:** Sử dụng **React Query** để cache danh sách tài liệu và danh mục. Khi chuyển tab, dữ liệu sẽ hiện ra ngay lập tức (0ms) từ cache.
*   **Lazy Loading:** Chỉ tải dữ liệu danh mục cần thiết, giúp giảm tải cho server và cải thiện tốc độ trang (LCP < 2.5s).
*   **Security:** Chỉ những tài liệu được gắn `studentId` cụ thể mới hiển thị cho học sinh đó, hoặc tài liệu công khai (`studentId = null`) sẽ hiển thị cho tất cả.

---

## 4. Cấu trúc kỹ thuật

### Backend (Modular Monolith)
*   **Package:** `com.tutor_management.backend.modules.document`
*   **Entity Chính:**
    *   `Document`: Lưu thông tin file, URL Cloudinary, quan hệ với Category và Student.
    *   `DocumentCategory`: Lưu thông tin danh mục, màu sắc, biểu tượng và thứ tự hiển thị.
*   **Repository:** Sử dụng **Query Optimization** để fetch dữ liệu kèm Category/Student trong 1 câu SQL duy nhất (tránh lỗi N+1).

### Frontend (Feature-based)
*   **Thư mục:** `frontend/features/documents`
*   **Công nghệ:** Next.js App Router, Tailwind CSS, Lucide Icons, Framer Motion (cho hiệu ứng grid).
*   **State Management:** `@tanstack/react-query` xử lý toàn bộ logic Fetching, Caching và Invalidation.

---

## 5. Hướng phát triển (Planned Optimizations)
*   [ ] Tích hợp tính năng kéo thả (Drag & Drop) để gán bài tập cho học sinh.
*   [ ] Hỗ trợ xem trước file Office (Word/Powerpoint) qua Microsoft/Google Viewer.
*   [ ] Tối ưu hóa SEO cho các tài liệu công khai.

---
> **Lưu ý:** Module này được thiết kế để hoạt động độc lập nhưng có khả năng tích hợp sâu với module **Exercise** và **Finance** (để tính toán chi phí tài liệu nếu cần).
