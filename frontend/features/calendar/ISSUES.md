# Calendar - Issues & Optimization (Updated)

## Performance Issues

### [ ] [P0-Critical] CSV-based comment generator không scale được cho multi-user
- **Root cause:** Generator hiện tại dựa trên static CSV templates, không hỗ trợ đa ngôn ngữ, đa môn học, personalization
- **Target:** Chuyển sang AI-powered generator với Groq API + template fallback system
- **Metrics:**
  - Response time < 2s (hiện tại: instant nhưng limited)
  - Support 10+ subjects & 5+ languages
  - User satisfaction score > 4/5
  - Cost per request < $0.001

### [ ] [P1-High] Không có cache layer cho generated comments
- **Root cause:** Mỗi request tạo comment mới dù keywords tương tự
- **Target:** Implement Redis cache với TTL 7 ngày
- **Metrics:** Cache hit rate > 60%, giảm 60% API calls

---

## UX Issues

### [ ] [P1-High] User không thể customize văn phong, độ dài, tone của comment
- **Root cause:** Generator hiện tại chỉ có một style cố định
- **Target:** Thêm controls cho tone (formal/friendly), length (short/medium/long), focus areas
- **Impact:** User retention tăng 25%

### [ ] [P2-Medium] Không có preview real-time khi điều chỉnh keywords
- **Root cause:** Generator chỉ chạy khi click button
- **Target:** Add debounced auto-preview với loading states
- **Impact:** Reduce user errors 40%

---

## UI Issues

### [ ] [P2-Medium] NEW - Cần thiết kế lại UI nhập keywords inline thay vì badges gợi ý
- **Root cause:** UI hiện tại dùng badge system không phù hợp với inline editing trong form nhận xét
- **Target:** Redesign phần keyword input thành inline editing với auto-suggest, không phá vỡ flow hiện tại
- **Priority:** HIGH - ảnh hưởng trực tiếp đến UX khi gia sư viết nhận xét

### [ ] [P3-Low] Không có dark mode support cho generator component
- **Root cause:** Component không inherit theme
- **Target:** Add theme-aware styling
- **Priority:** Low - nice to have

---

## Technical Debt

### [ ] Refactor CSV parser thành modular service
- **Root cause:** Logic đọc/parse CSV nằm trong controller
- **Impact:** Khó maintain khi thêm formats mới

### [ ] Implement proper error handling và retry logic cho AI calls
- **Root cause:** Không có fallback khi AI service down
- **Impact:** User experience bị gián đoạn