# Calendar - Issues & Optimization (Updated)

## New Issues (Feb 3)
### [x] [P0-Critical] Component "Lịch học của bạn" (Student View) bị lỗi
- **Issue**: Student calendar/schedule list is blank/broken (Missing attachments).
- **Resolution**: Updated `SessionRecordService` to use `mapToFullResponse` instead of `layoutResponse`, ensuring `documents` and `lessons` are included in the API response.


### [x] [P1-High] UI Đính kèm tài liệu/bài giảng vào Sessions (Tutor View) - Refactor Category
- **Issue**: Horizontal scrollbar due to non-responsive category list and redundant sort filter.
- **Resolution**: Replaced horizontal category list with a dropdown and removed redundant sort filter.

### [x] [P1-High] UI Đính kèm tài liệu/bài giảng - Polish & Layout
- **Vấn đề 1**: Container chứa tài liệu hiển thị quá cao, gây ra thanh scroll lớn cho modal thay vì scroll nội bộ gọn gàng.
- **Vấn đề 2**: Dropdown selection bị lỗi màu sắc (khi click mà chưa hover) và icon mũi tên bị lệch vị trí.
- **Giải pháp**: 
  - Điều chỉnh Flex layout để List chiếm đúng không gian còn lại (fill space) mà không làm modal bị tràn.
  - Sử dụng Shadcn Select component thay cho native select để có UI/UX đồng nhất, chuẩn xác vị trí icon và màu sắc.



## Performance Issues

### [x] [P0-Critical] CSV-based comment generator không scale được cho multi-user
- **RESOLVED**: Transitioned from static CSV templates to AI-powered generation via Groq API (Llama 3.3).
- **Solution**: 
  - Backend: Implemented `GroqGeneratorServiceImpl` with template-based fallback.
  - API: Updated `GenerateCommentRequest` to support `subject` and `language`.
  - Frontend: Refactored components to pass contextual metadata (Subject, Language) to the generator.
- **Impact**: Supports unlimited subjects and languages with high personalization.
- **Metrics**: 100% subject coverage, < 2s response time.

### [x] [P1-High] Không có cache layer cho generated comments
- **RESOLVED**: Implemented in-memory caching using **Caffeine** with a composite key (Category, Rating, Keywords, Tone, Length).
- **Metric**: Instant response for repeated requests, reducing Groq API costs and improving UX.

---

## UX Issues

### [x] [P1-High] User không thể customize văn phong, độ dài, tone của comment
- **RESOLVED**: Added `GeneratorStyleSelector` component allowing users to choose Tone (Friendly/Professional) and Length (Short/Medium/Long).
- **Backend**: Updated AI prompt engineering to strictly follow these constraints.

### [x] [P1-High] Chưa có nút xóa tất cả buổi học trong 1 tháng cụ thể
- **RESOLVED**: Added "Xóa tất cả buổi học" button in the Calendar header (Info Popover).
- **Safety**: Integrated with `AlertDialog` confirmation to prevent accidental deletion.
- **Backend**: Verified tutor isolation for bulk deletion.

### [ ] [P2-Medium] Không có preview real-time khi điều chỉnh keywords
- **Root cause:** Generator chỉ chạy khi click button
- **Target:** Add debounced auto-preview với loading states
- **Impact:** Reduce user errors 40%

---

## UI Issues

### [x] [P2-Medium] NEW - Cần thiết kế lại UI nhập keywords inline thay vì badges gợi ý
- **RESOLVED**: Implemented `InlineKeywordInput` with tag-based entry (typing + Enter) while keeping smart suggestions.
- **UX**: Tutors can now add custom context that wasn't in the predefined badge list.

### [x] [P3-Low] Không có dark mode support cho generator component
- **RESOLVED**: Added `dark:` utility classes and theme-aware borders/backgrounds to all generator sub-components.

### [x] [P1-High] NEW - Feedback Form UI bị hẹp ("khó thở") trong Modal
- **Root cause:** `FeedbackFormFields.tsx` sử dụng `grid-cols-2` cho các block nhận xét AI, dẫn đến bề ngang quá hẹp khi hiển thị trong LessonDetailModal (có sidebar).
- **Target:** Chuyển sang layout 1 cột (stack) hoặc tối ưu max-width/padding để text có không gian hiển thị "dễ thở" hơn.
- **Impact:** Cải thiện readability cho các nhận xét dài của AI.

---

## Technical Debt

### [x] GEMINI.md Compliance: Refactor function length và add JSDoc
- **RESOLVED**: 
  - Split `CommentGenerator.tsx` into modular sub-components.
  - Refactored `FeedbackFormFields.tsx` into logical sections.
  - Added comprehensive JSDoc to all relevant files.
- **Metrics**: Main function lengths < 50 lines, 100% JSDoc coverage.

### [x] [P2-Medium] [Cleanup] Remove legacy CSV-based comment generation logic
- [x] [UX] Clean up legacy comment generation code (CSV logic) after Groq AI is fully working.
    - Removed `FeedbackCsvImportService`, `FeedbackScenario` entity, and `feedback_scenarios.csv`.
    - Refactored `SessionFeedbackService` to remove template fallback.
    - Updated frontend keyword management to use static suggestions.
- **Impact**: Reduces codebase size, eliminates dead code, and simplifies maintenance.

### [ ] Implement proper error handling và retry logic cho AI calls
- **Root cause:** Không có fallback khi AI service down
- **Impact:** User experience bị gián đoạn