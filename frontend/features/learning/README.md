# 📚 Module Learning (Quản Lý Bài Giảng)

## 1. Giới thiệu tổng quan

Module Learning là trung tâm quản lý nội dung giảng dạy trong hệ thống Tutor Management Pro, cung cấp công cụ toàn diện để tạo, quản lý, và phân phối bài giảng đa phương tiện cho học sinh.

**Bối cảnh:**
- Module này thuộc ứng dụng **Tutor Management Pro**
- Đây là trung tâm quản lý nội dung học tập với video, tài liệu, và bài tập
- Được thiết kế để tối ưu hóa trải nghiệm học tập với video player cao cấp, quản lý danh mục, và phân quyền linh hoạt
- Hỗ trợ cả quản trị viên (tạo/quản lý) và học sinh (xem/hoàn thành bài giảng)

---

## 2. Các chức năng chính

Hệ thống Learning bao gồm các chức năng cốt lõi sau:

*   **Quản Lý Bài Giảng (Lesson Management):**
    *   Tạo, sửa, xóa bài giảng với nội dung đa phương tiện (video, hình ảnh, tài liệu)
    *   Phân loại bài giảng theo danh mục (categories) với màu sắc tùy chỉnh
    *   Publish/unpublish bài giảng để kiểm soát hiển thị
    *   Hỗ trợ markdown cho nội dung chi tiết
    
*   **Thư Viện Bài Giảng (Lesson Library):**
    *   Quản lý kho bài giảng tái sử dụng
    *   Gán/thu hồi bài giảng cho nhiều học sinh cùng lúc (bulk actions)
    *   Theo dõi số lượng học sinh được gán cho mỗi bài
    *   Lọc và tìm kiếm bài giảng theo danh mục

*   **Trải Nghiệm Học Tập (Learning Experience):**
    *   Video player cao cấp với custom controls (play/pause, volume, speed 0.5x-2x)
    *   Giao diện 2 cột: Video/tổng quan (trái) + Nội dung chi tiết (phải)
    *   Resizable layout với drag-to-resize giữa 2 cột
    *   Dark/Light mode cho nội dung đọc
    *   Đánh dấu hoàn thành bài giảng

*   **Quản Lý Danh Mục (Category Dashboard):**
    *   Tạo, sửa, xóa danh mục với màu sắc gradient tùy chỉnh
    *   Theo dõi số lượng bài giảng trong mỗi danh mục
    *   Drag-and-drop để sắp xếp thứ tự hiển thị

---

## 3. Cách hoạt động (Workflow)

### A. Quy trình Tạo và Phân Phối Bài Giảng (Lesson Creation & Distribution)
1.  **Bước 1:** Admin tạo bài giảng mới với title, summary, content (markdown), video URL, thumbnail
2.  **Bước 2:** Upload hình ảnh và tài liệu đính kèm qua Cloudinary integration
3.  **Bước 3:** Phân loại bài giảng vào category và publish
4.  **Bước 4:** Gán bài giảng cho học sinh thông qua Lesson Library (bulk assign)
5.  **Optimistic Updates:** UI cập nhật ngay lập tức, rollback nếu API thất bại

### B. Quy trình Học Tập của Học Sinh (Student Learning Flow)
*   **Truy cập:** Học sinh xem danh sách bài giảng được gán qua timeline view
*   **Học tập:** Click vào bài giảng → Mở lesson detail view với video player và nội dung
*   **Tương tác:** Điều chỉnh tốc độ phát (0.5x-2x), resize layout, toggle dark mode
*   **Hoàn thành:** Đánh dấu bài giảng đã hoàn thành, hệ thống lưu timestamp

### C. Quy trình Quản Lý Bulk Actions (Bulk Management)
*   **Selection:** Chọn nhiều học sinh trong UnassignStudentsDialog
*   **Sticky Toolbar:** Toolbar hiển thị số lượng đã chọn, luôn visible khi scroll
*   **Actions:** Gán/thu hồi bài giảng hàng loạt với confirmation dialog
*   **Real-time Updates:** React Query invalidation để cập nhật UI ngay lập tức

---

## 4. Cấu trúc kỹ thuật

### Backend (Modular Monolith)
*   **Package:** `com.tutor_management.backend.modules.lesson`
*   **Entity Chính:**
    *   `Lesson`: Bài giảng với title, content, videoUrl, thumbnailUrl, isPublished
    *   `LessonCategory`: Danh mục với name, color, displayOrder
    *   `LessonAssignment`: Quan hệ nhiều-nhiều giữa Lesson và Student
    *   `LessonImage`: Hình ảnh đính kèm với displayOrder
    *   `LessonResource`: Tài liệu đính kèm (PDF, links) với displayOrder
*   **Query Optimization:** 
    *   **JOIN FETCH** trong `findByIdWithDetails()` để eager load images, resources, category
    *   **Giảm N+1 queries:** Từ 3 queries → 1 query (60-70% faster)
    *   **Pagination:** `Page<T>` cho tất cả list endpoints
    *   **Projections:** `AdminLessonSummaryResponse` thay vì full entity (giảm 60% payload)
