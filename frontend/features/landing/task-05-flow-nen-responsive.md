# Task 05: Nền cho section luồng 5 bước và sửa responsive

Dành cho AI triển khai code. Đọc hết trước khi bắt đầu. Task này chỉ làm trên section "Một buổi dạy, từ đầu đến cuối" và 5 bước bên dưới (từ `FlowIntro` đến hết `StepFlow`) của landing `/`.

## 1. Vấn đề

1. **Nền đơn điệu:** từ tiêu đề "Một buổi dạy, từ đầu đến cuối" trở xuống chỉ là một màu đào phẳng, trong khi hero có lưới. Cuộn qua 5 bước rất dài mà không có gì cho mắt dừng lại hay tạo nhịp.
2. **Vỡ UI trên mobile:** hình minh họa lịch tuần ở bước 1 bị vỡ bố cục ở màn hình điện thoại. Các hình khác (bước 2 đến 5) chưa được kiểm tra, nhiều khả năng cùng lỗi.

## 2. Phạm vi

### Làm
- Phần A: thêm nền có họa tiết cho section (lưới + quầng màu theo bước).
- Phần B: sửa responsive cho `FlowIntro`, chip tóm tắt, bố cục từng bước và cả 5 hình minh họa.

### Không làm
- Không đổi nội dung chữ, thứ tự bước, hình minh họa (ngoài việc co giãn), link, hiệu ứng "bước đang active".
- Không đụng hero, navbar, dropdown, khối CTA cuối, footer, `/features`, `/pricing`.
- Không đổi token màu hiện có, chế độ tối phải giữ nguyên bản chất (chỉ thêm họa tiết nền).
- Không dùng ảnh bitmap hay thư viện mới. Nền bằng CSS thuần.
- Không dùng `overflow-x: hidden` ở `body` hoặc `html` để giấu lỗi tràn ngang. Phải sửa nguyên nhân.

## 3. Phần A: Nền section

### 3.1 Ý tưởng
Hai lớp chồng nhau, nhẹ, bằng CSS:
1. **Lưới ô vuông phủ cả section**, ô to hơn và mờ hơn hero, mờ dần ở mép trên và mép dưới để nối mượt với hero phía trên và CTA phía dưới (không có đường ranh cứng).
2. **Quầng màu mềm phía sau mỗi hình minh họa**, mỗi bước một tông, chỉ sáng rõ khi bước đó đang active (dùng lại class `active` hiện có), tối đi khi bước mờ. Nhờ vậy mắt được dẫn theo bước đang đọc.

### 3.2 Lưới
Dùng lại lớp `lp-grid-bg` đã có (task 01), thêm biến thể cho dải dài:

```css
.lp-grid-bg--band {
  --grid-size: 24px;
  --grid-a: 6;                 /* chế độ tối: 4 */
  --grid-mask: linear-gradient(to bottom, transparent 0, #000 10%, #000 90%, transparent 100%);
}
```

- Điều chỉnh `.lp-grid-bg::before` để dùng `mask-image: var(--grid-mask, <radial hiện tại>)`, sao cho hero và CTA không đổi hành vi.
- Gắn lớp cho section bao ngoài FlowIntro và StepFlow (một phần tử duy nhất bao cả hai, nếu hiện đang là hai section thì thêm một wrapper).
- Cỡ ô, độ đậm, kiểu mờ là thông số khởi đầu, đo bằng mắt và chỉnh nếu lưới quá rõ hay quá nhạt.

### 3.3 Quầng màu theo bước
- Mỗi `article.lp-row` thêm thuộc tính `data-tone` để chọn màu, ánh xạ:

| Bước | Tông | Token |
|---|---|---|
| 1 Lịch dạy | Teal | `--g1` |
| 2 Dạy học | Tím | `--g2` |
| 3 Nhận xét | Cam đất | `--g3` |
| 4 Học phí | Hồng đỏ | `--g4` |
| 5 Tiến độ | Teal | `--g1` |

- Nếu các token `--g1` đến `--g4` chưa có đủ ở cả hai chế độ, thêm theo bảng task 03 mục 3.2.
- Quầng là phần tử giả (`::before`) trên cột chứa hình minh họa, đặt phía sau hình:

```css
.lp-row[data-tone] .lp-visual-col::before {
  content: "";
  position: absolute;
  inset: -12% -8%;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--tone) 30%, transparent), transparent 75%);
  opacity: 0;
  transition: opacity .4s ease;
}
.lp-row.active .lp-visual-col::before { opacity: 1; }
```

