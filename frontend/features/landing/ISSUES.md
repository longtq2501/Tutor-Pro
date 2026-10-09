# Kế hoạch triển khai UI Landing Page (phiên bản B2)

Tài liệu này dành cho Agent triển khai code. Nó mô tả **thiết kế UI đã được chốt** cho landing page chính. Hãy đọc hết trước khi bắt đầu.

## 0. Phạm vi và quy ước

### Trong phạm vi
Thiết kế giao diện landing page: bảng màu, typography, layout, các section, component, hiệu ứng chuyển động, responsive, accessibility.

### Ngoài phạm vi (KHÔNG làm theo file tham chiếu)
File tham chiếu `tutorpro-landing-b2.html` (nếu được đính kèm) là **mockup**. Các thứ sau trong mockup chỉ là placeholder, **bỏ qua và giữ nguyên những gì hệ thống hiện có**:
- Logo, tên thương hiệu, favicon
- Đường dẫn (href) của nav, nút CTA, footer
- Email, bản quyền, nội dung footer
- Meta tag, SEO, analytics, auth, routing
- Bất kỳ logic backend nào

Phần logo và các thành phần thương hiệu sẽ do hệ thống hiện tại tự áp dụng. Nếu cần chỗ đặt logo, chỉ cần để slot đúng vị trí đã mô tả ở mục 5.1.

### Nguyên tắc nội dung (quan trọng)
- **Chỉ mô tả tính năng hệ thống thật sự có.** Danh sách tính năng ở mục 5.4 lấy từ nội dung landing hiện tại; trước khi merge, chủ dự án cần rà lại từng dòng.
- **Không** dùng số liệu kỹ thuật làm điểm bán (ví dụ "< 800ms", SSE, WebRTC). Nói bằng lợi ích với gia sư.
- **Không** làm demo tương tác giả lập chức năng (bấm xếp lịch, quét QR, vẽ bảng...). Chỉ dùng hình minh họa tĩnh, có chú thích "Hình minh họa".
- **Không** dùng screenshot thật của hệ thống trong landing này.
- Không bịa số liệu, tên khách hàng, phản hồi người dùng.

### Công nghệ
Giữ nguyên stack hiện tại của dự án (site đang chạy Next.js). Dùng cách styling mà dự án đang dùng (Tailwind, CSS Modules...), nhưng **token màu và kích thước phải đặt dưới dạng CSS custom properties** để dễ đổi theme. Chỉ các phần có tương tác (hiệu ứng nghiêng 3D, theo dõi cuộn) cần là client component.

---

## 1. Tổng quan thiết kế

- **Phong cách:** "bảng đen" hiện đại: nền navy đậm, chữ sáng, điểm nhấn cam hổ phách và teal. Có chế độ sáng.
- **Điểm nhấn duy nhất:** nhân vật chibi gia sư nam trong khối vuông cam ở hero, nghiêng 3D theo chuột.
- **Cấu trúc đọc:** một đường dọc duy nhất, kể "một buổi dạy từ đầu đến cuối" qua 5 bước đánh số. Không dùng lưới nhiều ô.
- **Giọng văn:** tiếng Việt, câu ngắn, nói theo lợi ích, xưng "bạn".

Thứ tự section:
1. Navbar (sticky)
2. Hero
3. Giới thiệu và thanh tóm tắt 5 bước
4. Luồng 5 bước tính năng
5. CTA cuối trang
6. Footer

---

## 2. Design tokens

Đặt trong `:root`. **Dark là mặc định.**

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#0e2233` | `#f4f8fb` |
| `--ink` (chữ chính) | `#f3f7fb` | `#12263f` |
| `--mut` (chữ phụ) | `#a8bdd0` | `#566a80` |
| `--tile` (nền card) | `#16334a` | `#ffffff` |
| `--tile2` (nền card cấp 2) | `#1d4260` | `#e8f0f7` |
| `--line` (viền) | `#2a4d6b` | `#d3e0eb` |
| `--brand` (teal) | `#2dd4bf` | `#0e7c86` |
| `--acc` (cam hổ phách) | `#fbbf24` | `#f59e0b` |
| `--bi` (chữ trên nền cam/teal) | `#2a1c00` | `#2a1c00` |
| `--red` (cảnh báo) | `#fb7185` | `#e11d48` |

Cơ chế theme (làm đúng 3 lớp):
1. `:root` = dark.
2. `@media (prefers-color-scheme: light)` áp light cho `:root:not([data-theme="dark"])`.
3. `:root[data-theme="light"]` ép light.