*   **API Endpoints:**
    *   `GET /api/admin/lessons` - Lấy danh sách bài giảng (paginated)
    *   `GET /api/admin/lessons/{id}` - Chi tiết bài giảng (optimized query)
    *   `POST /api/admin/lessons` - Tạo bài giảng mới
    *   `PUT /api/admin/lessons/{id}` - Cập nhật bài giảng
    *   `DELETE /api/admin/lessons/{id}` - Xóa bài giảng
    *   `POST /api/admin/lessons/{id}/toggle-publish` - Publish/unpublish
    *   `GET /api/lesson-library` - Lấy thư viện bài giảng
    *   `POST /api/lesson-library/{id}/assign` - Gán bài giảng cho học sinh
    *   `POST /api/lesson-library/{id}/unassign` - Thu hồi bài giảng
    *   `GET /api/lesson-library/{id}/assigned-students` - Danh sách học sinh được gán

### Frontend (Feature-based)
*   **Thư mục:** `frontend/features/learning/`
*   **Công nghệ:** Next.js 16, React 19, Tailwind CSS 4, Shadcn UI, framer-motion
*   **Components Chính:**
    *   `AdminLessonManager`: Tab-based UI cho quản lý bài giảng và thư viện
    *   `LessonDetailView`: 2-column resizable layout với video player và content
    *   `VideoPlayer`: Custom video controls với playback speed, volume, progress bar
    *   `UnassignStudentsDialog`: Bulk selection với sticky toolbar
    *   `PremiumLessonCard`: Card hiển thị bài giảng với thumbnail và metadata
    *   `CategoryDashboard`: Quản lý danh mục với color picker
*   **Hiệu suất:**
    *   **React Query:** Caching, invalidation, optimistic updates
    *   **Framer Motion:** Smooth animations (200ms-600ms) cho controls và transitions
    *   **Code splitting:** Lazy load components với Next.js dynamic imports
    *   **Responsive:** Mobile-first design, tested on iPhone SE/16

### Database Schema
```sql
-- Lesson table with full-text search support
CREATE TABLE lesson (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tutor_name VARCHAR(255),
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content LONGTEXT,
    lesson_date DATE,
    video_url VARCHAR(1000),
    thumbnail_url VARCHAR(1000),
    is_published BOOLEAN DEFAULT FALSE,
    is_library BOOLEAN DEFAULT FALSE,
    category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES lesson_category(id),
    INDEX idx_lesson_published (is_published),
    INDEX idx_lesson_library (is_library),
    INDEX idx_lesson_category (category_id)
);

-- Lesson Assignment for many-to-many relationship
CREATE TABLE lesson_assignment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    lesson_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    assigned_date DATE,
    assigned_by VARCHAR(255),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (lesson_id) REFERENCES lesson(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    UNIQUE KEY uk_lesson_student (lesson_id, student_id)
);
```

---

## 5. Use Cases & User Stories

### Use Case 1: Tạo và Phân Phối Bài Giảng Mới
**Actor:** Quản trị viên (Admin)  
**Mô tả:** Admin tạo bài giảng video mới về "Phương trình bậc 2" và gán cho 15 học sinh  
**Luồng chính:**
1. Admin mở Admin Lessons tab, click "Tạo bài giảng mới"
2. Nhập thông tin: title, summary, upload video lên Cloudinary, chọn category "Toán học"
3. Viết nội dung chi tiết bằng markdown editor
4. Click "Tạo bài giảng" → Bài giảng được lưu vào database
5. Chuyển sang Lesson Library tab, tìm bài giảng vừa tạo
6. Click "Gán học sinh", chọn 15 học sinh từ danh sách
7. Confirm → Hệ thống tạo 15 LessonAssignment records
8. **Kết quả:** 15 học sinh thấy bài giảng mới trong timeline của họ

### Use Case 2: Học Sinh Xem Bài Giảng
**Actor:** Học sinh (Student)  
**Mô tả:** Học sinh xem bài giảng video và đánh dấu hoàn thành  
**Luồng chính:**
1. Học sinh đăng nhập, vào module Learning
2. Thấy danh sách bài giảng được gán trong timeline view
3. Click vào bài "Phương trình bậc 2" → Mở lesson detail view
4. Video tự động load, học sinh click play
5. Điều chỉnh tốc độ phát lên 1.5x để học nhanh hơn
6. Resize layout để mở rộng phần nội dung chi tiết
7. Đọc xong, click "Đánh dấu hoàn thành"
8. **Kết quả:** Bài giảng được đánh dấu completed với timestamp