(`.lp-visual-col` là tên minh họa: dùng cột chứa hình thực tế trong code, thêm `position: relative; isolation: isolate` cho cột đó.)

- Không dùng `filter: blur` lớn (tốn hiệu năng trên mobile); gradient đã đủ mềm.
- Chế độ tối: giữ cùng công thức, có thể tăng pha lên 24% nếu quầng quá nhạt.
- `prefers-reduced-motion: reduce`: bỏ transition của quầng, quầng hiện luôn ở mọi bước ở mức nhạt (opacity 0.6).
- Quầng không được chồng lên chữ hay làm giảm tương phản. Chữ vẫn đạt AA.

## 4. Phần B: Responsive

### 4.1 Nguyên nhân phải tìm trước khi sửa
Trước tiên tái hiện lỗi: mở `/` ở 360px và 390px, cuộn tới bước 1. Dùng DevTools tìm phần tử nào rộng hơn viewport (so `scrollWidth` với `clientWidth`). Nguyên nhân thường gặp: phần tử con của lưới không co được vì thiếu `min-width: 0`, ô lịch dùng kích thước cố định, hoặc hình có `width` px cứng. **Ghi nguyên nhân thật vào báo cáo.**

### 4.2 Quy tắc chung
- Mọi con trực tiếp của lưới `.lp-row` có `min-width: 0`.
- Hình minh họa luôn `width: 100%; max-width: 100%`, không có chiều rộng px cố định.
- Từ `860px` trở xuống: 1 cột, chữ trên, hình dưới, khoảng cách `20px` (đã có, kiểm tra lại).
- Khung `.flow` thu lề trái xuống `52px`, đường dọc cách mép `16px`, vòng số `36px`.
- Tiêu đề dùng `clamp()` đã có; kiểm tra không tràn dòng ở 360px.

### 4.3 Chip tóm tắt 5 bước
- Từ `860px` trở xuống: `flex-wrap: wrap`, khoảng cách `8px`, chữ `14px`. Không để chip bị cắt hoặc gây cuộn ngang.

### 4.4 Hình 1: lịch tuần (lỗi đã biết)
- Lưới 7 cột: `grid-template-columns: repeat(7, minmax(0, 1fr))`, khoảng cách `clamp(4px, 1.2vw, 8px)`.
- Ô lịch: bỏ chiều cao hoặc rộng cố định, dùng `aspect-ratio` (khoảng `1 / 0.9`) để ô co theo cột.
- Nhãn T2 đến CN: `clamp(10px, 2.6vw, 12px)`, không bị đẩy xuống dòng.
- Padding card: `clamp(12px, 3vw, 18px)`.
- Chip cảnh báo "Hai buổi trùng giờ vào thứ Tư": `flex-wrap`, `max-width: 100%`, chữ không tràn.
- Mũi tên điều hướng tuần giữ ở hai đầu hàng tiêu đề, không đè lên chữ "Tuần này".

### 4.5 Hình 2 đến 5 (kiểm tra và sửa nếu vỡ)
| Hình | Điều cần đảm bảo ở 360px đến 430px |
|---|---|
| 2. Lớp học online | Bảng trắng co theo chiều rộng. Nếu cột hai ô avatar làm tràn, chuyển ô avatar xuống một hàng ngang bên dưới bảng. Hàng nút điều khiển thu nhỏ hoặc xuống dòng, không đẩy ra ngoài |
| 3. Nhận xét AI | Bong bóng không tràn, chữ xuống dòng tự nhiên |
| 4. Học phí | Tên học sinh `min-width: 0` và cắt bằng `text-overflow: ellipsis` nếu quá dài; chip "Đã thu" / "Chưa thu" giữ `white-space: nowrap` |
| 5. Tiến độ | Hàng tên chương và trạng thái được xuống dòng khi thiếu chỗ; thanh tiến độ rộng 100% |

### 4.6 Vùng bấm
- Link "Tìm hiểu tính năng chi tiết →" và các chip có vùng bấm tối thiểu `44px` chiều cao trên mobile.

## 5. Tiêu chí hoàn thành

