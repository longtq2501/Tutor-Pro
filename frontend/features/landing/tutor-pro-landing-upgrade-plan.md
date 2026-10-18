# Plan: Nâng cấp Landing Page Tutor Pro (v2 - theo hiện trạng code)

## Mục tiêu

Nâng cấp landing hiện có thành hệ thống nhiều trang: landing chính + trang hub `/features` + trang chi tiết cho từng feature.

**Phạm vi task này:** dựng nền tảng và bộ khung (refactor, header, route, trang rỗng, breadcrumb, layout chung).
**Không thuộc task này:** nội dung chi tiết từng trang feature (làm theo task riêng để kiểm soát chất lượng).

## Hiện trạng (đã audit qua ảnh và code)

| Hạng mục | Hiện trạng | Hướng xử lý |
|---|---|---|
| Landing `/` | Theme dark navy, 1 file `LandingPageContent.tsx` (`'use client'`), gồm NavBar, Hero, FlowIntro, StepFlow, FinalCTA, Footer | Giữ thiết kế, tách file |
| Header | 2 nút `<button onClick={router.push}>` (Tính năng, Bảng giá) | Đổi sang `<Link>`, thêm dropdown + mobile menu |
| `/features` | Theme sáng, tên tiếng Anh (Live Teaching, Calendar, Lesson Lobby) | Làm lại thành hub theo theme dark, Việt hóa tên |
| `/pricing` | Placeholder, theme gradient xanh ngọc | Giữ nội dung, đổi theme cho khớp |
| Luồng 5 bước (`STEPS`) | Hardcode trong file, chia theo quy trình | Giữ, thêm `featureSlug` để link sang trang feature |
| Footer | Cột Nền tảng + Liên hệ | Thêm cột Tính năng đọc từ config |
| Spec UI | `features/landing/ISSUES.md` là thiết kế đã chốt cho landing (token, font, 5 bước, nguyên tắc nội dung, checklist) | Dùng làm nguồn chuẩn; cập nhật lại cho khớp header mới và các trang feature |
| `app/` | Đã có route group `(admin)`, `(tutor)`; `page.tsx`, `features/`, `pricing/`, `login/`, `register/`, `auth/` nằm ngang hàng ở gốc; đã có `sitemap.ts` | Thêm route group `(marketing)` cùng quy ước, chuyển landing, features, pricing vào (URL không đổi) |

---

## Phase 0 - Audit và chốt quyết định

- [x] 0.1 Xem cấu trúc `frontend/app/`: đã xác nhận `/features` và `/pricing` nằm ngoài mọi route group, `sitemap.ts` đã tồn tại
- [x] 0.2 Xem file CSS chứa `.landing-page` và `lp-*` (đã xác nhận được scope chặt chẽ với `.landing-page` trong `globals.css`)
- [x] 0.3 Đọc `features/landing/ISSUES.md`: đã có token, typography, nguyên tắc nội dung, spec từng section
- [x] 0.4 Chốt quy ước slug: 10 slug tiếng Anh ngắn gọn (`overview`, `finance`, `settings`, `students`, `classes`, `schedule`, `documents`, `lessons`, `reports`, `exams`)
- [x] 0.5 Quyết định cho 2 bước luồng chưa có module trong menu app: "Nhận xét AI" gắn vào `reports`, "Theo dõi tiến độ" gắn vào `students`
- [x] 0.6 Design tokens: đã có trong `ISSUES.md` mục 2; dùng lại đồng bộ cho mọi trang marketing
- [x] 0.7 Chốt 4 nhóm: Vận hành (`operations`), Học vụ (`academics`), Giảng dạy (`teaching`), Đánh giá (`assessment`)
- [x] 0.8 Chốt `type` từng feature: `view` / `action` / `mixed`
- [x] 0.9 Quyết định các điểm mâu thuẫn giữa `ISSUES.md` và yêu cầu mới:
  - [x] a. Luồng 5 bước làm trục chính + thêm khối `FeatureGrid` tĩnh gọn 10 card trước CTA cuối trang
  - [x] b. Navbar mobile bổ sung menu drawer để khách mobile truy cập danh sách tính năng
  - [x] c. Không screenshot thật cũ, không số liệu kỹ thuật bịa đặt
  - [x] d. Mascot chỉ dùng ở hero landing chính; các trang feature dùng biểu tượng module chuyên nghiệp
  - [x] e. Link Chính sách / Điều khoản trong footer trỏ sạch, không gây reload lỗi