Nếu dự án đã có hệ thống theme riêng, ánh xạ các token này vào đó thay vì tạo cơ chế song song.

**Typography**
- Tiêu đề: `Baloo 2` (600, 800). Nội dung: `Nunito` (500, 700, 800). Cả hai hỗ trợ tiếng Việt có dấu.
- Fallback: `system-ui, sans-serif`. Dùng `next/font` hoặc cơ chế font sẵn có của dự án, bật subset `vietnamese` và `latin`.
- Thang chữ: nội dung 17px / line-height 1.6; h1 `clamp(40px, 6vw, 66px)` weight 800; h2 `clamp(30px, 4.4vw, 46px)`; h3 trong từng bước `clamp(26px, 3.4vw, 36px)`; mô tả hero 20px.
- Tiêu đề line-height 1.12. Giới hạn độ rộng đoạn văn khoảng 26 đến 34 ký tự "em" cho dễ đọc.
- Dùng chữ thường đầu câu (sentence case) cho nút và tiêu đề. Tránh IN HOA toàn bộ.

**Bo góc và bóng**
- Pill (nút, chip): `999px`. Card/vis: `26px`. Khối CTA cuối: `40px`. Ô nhỏ trong visual: `9px` đến `18px`.
- Bóng card/visual: `0 20px 40px rgba(0,0,0,.18)`. Bóng thẻ nổi hero: `0 12px 28px rgba(0,0,0,.25)`.

**Layout**
- Container: `max-width: 1120px`, padding ngang `22px`.
- Breakpoint chính: `860px` (mobile bên dưới).
- Mobile phải xử lý safe-area: `viewport-fit=cover`, đệm `env(safe-area-inset-top/bottom)`.

---

## 3. Component dùng chung

### 3.1 Button
- Dạng pill, padding `12px 26px`, font Baloo 2 weight 800, cỡ 17px.
- **Primary:** nền `--acc`, chữ `--bi`, bóng cứng `0 5px 0 rgba(0,0,0,.28)`.
  - Hover: `translateY(2px)`, bóng `0 3px 0`.
  - Active: `translateY(5px)`, bóng bỏ.
  - Transition `.12s`.
- **Ghost:** nền trong suốt, chữ `--ink`, viền trong `inset 0 0 0 2px var(--line)`.
- Focus: `outline: 3px solid var(--acc); outline-offset: 3px`.
- Nhãn nút CTA chính: "Dùng thử miễn phí". Nhãn nút phụ ở hero: "Xem Tutor Pro làm gì" (cuộn tới mục 4).

### 3.2 Card/Visual frame
Nền `--tile`, viền `1px solid var(--line)`, bo `26px`, padding `18px`, bóng như mục 2. Bên dưới luôn có dòng chú thích nhỏ "Hình minh họa" (12.5px, màu `--mut`, margin-top 12px).

### 3.3 Chip tóm tắt bước
Pill có viền, nền `--tile`, gồm vòng tròn số (26px, nền `--acc`, chữ `--bi`) và nhãn bước, font 15px weight 800.

### 3.4 Status chip (trong visual học phí)
Pill nhỏ, chữ 13.5px weight 800. "Đã thu": nền teal 22% độ trong, chữ `--brand`. "Chưa thu": nền đỏ 18%, chữ `--red`. Dùng `color-mix(in srgb, ...)`.

---

## 4. Nhân vật minh họa (mascot)

Chỉ xuất hiện ở **hero**. Không dùng ở các bước tính năng.

- Gia sư nam, kiểu chibi (đầu to, mắt tròn), áo sơ mi trắng, **vest ghi lét xanh navy** (`#12385b`), cà vạt cam (`#f59e0b`), kính tròn, tóc đen (`#2b2b3a`) có mái rẽ ngôi và một lọn nhô ở đỉnh, má hồng, da `#ffe3cc`.
- Nhân vật đứng trong **một khối vuông bo góc (rx 24) màu cam `--acc`** làm nền tương phản. Không dùng nền tròn, blob hay gradient phía sau.
- Tay trái buông xuôi, **tay phải giơ lên vẫy** (xoay quanh vai ±16°, chu kỳ 2.4s, ease-in-out, lặp vô hạn).
- Chớp mắt: scaleY của mắt về 0.1 ở 97% chu kỳ 4.5s.
- Dạng triển khai: SVG inline (symbol, viewBox `0 0 200 240`). **Lấy mã SVG từ symbol `#c` trong file tham chiếu**, đặt thành component riêng, nhận prop kích thước.
- Mọi hình trang trí đặt `aria-hidden="true"`.