- [x] Section có lưới ô vuông mờ phủ cả dải, mờ dần ở mép trên và dưới, không có đường ranh cứng với hero và CTA.
- [x] Mỗi bước có quầng màu mềm sau hình, chỉ sáng khi bước đó active, chuyển mượt.
- [x] Hero và CTA giữ nguyên lưới ra mép như trước (không bị ảnh hưởng bởi biến thể mới).
- [x] Ở 360, 390, 430, 768, 1024, 1440, 1920px: không có thanh cuộn ngang (`scrollWidth <= clientWidth`), không phần tử nào tràn khỏi viewport.
- [x] Hình lịch tuần hiển thị đúng ở 360px: 7 cột đủ, ô không bị méo, nhãn và chip cảnh báo không tràn.
- [x] Bốn hình còn lại cũng đúng ở 360px.
- [x] Chữ trong section vẫn đạt WCAG AA trên nền mới ở cả hai chế độ.
- [x] Bật `prefers-reduced-motion` thì quầng không chuyển động.
- [x] Nội dung chữ, thứ tự, link không đổi. Lint và build không có cảnh báo mới.

## 6. Cách kiểm tra
1. Chạy dev server, mở `/`, dùng DevTools giả lập thiết bị 360×740, 390×844, 430×932, iPad 768 và 1024.
2. Ở mỗi độ rộng, chạy trong console: `document.documentElement.scrollWidth <= document.documentElement.clientWidth`, kỳ vọng `true`.
3. Cuộn qua 5 bước, quan sát quầng đổi theo bước active.
4. Đổi chế độ tối, đổi `prefers-reduced-motion`.
5. Chạy lint và build.

## 7. Khi xong
Báo lại:
- Nguyên nhân thật gây vỡ UI ở hình lịch tuần.
- File đã sửa.
- Hình nào trong số 2 đến 5 phải sửa và sửa gì.
- Ảnh chụp: section ở 1440px (sáng, tối) và 390px (cả 5 bước).

## 8. Báo cáo thực hiện

### 8.1 Nguyên nhân thật gây vỡ UI ở hình lịch tuần (360px)
1. Mỗi ô lịch có `min-height: 68px` cộng `aspect-ratio: 1 / 1`, nên ô luôn rộng tối thiểu 68px. Bảy ô + 6 khoảng `gap: 8px` + padding card `24px` cần ≈ 572px, trong khi bề ngang khả dụng ở 360px chỉ ≈ 290px → tràn ngang.
2. `.lp-cal-days` dùng `repeat(7, 1fr)` — `1fr` tương đương `minmax(auto, 1fr)`, mà `auto` = min-content, nên lưới **không co** nhỏ hơn nội dung: cột bị đẩy rộng thay vì ô thu nhỏ.
3. Cột/hàng của `.lp-row` thiếu `min-width: 0` và `.lp-visual` dùng `padding: 24px` cố định, cộng thêm các hàng flex bên trong (header lịch, hàng học phí) không có `flex-wrap` → cộng dồn thành bề rộng tối thiểu vượt viewport.

Đã sửa đúng nguyên nhân (không dùng `overflow-x: hidden`): `minmax(0, 1fr)` cho lưới 7 cột và 2 cột của `.lp-row`, bỏ `min-height` cứng của ô, `aspect-ratio: 1 / 0.9` + `border-radius`/`gap`/`padding` bằng `clamp()`, và `min-width: 0` cho mọi con trực tiếp của lưới.

### 8.2 File đã sửa
- `frontend/app/globals.css` — biến thể lưới `.lp-grid-bg--band` (mask dọc qua biến `--grid-mask`), quầng màu `.lp-visual-col::before` + `data-tone`, toàn bộ chỉnh responsive.
- `frontend/features/landing/components/LandingPageContent.tsx` — bọc `FlowIntro` + `StepFlow` trong `<div className="lp-grid-bg lp-grid-bg--band">`.
- `frontend/features/landing/components/home/StepFlow.tsx` — thêm `data-tone`, thay inline style của link bằng class `.lp-step-link*`, bọc hình trong `.lp-visual-col`.

### 8.3 Hình 2–5 đã phải sửa gì
| Hình | Sửa |
|---|---|
| 2. Lớp học online | `grid-template-columns: minmax(0, 1fr) 90px` → `minmax(0, 1fr) 72px`; ≤560px chuyển 1 cột, hai ô avatar thành hàng ngang bên dưới bảng trắng, nút điều khiển thu còn 36px. |
| 3. Nhận xét AI | Padding bong bóng/label dùng `clamp()`, hàng label `flex-wrap`, `min-width: 0` + `overflow-wrap: break-word` cho bong bóng và đoạn chữ. |
| 4. Học phí | Hàng tổng quan `flex-wrap`; hàng học sinh `gap`/`padding` `clamp()`, tên `min-width: 0` + `text-overflow: ellipsis`, chip giữ `white-space: nowrap` và không co. |
| 5. Tiến độ | `.lp-prog-head` `flex-wrap` + `gap`, tên chương `overflow-wrap`, trạng thái `nowrap`, thanh tiến độ `width/max-width: 100%`; padding `clamp()`. |