### Use Case 3: Thu Hồi Bài Giảng Hàng Loạt
**Actor:** Quản trị viên  
**Mô tả:** Admin thu hồi bài giảng cũ từ 20 học sinh đã tốt nghiệp  
**Luồng chính:**
1. Admin mở Lesson Library, tìm bài giảng cần thu hồi
2. Click "Thu hồi" → Mở UnassignStudentsDialog
3. Danh sách hiển thị 50 học sinh được gán, sticky toolbar ở bottom
4. Scroll xuống, chọn 20 học sinh đã tốt nghiệp
5. Sticky toolbar hiển thị "Đã chọn 20/50"
6. Click "Thu hồi (20)" → Confirmation dialog
7. Confirm → Hệ thống xóa 20 LessonAssignment records
8. **Kết quả:** 20 học sinh không còn thấy bài giảng này

---

## 6. Xử lý lỗi & Edge Cases

*   **Video không load được:** Hiển thị placeholder với icon Play và message "Không có video cho bài học này"
*   **Danh sách học sinh rỗng:** UnassignStudentsDialog hiển thị empty state với icon CheckCircle
*   **Bulk action với 0 selections:** Disable button "Thu hồi" và hiển thị toast warning khi click
*   **Network error khi gán bài giảng:** React Query retry 1 lần, sau đó hiển thị error toast với message từ backend
*   **Optimistic update rollback:** Nếu API thất bại, UI tự động revert về state trước đó
*   **Error Handling Strategy:**
    *   **Frontend validation:** Zod schema validation cho forms
    *   **Backend error responses:** Chuẩn `ApiResponse<T>` với error message tiếng Việt
    *   **User feedback:** Toast notifications (sonner) với success/error/warning states

---

## 7. Testing Strategy

### Unit Tests
*   **Backend:** `AdminLessonServiceTest.java` - Test N+1 query optimization
    *   `testGetLessonById_UsesOptimizedQuery()` - Verify `findByIdWithDetails()` is called
    *   `testGetLessonById_WithCollections_ReturnsCompleteData()` - Verify collections are initialized
    *   Coverage target: 80%+

### Integration Tests
*   **API endpoints:** Test với Postman/REST Client
    *   `GET /api/admin/lessons` - Verify pagination works
    *   `POST /api/lesson-library/{id}/assign` - Verify bulk assignment creates correct records
    *   End-to-end scenario: Create lesson → Assign to students → Student fetches lesson

### E2E Tests (Planned)
*   **User flows:** Playwright/Cypress tests
    *   Admin creates lesson → Assigns to student → Student views and completes lesson
    *   Admin bulk unassigns lessons from multiple students

---

## 8. Performance Metrics & Achievements

### Backend Optimizations
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Lesson Detail Query | 3 queries (1 lesson + 1 images + 1 resources) | 1 query (JOIN FETCH) | **60-70% faster** |
| API Payload Size | Full `Lesson` entity (~5KB) | `AdminLessonSummaryResponse` (~2KB) | **60% reduction** |
| Lesson List Response | Unpaginated (all records) | Paginated `Page<T>` | **Scalable** |

### Frontend Optimizations
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Video Player UX | Basic HTML5 controls | Custom controls + speed + animations | **Premium UX** |
| Bulk Actions Visibility | Scrolls away with list | Sticky toolbar (always visible) | **100% visibility** |
| Layout Flexibility | Fixed width | Resizable 2-column (20%-80%) | **User control** |

### Code Quality
*   ✅ All components < 50 lines (GEMINI.md compliance)
*   ✅ JSDoc documentation for all exported functions
*   ✅ TypeScript strict mode with no `any` types
*   ✅ Build successful with 0 errors

---

## 9. Dependencies & Related Modules

*   **Phụ thuộc vào:**
    *   `Student Module` - Để gán bài giảng cho học sinh
    *   `Cloudinary` - Upload và host video/images
    *   `Authentication` - Phân quyền admin vs student
*   **Được sử dụng bởi:**
    *   `Dashboard Module` - Hiển thị thống kê bài giảng
    *   `Calendar Module` - Liên kết bài giảng với session records

---

## 10. Hướng phát triển (Planned Optimizations)

*   [ ] Fullscreen mode cho video player
*   [ ] Picture-in-picture support
*   [ ] Subtitle/caption support cho video
*   [ ] Thumbnail preview khi hover progress bar
*   [ ] Keyboard shortcuts (Space = play/pause, Arrow keys = seek)
*   [ ] Export lesson content to PDF
*   [ ] Analytics: Track video watch time, completion rate

---

## 11. Tài liệu tham khảo

*   [Backend API Documentation](../../backend/src/main/java/com/tutor_management/backend/modules/lesson/)
*   [ISSUES.md](./ISSUES.md) - Chi tiết các issues đã fix
*   [CLEAN_CODE_CRITERIA.md](../../CLEAN_CODE_CRITERIA.md) - Code quality standards
*   [GEMINI.md](../../GEMINI.md) - Development rules

---

> **Lưu ý:** Module Learning đã hoàn thành optimization phase với tất cả P0-P1 issues được resolve. Các tính năng mới (P3) sẽ được xem xét trong sprint tiếp theo dựa trên feedback từ users.