---

## 5. Đặc tả từng section

### 5.1 Navbar
- `position: sticky; top: env(safe-area-inset-top, 0)`; cao 64px; nền `--bg` pha 85% độ trong và `backdrop-filter: blur(12px)`; viền dưới `--line`.
- Trái: slot logo (dùng logo của hệ thống). Phải: link "Tính năng", "Bảng giá" (màu `--mut`, weight 700) và nút primary "Dùng thử miễn phí".
- Mobile: ẩn link chữ, chỉ giữ logo và nút CTA.
- Nav phải nền đặc/mờ để không bị nội dung cuộn đè lên đọc không được.

### 5.2 Hero
- Lưới 2 cột `1.1fr 1fr`, canh giữa theo chiều dọc, gap 30px, padding trên 56px, dưới 50px. Mobile: 1 cột, chữ trên, nhân vật dưới.
- **Cột trái**
  - H1 (2 dòng): "Bạn lo dạy hay." / "Tutor Pro lo phần còn lại."
  - Mô tả: "Lịch dạy, học phí, lớp học online và nhận xét cho phụ huynh, gọn trong một nơi."
  - Hàng nút: Primary "Dùng thử miễn phí" và Ghost "Xem Tutor Pro làm gì".
  - Không thêm nhãn "đang phát triển" hay badge trạng thái.
- **Cột phải (khối 3D)**
  - Vùng cao 420px (350px trên mobile), `perspective: 1000px`.
  - Lớp `rig` có `transform-style: preserve-3d` và xoay theo con trỏ: `rotateY = (x_ratio - 0.5) × 16°`, `rotateX = -(y_ratio - 0.5) × 12°`; transition `.18s ease-out`. Khi chuột rời khỏi vùng thì về 0.
  - Mascot rộng 290px, `translateZ(30px)`, đặt giữa.
  - Hai thẻ nổi (nền `--tile`, viền `--line`, bo 16px, chữ 14px weight 700):
    - Trái-trên: "Hôm nay 19:00" / phụ "Minh Anh, IELTS", `translateZ(90px)`.
    - Phải-dưới: "Đã thu học phí" / phụ "Cập nhật ngay trên hệ thống", `translateZ(110px)`.
  - Nội dung hai thẻ chỉ là minh họa, không dùng số liệu tiền cụ thể.
  - Trên thiết bị cảm ứng, hiệu ứng nghiêng tắt, mascot chỉ vẫy tay.

### 5.3 Giới thiệu và thanh tóm tắt (anchor `#flow`)
- H2: "Một buổi dạy, từ đầu đến cuối". Đoạn phụ: "Tutor Pro đi cùng bạn qua 5 việc quen thuộc của mỗi buổi học."
- Dưới là hàng 5 chip (mục 3.3), mỗi chip là link neo tới bước tương ứng: Xếp lịch, Dạy học, Nhận xét, Thu học phí, Theo dõi tiến độ.
- `scroll-padding-top` đủ lớn (khoảng 80px cộng safe-area) để tiêu đề không bị navbar che khi nhảy neo.

### 5.4 Luồng 5 bước (cốt lõi)

**Khung:** container `.flow` có `padding-left: 64px` (52px mobile). Một đường dọc rộng 3px màu `--line` chạy bên trái (cách mép 19px, trái 16px mobile) nối các nút số.

**Mỗi bước (`row`):**
- Lưới 2 cột `1fr 1.15fr`, gap 44px, `min-height: 360px`, `margin-bottom: 70px`. Chữ **luôn bên trái**, hình **luôn bên phải** (không đảo trái/phải giữa các bước, để mắt giữ một đường đọc). Mobile: 1 cột, chữ trên hình, gap 20px.
- Nút số: hình tròn 42px (36px mobile), đặt tuyệt đối bên trái khung, viền 3px `--line`, nền `--bg`, số font Baloo 2 weight 800.
- Trạng thái: bước đang ở giữa màn hình là **active** (nút số đổi nền `--acc`, viền `--acc`, chữ `--bi`, cả hàng opacity 1). Các bước khác opacity `.5`. Transition `.4s`.
- Cột chữ: H3, một câu mô tả, danh sách đúng 2 gạch đầu dòng. Dấu tick là ô vuông bo 7px nền `--brand` chữ `--bi`.

