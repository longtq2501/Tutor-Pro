# Task 01: Thêm nền lưới cho landing page

Dành cho AI triển khai code. Đọc hết trước khi bắt đầu. Task này **chỉ làm nền**, không làm việc nào khác.

## 1. Mục tiêu

Thêm một lớp **lưới ô vuông rất mờ** phía sau nội dung ở vài vùng của landing page, giống vở ô ly, để nền bớt phẳng. Màu nền hiện tại giữ nguyên.

## 2. Cấu hình đã chốt (từ bản demo)

| Thông số | Giá trị |
|---|---|
| Theme | Tối, navy (theme mặc định hiện tại của landing) |
| Kiểu lưới | Ô vuông |
| Cỡ ô | `18px` |
| Độ đậm | `5%` (đường kẻ trắng, độ trong suốt 5%) |
| Kiểu mờ dần | Ra mép (giữa rõ, mờ dần ra bốn phía) |

## 3. Phạm vi

### Làm
- Tạo lớp lưới dùng chung, đặt tên `lp-grid-bg`, bằng CSS thuần (không dùng ảnh).
- Áp dụng cho **2 vùng**: section hero (`.lp-hero`) và khối CTA cuối trang (`.lp-cta-block`).
- Khai báo các thông số dưới dạng CSS custom properties để chỉnh sau này.

### Không làm
- Không đổi màu nền, màu chữ, font, nội dung, bố cục, link.
- Không tách file, không refactor `LandingPageContent.tsx` (việc đó thuộc task khác).
- Không đụng `/features`, `/pricing`, hay bất kỳ trang nào ngoài landing `/`.
- Không thêm thư viện.
- Không áp lưới cho section `FlowIntro`, luồng 5 bước, footer (các vùng này giữ nền phẳng).

## 4. Cách làm

### 4.1 Tìm chỗ khai báo CSS hiện có
CSS của landing dùng các class `lp-*`, `landing-page`, `landing-container`. Tìm file chứa chúng (nhiều khả năng `frontend/app/globals.css`). **Thêm CSS mới vào cùng chỗ đó**, đặt gần các quy tắc `.lp-hero` và `.lp-cta`. Không tạo cơ chế styling mới.

### 4.2 Thêm biến
Đặt trong khối token của landing (cùng chỗ có `--bg`, `--ink`, `--line`...). Nếu token landing đang nằm dưới selector `.landing-page`, đặt biến ở đó, không đặt ở `:root` toàn cục.

```css
--grid-rgb: 255, 255, 255;  /* màu đường kẻ (trắng) */
--grid-a: 5;                /* độ đậm, đơn vị % */
--grid-size: 18px;          /* cỡ ô */
```

Nếu landing đã có chế độ sáng (theo `prefers-color-scheme` hoặc `data-theme="light"`), thêm giá trị cho chế độ sáng, dùng đường kẻ nâu ấm. Đây là đề xuất, chưa chốt:

```css
--grid-rgb: 138, 106, 61;
--grid-a: 10;
```

Nếu chưa có chế độ sáng, **bỏ qua phần này**, không tự tạo.

### 4.3 Thêm lớp lưới

```css
.lp-grid-bg {
  position: relative;
  isolation: isolate;       /* giữ lưới nằm sau nội dung, không lọt ra ngoài */
}
.lp-grid-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;     /* không chặn bấm chuột */
  --line-c: rgba(var(--grid-rgb), calc(var(--grid-a) / 100));
  background-image:
    linear-gradient(var(--line-c) 1px, transparent 1px),
    linear-gradient(90deg, var(--line-c) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
  -webkit-mask-image: radial-gradient(ellipse 72% 72% at 50% 50%, #000 25%, transparent 100%);
          mask-image: radial-gradient(ellipse 72% 72% at 50% 50%, #000 25%, transparent 100%);
}
```

Lưu ý quan trọng:
- Phần tử `.lp-grid-bg` **không được tự đặt nền riêng che mất lưới**. Lưới nằm ở `::before` với `z-index: -1` bên trong ngữ cảnh `isolation: isolate`, nên nó hiện **trên nền của chính phần tử** nhưng **dưới nội dung**. Nếu phần tử đã có `background`, giữ nguyên.
- Nếu `.lp-hero` hoặc `.lp-cta-block` đã dùng `::before` hay `::after` cho việc khác, **không ghi đè**. Báo lại và dùng một thẻ con trang trí thay thế.

### 4.4 Gắn vào JSX
Trong `LandingPageContent.tsx`, chỉ thêm class `lp-grid-bg` vào hai phần tử:
- `<section className="lp-hero ...">` thành `className="lp-hero lp-grid-bg"`
- `<div className="lp-cta-block">` thành `className="lp-cta-block lp-grid-bg"`

Không thay đổi gì khác trong file.

## 5. Tiêu chí hoàn thành

- [ ] Thấy lưới ô vuông rất mờ ở hero và khối CTA, rõ ở giữa và mờ dần ra bốn phía.
- [ ] Các vùng khác (FlowIntro, 5 bước, footer) vẫn nền phẳng như trước.
- [ ] Chữ, nút, mascot, thẻ nổi trong hero nằm **trên** lưới, bấm và rê chuột bình thường.
- [ ] Màu nền, màu chữ và bố cục của mọi section không đổi so với trước khi làm.
- [ ] Mobile (≤ 860px): không xuất hiện thanh cuộn ngang, lưới không tràn ra ngoài section.
- [ ] Hiệu ứng nghiêng 3D của hero vẫn hoạt động, không bị lưới che hoặc giật.
- [ ] Không có cảnh báo mới từ lint và build.
- [ ] Không file nào ngoài file CSS landing và `LandingPageContent.tsx` bị thay đổi.

## 6. Cách kiểm tra
1. Chạy dev server, mở `/`, xem hero và cuối trang.
2. Dùng DevTools thử đổi `--grid-a` lên 15 và `--grid-size` lên 32px để chắc biến có tác dụng.
3. Thu hẹp cửa sổ xuống dưới 860px, kiểm tra cuộn ngang.
4. Chạy lint và build.

## 7. Khi xong
Báo lại: file CSS nào đã sửa, có gặp xung đột `::before`/`::after` không, và có chế độ sáng sẵn không (để quyết định bước nối tiếp).