### 8.4 Số đo kiểm chứng (Playwright, Chromium, dev server `/`)
| Viewport | `scrollWidth` | `clientWidth` | Phần tử tràn viewport trong band |
|---|---|---|---|
| 360 | 360 | 360 | 0 |
| 390 | 390 | 390 | 0 |
| 430 | 430 | 430 | 0 |
| 768 | 768 | 768 | 0 |
| 861 | 861 | 861 | 0 |
| 1024 | 1024 | 1024 | 0 |
| 1440 | 1440 | 1440 | 0 |
| 1920 | 1920 | 1920 | 0 |

- Lưới band: `24px 24px`, mask `linear-gradient(transparent 0, #000 10%, #000 90%, transparent 100%)`; độ đậm `--grid-a` = 6 (sáng) / 4 (tối).
- Hero và CTA giữ nguyên `18px 18px` + mask radial cũ (`radial-gradient(72% 72% at 50% 50%, …)`), `--grid-a` 10 (sáng) / 5 (tối).
- Quầng: bước active `opacity: 1`, bước khác `0`; tông đúng bảng 3.3 (teal/tím/cam đất/hồng đỏ/teal). Vòng số bước không còn bị cắt: `left` vòng số = 0px ở mọi viewport ≤ 860px.
- Tương phản chữ (đo trên nền trang): tiêu đề bước 15.28:1 (sáng) / 18.82:1 (tối); đoạn mô tả 6.28:1 / 10.47:1 → đạt WCAG AA.
- `prefers-reduced-motion: reduce`: quầng đứng yên ở `opacity: 0.6`, `transition-duration: 0s`.

### 8.5 Ảnh chụp
Sinh bằng Playwright, lưu ở `%TEMP%\lp-shots\`:
- `band-1440-light.png`, `band-1440-dark.png` — toàn dải section ở 1440px.
- `vw390-step1..5.png` — từng bước ở 390px (cắt theo viewport, thấy cả đường dọc và vòng số).
- `vw360-step1..5.png` — từng bước ở 360px.
- `glow-light-1440.png`, `glow-dark-1440.png` — cận cảnh quầng màu sau hình bước 1.

### 8.6 Lint / test / build
- `npx eslint features/landing/components/LandingPageContent.tsx features/landing/components/home/StepFlow.tsx` → 0 lỗi, 0 cảnh báo (log rỗng).
- `npx vitest run features/landing/__tests__/featuresConfig.test.ts` → 9/9 pass.
- `npm run build` (Next 16.0.7 + Turbopack) → **thành công toàn bộ**: `✓ Compiled successfully in 18.2s`, type check qua, `✓ Generating static pages (36/36)`, `Finalizing page optimization ...`, không còn lỗi type.
- `node %TEMP%\lp-audit.js` chạy lại sau khi khôi phục `node_modules`: 8 viewport (360 → 1920) đều `scrollWidth == clientWidth`, `over: []`, mask band/CTA đúng như bảng 8.4.

### 8.7 Ghi chú về `node_modules` (không phải thay đổi của task)
Để chụp ảnh kiểm chứng, Playwright được cài tạm bằng `npm install --no-save --no-package-lock`, khiến npm kéo các bản mới hơn lockfile (`react-aria-components` 1.22.1, `@internationalized/date` 3.12.4, `vitest` 4.1.12). Chính độ lệch này sinh ra lỗi type ở `components/ui/date-picker.tsx` mà lần build đầu gặp phải — **không phải lỗi có sẵn của repo và không liên quan task 05**.

Đã khôi phục đúng lockfile bằng `npm ci` (lần đầu fail `ENOTEMPTY` vì dev server và một tiến trình npm khác đang giữ file; đã dừng các tiến trình rồi chạy lại trên cây sạch). Trạng thái hiện tại khớp `package-lock.json`: `next` 16.0.7, `react-aria-components` 1.14.0, `@internationalized/date` 3.10.1, `typescript` 5.9.3, `vitest` 4.0.17, `react-day-picker` 9.13.0. `package.json` / `package-lock.json` không bị sửa (git status sạch với hai file này). Build xanh là kết quả đo trên cây dependency chuẩn này.