**Nội dung 5 bước** (chỉ dùng đúng các ý này):

| # | H3 | Mô tả | Gạch đầu dòng |
|---|---|---|---|
| 1 | Lịch dạy rõ ràng cả tuần | Xem lịch theo ngày hoặc tuần trong một màn hình. | Phát hiện lịch trùng để xử lý sớm / Tạo lịch hàng loạt cho nhiều học sinh |
| 2 | Dạy ngay trong ứng dụng | Tổ chức lớp online với bảng trắng và phòng học, không cần chuyển qua nền tảng khác. | Bảng trắng và phòng học đồng bộ / Sắp bài giảng theo chương hoặc buổi học |
| 3 | Nhận xét buổi học nhanh hơn | AI gợi ý nhận xét theo nội dung buổi học, để bạn bớt ngồi nghĩ chữ sau giờ dạy. | Gợi ý theo ngữ cảnh từng buổi / Viết bằng tiếng Việt tự nhiên |
| 4 | Biết ai đã đóng, ai chưa | Theo dõi học phí đã thu và chưa thu của từng học sinh, kèm doanh thu theo chu kỳ. | Công nợ theo từng học sinh / Đối soát học phí qua VietQR |
| 5 | Theo sát tiến độ từng em | Tổng hợp kết quả học tập để điều chỉnh lộ trình cho phù hợp. | Đánh giá theo buổi học và theo giai đoạn / Tài liệu lưu tập trung, tìm lại nhanh |

**Hình minh họa mỗi bước** (tĩnh, dựng bằng HTML/CSS/SVG nhẹ, đặt trong Visual frame mục 3.2):
1. **Lịch tuần:** lưới 7 cột (T2 đến CN) × 3 hàng ô bo 9px; vài ô tô màu khác nhau (chàm, xanh da trời, hồng) đại diện cho các học sinh; **một ô viền nét đứt đỏ** (`--red`) ở thứ Tư; bên dưới chip đỏ "Hai buổi trùng giờ vào thứ Tư".
2. **Lớp học online:** SVG khung bảng trắng tối kèm nét viết phấn teal và vàng; cột bên phải hai ô video có hình đầu người đơn giản; hàng nút điều khiển dưới cùng, một nút đỏ (ghi/thoát).
3. **Nhận xét AI:** bong bóng chat (bo 18px, góc dưới trái nhọn) có nhãn pill cam "Gợi ý của AI" và đoạn nhận xét mẫu 2 đến 3 câu.
4. **Học phí:** danh sách 3 học sinh (avatar chữ viết tắt, tên, status chip "Đã thu"/"Chưa thu") và dòng tổng "Học phí tháng này, Đã thu 2 / 3 em".
5. **Tiến độ:** 3 thanh tiến độ cho Chương 1 (Hoàn thành, 100%), Chương 2 (Đang học, 60%), Chương 3 (Sắp tới, 15%); thanh gradient từ `--brand` sang `--acc`.

**Cơ chế active khi cuộn:** dùng `IntersectionObserver` với `rootMargin: "-35% 0px -35% 0px"`; phần tử nào giao với dải giữa màn hình thì gắn class active. Dùng một observer duy nhất cho nhiều phần tử là đủ.

### 5.5 CTA cuối trang
Khối căn giữa, nền `--tile`, viền `--line`, bo 40px, padding `50px 24px`. H2 "Sẵn sàng dạy nhẹ nhàng hơn?", đoạn "Dùng thử miễn phí, bắt đầu trong vài phút.", nút primary "Dùng thử miễn phí". Padding dưới section khoảng 80px.

### 5.6 Footer
Giữ nguyên nội dung, link, bản quyền của hệ thống hiện tại. Chỉ áp phong cách: viền trên `--line`, chữ 15px màu `--mut`, bố cục flex hai đầu có wrap.

---

## 6. Chuyển động (tổng hợp)

Chỉ dùng chuyển động có chủ đích, tránh hiệu ứng hiện dần lặp lại ở mọi section.

| Hiệu ứng | Chi tiết |
|---|---|
| Nghiêng 3D hero | Theo con trỏ, mục 5.2 |
| Vẫy tay mascot | 2.4s ease-in-out vô hạn |
| Chớp mắt mascot | 4.5s vô hạn |
| Nút bấm "lún" | Hover/active như mục 3.1 |
| Active bước khi cuộn | Opacity và màu nút số, `.4s` |
| Cuộn mượt khi bấm neo | `scroll-behavior: smooth` |