### Danh sách feature (slug và type là đề xuất, cần xác nhận)

| Nhóm | Feature (tên theo menu app) | Slug đề xuất | Type |
|---|---|---|---|
| Vận hành | Tổng Quan | `overview` | view |
| Vận hành | Tài Chính | `finance` | mixed |
| Vận hành | Cài đặt | `settings` | mixed |
| Học vụ | Học Sinh & PH | `students` | action |
| Học vụ | Lớp học | `classes` | action |
| Giảng dạy | Lịch dạy | `schedule` | action |
| Giảng dạy | Tài Liệu | `documents` | action |
| Giảng dạy | Bài Giảng | `lessons` | action |
| Đánh giá | Báo Cáo | `reports` | view |
| Đánh giá | Khảo thí | `exams` | action |

## Phase 1 - Nền tảng và refactor

- [x] 1.1 Tạo file cấu hình feature duy nhất `features/landing/config/features.ts`: `slug`, `name`, `icon`, `desc`, `group`, `type`, `related[]`
- [x] 1.2 Tạo route group `app/(marketing)/` (cùng quy ước với `(admin)`, `(tutor)` đã có), `layout.tsx` chứa wrapper `landing-page`, NavBar, Footer
  - [x] Chuyển `app/page.tsx`, `app/features/`, `app/pricing/` vào `(marketing)` (route group không đổi URL)
  - [x] Giữ `layout.tsx` gốc chỉ lo `<html>`, `<body>`, font, provider
  - [x] `login`, `register`, `auth` giữ nguyên ngoài `(marketing)` (không dùng header landing)
  - [x] Kiểm tra import và đường dẫn tương đối sau khi chuyển, chạy build để chắc không vỡ
- [x] 1.3 Tách `LandingPageContent.tsx` thành các component riêng:
  - [x] `components/layout/`: NavBar, Footer
  - [x] `components/home/`: Hero, FlowIntro, StepFlow, FinalCTA, FeatureGrid
  - [x] `components/visuals/`: 5 visual hiện có
- [x] 1.4 Phân tách server / client: chỉ giữ `'use client'` cho Hero (hiệu ứng chuột), StepFlow (IntersectionObserver), dropdown và mobile menu
- [x] 1.5 Chuyển mọi `<button onClick={router.push}>` và `<a preventDefault>` sang `<Link>`
- [x] 1.6 Đảm bảo landing `/` hiển thị y như cũ sau refactor (không đổi giao diện ở bước này)
- [x] 1.7 Chuyển cấu hình font (Baloo 2, Nunito) và CSS token / `lp-*` vào khu marketing qua wrapper `.landing-page`
- [x] 1.8 Dọn code phát hiện khi tách file:
  - [x] Footer chuyển sang class & grid gọn gàng
  - [x] Hàm `hasClass` trong `CalendarVisual` không được dùng: đã xóa
  - [x] Hiệu ứng nghiêng 3D ở Hero kiểm tra cả cảm ứng và `prefers-reduced-motion`
  - [x] Nút "Dùng thử miễn phí" đổi sang `<Link>` dạng nút

## Phase 2 - Header và Footer

- [x] 2.1 NavBar: logo, "Tính năng" (bấm vào đi tới `/features`, hover/focus mở dropdown), "Bảng giá", CTA "Dùng thử miễn phí"
- [x] 2.2 `FeaturesDropdown`: đọc từ config, chia theo 4 nhóm, mỗi mục gồm icon + tên + mô tả ngắn
- [x] 2.3 Dropdown đạt chuẩn truy cập: điều hướng bằng bàn phím, Esc đóng, `aria-expanded`
- [x] 2.4 Mobile: hamburger + drawer menu hỗ trợ truy cập 10 feature
- [x] 2.5 Footer: thêm cột "Tính năng" đọc từ config, giữ cột Nền tảng, Liên hệ, Privacy, Terms
- [x] 2.6 Nhãn nhỏ "Theo dõi" / "Thao tác" theo `type` ở dropdown