**`prefers-reduced-motion: reduce`:** tắt toàn bộ animation và transition, tắt cuộn mượt, đặt mọi bước ở opacity 1, tắt nghiêng 3D.

---

## 7. Responsive, accessibility, hiệu năng

- **Mobile (≤ 860px):** hero và các bước về 1 cột; navbar chỉ còn logo và CTA; hero 3D cao 350px; khung `.flow` thu hẹp lề trái; đường dọc và nút số nhỏ lại.
- Không để nội dung rộng làm trang cuộn ngang. Visual lớn phải co theo chiều rộng (`width: 100%`).
- Tương phản chữ tối thiểu WCAG AA ở cả dark và light.
- Mọi phần tử tương tác có `:focus-visible` rõ ràng. Chip neo và nút phải thao tác được bằng bàn phím.
- Hình trang trí (mascot, hình minh họa) `aria-hidden="true"`; thông tin quan trọng luôn có ở dạng chữ.
- Trang dùng đúng một thẻ `h1`; thứ bậc heading h1, h2, h3 hợp lý.
- Không dùng ảnh bitmap lớn; mọi hình minh họa là SVG/CSS. Font tải với `display: swap`.
- Mục tiêu: không layout shift lớn khi tải; điểm Lighthouse Accessibility ≥ 95.

---

## 8. Các bước triển khai (đề xuất)

1. **Chuẩn bị:** đọc cấu trúc landing hiện tại, xác định nơi đặt trang, cách styling, font, theme. Liệt kê những gì tái sử dụng (navbar, footer, logo, link).
2. **Token và theme:** thêm CSS variables ở mục 2, kết nối cơ chế dark/light, cấu hình font.
3. **Component nền:** Button, Visual frame, Chip, Status chip.
4. **Mascot:** tách SVG thành component, gắn animation vẫy tay và chớp mắt.
5. **Hero:** layout 2 cột, khối 3D nghiêng theo con trỏ, hai thẻ nổi; xử lý riêng cho cảm ứng.
6. **Giới thiệu và thanh 5 chip:** gồm anchor và scroll-padding.
7. **Luồng 5 bước:** khung `.flow`, `row`, đường dọc, nút số, 5 hình minh họa, observer active.
8. **CTA và footer:** áp phong cách, giữ nội dung hệ thống.
9. **Responsive và reduced-motion:** kiểm tra theo mục 6 và 7.
10. **QA:** chạy checklist mục 9.

---

## 9. Checklist nghiệm thu

- [ ] Có đủ 6 section theo đúng thứ tự mục 1.
- [ ] Dark mặc định; light đúng cả khi theo hệ điều hành lẫn ép bằng `data-theme`.
- [ ] H1, mô tả, nội dung 5 bước, nhãn nút khớp mục 5 (hoặc đã được chủ dự án duyệt thay đổi).
- [ ] Không có số liệu kỹ thuật (ms), không có demo tương tác giả lập, không có screenshot thật.
- [ ] Mỗi hình minh họa đều có chú thích "Hình minh họa".
- [ ] Nhân vật nằm trong khối vuông cam, không có nền tròn hoặc blob.
- [ ] Hero nghiêng 3D theo chuột trên desktop; vẫy tay và chớp mắt hoạt động.
- [ ] Bước đang đọc được làm nổi bật, các bước còn lại mờ đi; bấm chip nhảy đúng bước mà không bị navbar che.
- [ ] Navbar không bị nội dung đè lên khi cuộn.
- [ ] Mobile ≤ 860px hiển thị đúng, không cuộn ngang, safe-area ổn trên điện thoại có tai thỏ.
- [ ] `prefers-reduced-motion` được tôn trọng.
- [ ] Điều hướng bàn phím và focus hoạt động; tương phản đạt AA.
- [ ] Logo, link, email, footer, meta vẫn là của hệ thống (không bị ghi đè bởi placeholder trong mockup).

---

## 10. Ngoài đợt này (backlog, chưa làm)

- Phần phản hồi (testimonial) của người dùng thật
- Mục bảng giá và FAQ trên landing
- Bản mascot 3D thật (Three.js/Spline) hoặc bộ minh họa do họa sĩ vẽ

Những hướng đã cân nhắc và **không chọn**: cảnh nhân vật chỉ tay vào từng tính năng (phiên bản A), lưới bento với ô tương tác (phiên bản B). Không triển khai các hướng này.