## Phase 3 - Route và trang rỗng

- [x] 3.1 `/features` (hub): làm lại theo theme dark, Việt hóa tên, lưới 10 feature đọc từ config; bỏ số liệu kỹ thuật kiểu "< 800ms" của trang cũ, và screenshot cũ
- [x] 3.2 Tạo `app/(marketing)/features/<slug>/page.tsx` cho 10 feature (mỗi feature một thư mục riêng để làm task song song không xung đột)
- [x] 3.3 Mỗi trang có `generateMetadata` (title, description) riêng, lấy từ config
- [x] 3.4 Trang 404 / fallback trong khu marketing (`not-found.tsx`)
- [x] 3.5 `/pricing`: giữ nội dung, đổi sang theme chung (không mở rộng nội dung)
- [x] 3.6 Cập nhật `app/sitemap.ts` có sẵn để sinh URL các trang feature từ config (không tạo file mới)

## Phase 4 - Khung chung cho trang con

- [x] 4.1 `FeaturePageLayout` nhận props từ config và `children`
- [x] 4.2 `Breadcrumb`: Trang chủ > Tính năng > Tên feature (kèm JSON-LD BreadcrumbList)
- [x] 4.3 Hero: tên feature + lợi ích chính + vùng minh họa tĩnh có chú thích "Hình minh họa"
- [x] 4.4 Khối "Ý nghĩa của feature trong hệ thống"
- [x] 4.5 Slot "Hướng dẫn thao tác": chỉ hiện khi `type` là `action` hoặc `mixed`
- [x] 4.6 Khối CTA dùng thử + gợi ý 2-3 feature liên quan (từ `related[]`)
- [x] 4.7 Phần thân (`children`) để trống, mỗi trang tự do trình bày theo đặc tính feature

## Phase 5 - Landing chính

- [x] 5.1 Thêm `featureSlug` vào từng bước trong `STEPS`; thêm link "Xem chi tiết" sang trang feature tương ứng
- [x] 5.2 Thêm khối `FeatureGrid` giới thiệu ngắn gọn đủ 10 feature (icon + tên + một dòng, không demo tương tác), card bấm được toàn bộ, đọc từ config
- [x] 5.3 Kiểm tra dropdown, FeatureGrid, footer, breadcrumb cùng trỏ đúng trang

## Phase 6 - Nghiệm thu

- [x] 6.1 Mọi link hoạt động, không còn `<button>` dùng để điều hướng
- [x] 6.2 Responsive: desktop / tablet / mobile
- [x] 6.3 Thử nghiệm config đồng bộ: dropdown, grid, footer, route, sitemap tự cập nhật
- [x] 6.4 Lint sạch (0 lỗi, 0 cảnh báo), bổ sung unit test `featuresConfig.test.ts` (7/7 pass) và cập nhật `landing.test.tsx` (11/11 pass)
- [x] 6.5 Kiểm tra build TypeScript (`npx tsc --noEmit` pass 100%)
- [x] 6.6 Cập nhật ledger và chuẩn bị sẵn sàng giao các task trang feature con
- [x] 6.7 Chốt khung, sẵn sàng giao task chi tiết

---

## Bước tiếp theo (task riêng, ngoài plan này)

Triển khai nội dung chi tiết từng trang, làm lần lượt theo task:

- [ ] Tổng Quan
- [ ] Tài Chính
- [ ] Cài đặt
- [ ] Học Sinh & PH
- [ ] Lớp học
- [ ] Lịch dạy
- [ ] Tài Liệu
- [ ] Bài Giảng
- [ ] Báo Cáo
- [ ] Khảo thí

## Ngoài phạm vi

- Nội dung chi tiết từng trang feature
- Module đăng bài / slideshow trong Admin (ý tưởng tương lai, thêm vào hệ thống admin đã có sẵn)
- Mở rộng nội dung `/pricing` (chỉ đổi theme)
- Blog, Hướng dẫn đầy đủ