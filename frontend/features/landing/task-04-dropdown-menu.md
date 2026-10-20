# Task 04: Sửa dropdown "Tính năng" (rớt chữ, responsive, chuyển động mượt)

Dành cho AI triển khai code. Đọc hết trước khi bắt đầu. Task nhỏ, **chỉ sửa dropdown "Tính năng" ở navbar**. Không làm việc nào khác.

## 1. Vấn đề hiện tại (từ ảnh chụp ở 1407px)

1. **Rớt chữ:** tên mục bị ngắt dòng ("Tổng Quan", "Học Sinh & PH") và nhãn phân loại bị bẻ giữa chữ ("Thao / tác", "Theo / dõi"). Nguyên nhân: 4 cột quá hẹp, nhãn không được giữ một dòng.
2. **Mô tả bị cắt dở câu** bằng dấu "…" ở hầu hết các mục, đọc không hiểu ý.
3. **Chưa responsive:** chỉ thấy bố cục 4 cột; chưa rõ hành vi ở màn hình hẹp.
4. **Xuất hiện đột ngột:** di chuột vào là menu hiện ra ngay, không có chuyển động.
5. **Thứ tự nhóm sai:** hiện đang là Giảng dạy, Đánh giá, Vận hành, Học vụ. Thứ tự đúng theo menu app là **Vận hành, Học vụ, Giảng dạy, Đánh giá**.
6. **Nền panel là trắng tinh** (`#fff`), lệch tông với nền đào ấm của trang.

## 2. Phạm vi

### Làm
Sửa 6 điểm trên.

### Không làm
- Không đổi tên mục, icon, đường dẫn, nhóm của từng feature.
- Không đổi navbar (logo, "Bảng giá", nút "Dùng thử miễn phí") và mọi phần khác của landing.
- Không đụng `/features`, `/pricing`, footer.
- Không thêm thư viện.
- Không đổi cấu trúc dữ liệu feature (nếu đã có file cấu hình, chỉ sửa chữ mô tả theo mục 3.2).

## 3. Cách làm

### 3.1 Chống rớt chữ
| Phần tử | Quy tắc |
|---|---|
| Tên mục | `white-space: nowrap`, 16px, trọng lượng 800 |
| Nhãn phân loại (Thao tác, Theo dõi, Tổng hợp) | `white-space: nowrap`, không co (`flex-shrink: 0`), 11.5px |
| Hàng chứa tên và nhãn | `display: flex; flex-wrap: wrap; align-items: center; column-gap: 8px; row-gap: 4px`. Nếu không đủ chỗ, **nhãn xuống nguyên cả cụm** dòng dưới, không bị bẻ chữ |
| Mô tả | 14px, `line-height: 1.45`, giới hạn 2 dòng (`-webkit-line-clamp: 2`) |
| Mục | padding `10px 12px`, bo góc `14px`; khi rê chuột nền nhẹ `color-mix(in srgb, var(--line) 35%, transparent)`, transition `120ms` |

### 3.2 Mô tả bị cắt
Với mỗi mục có mô tả bị cắt dở câu ở độ rộng cột chuẩn (1440px), **viết gọn lại mô tả trong dữ liệu**, mỗi mô tả không quá khoảng 60 ký tự, đọc trọn nghĩa trong 2 dòng. Giữ ý gốc, không thêm tính năng không có thật. **Liệt kê toàn bộ mô tả cũ và mới trong báo cáo cuối** để chủ dự án duyệt, không sửa âm thầm.

### 3.3 Responsive
| Chiều rộng viewport | Bố cục |
|---|---|
| ≥ 1100px | 4 cột, mỗi cột một nhóm |
| 720px đến 1099px | 2 cột |
| < 720px | 1 cột, panel rộng gần hết màn hình |

Quy tắc chung:
- Lưới `repeat(N, minmax(0, 1fr))`, khoảng cách cột `8px` đến `16px`.
- Panel: `width: min(1100px, calc(100vw - 48px))`, căn giữa dưới navbar, **không bao giờ tràn ra ngoài viewport** ở cả hai phía.
- `max-height: calc(100vh - 96px)` với `overflow-y: auto` để cuộn trong panel khi màn hình thấp.
- Padding panel `24px` (`16px` khi dưới 720px).
- Hàng chân panel ("Khám phá toàn bộ…" và link "Xem trang tổng hợp tính năng"): xếp dọc khi dưới 720px.

Nếu dưới 860px landing đã có menu hamburger riêng thì **giữ nguyên menu đó** và ghi lại trong báo cáo dropdown này được dùng ở đâu. Nếu chưa có, dropdown dùng bố cục 1 cột như bảng trên.

### 3.4 Thứ tự nhóm
Hiển thị theo thứ tự cố định: **Vận hành, Học vụ, Giảng dạy, Đánh giá**. Trong mỗi nhóm giữ thứ tự mục như menu app (Vận hành: Tổng Quan, Tài Chính, Cài đặt; Học vụ: Học Sinh & PH, Lớp học; Giảng dạy: Lịch dạy, Tài Liệu, Bài Giảng; Đánh giá: Báo Cáo, Khảo thí). Đặt thứ tự này ở một nơi duy nhất (mảng nhóm hoặc file cấu hình), không rải ở nhiều chỗ.

### 3.5 Chuyển động
**Không dùng render có điều kiện** (`{open && <Panel/>}`) hoặc `display: none`, vì như vậy không thể có chuyển động. Luôn giữ panel trong DOM và đổi trạng thái bằng thuộc tính (ví dụ `data-open`).

Mẫu tham khảo:

```css
.lp-mega {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(8px) scale(0.985);
  transform-origin: top center;
  transition: opacity .18s ease, transform .18s ease, visibility 0s linear .18s;
}
.lp-mega[data-open="true"] {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: none;
  transition-delay: 0s;
}
```

Hành vi:
- Mở: 160 đến 200ms. Đóng: cùng thời lượng, có `visibility` trễ để hiệu ứng đóng chạy hết.
- Mũi tên chevron xoay 180° có transition cùng thời lượng.
- **Chống tắt nháy:** có trễ đóng khoảng 150ms khi chuột rời nút hoặc panel, hủy nếu chuột quay lại. Giữa nút "Tính năng" và panel không được có khoảng hở làm menu đóng khi chuột đi qua (dùng vùng cầu nối trong suốt hoặc padding).
- Giữ nguyên cách mở hiện tại (rê chuột, bấm). Thiết bị cảm ứng: bấm để bật tắt.
- Bàn phím: Enter/Space mở, `Esc` đóng và trả focus về nút, Tab đi qua từng mục, `aria-expanded` và `aria-controls` đúng.
- `prefers-reduced-motion: reduce`: bỏ `transform`, chỉ giữ `opacity` rất ngắn hoặc hiện tức thì.

### 3.6 Màu bề mặt
- Nền panel: `var(--tile)` (thay `#fff`), viền `1px solid var(--line)`.
- Bóng ấm ở chế độ sáng: `0 18px 32px -8px rgba(60, 40, 20, .18), 0 2px 4px rgba(60, 40, 20, .06)`.
- Chế độ tối: giữ giao diện hiện có.
- Đường kẻ phân cách chân panel dùng `var(--line)`.

## 4. Tiêu chí hoàn thành

- [ ] Ở 1920, 1440, 1280, 1100, 1024, 768, 390px: không tên mục nào bị ngắt dòng giữa chữ, không nhãn nào bị bẻ.
- [ ] Không mô tả nào bị cắt dở câu bằng "…" ở 4 cột chuẩn; nếu vẫn bị cắt thì đã được viết gọn theo mục 3.2.
- [ ] Số cột đổi đúng theo bảng 3.3; panel nằm trọn trong viewport, không gây thanh cuộn ngang.
- [ ] Thứ tự nhóm: Vận hành, Học vụ, Giảng dạy, Đánh giá.
- [ ] Mở và đóng có chuyển động mượt 160 đến 200ms, không giật, không tắt nháy khi đưa chuột từ nút xuống panel.
- [ ] Điều hướng bàn phím và `Esc` hoạt động; `aria-expanded` đúng.
- [ ] Bật `prefers-reduced-motion` thì không còn chuyển động dịch chuyển.
- [ ] Nền panel dùng token ấm ở chế độ sáng; chế độ tối không đổi.
- [ ] Tên, icon, đường dẫn, số lượng mục không đổi. Lint và build không có cảnh báo mới.

## 5. Cách kiểm tra
1. Chạy dev server, mở `/`, rê chuột vào "Tính năng" ở các độ rộng trên.
2. Di chuột chậm từ nút xuống giữa panel, kiểm tra không bị đóng.
3. Thử Tab, Enter, Esc.
4. DevTools, Rendering, giả lập `prefers-reduced-motion` và chế độ tối.
5. Chạy lint và build.

## 6. Khi xong
Báo lại:
- File đã sửa.
- Bảng mô tả cũ và mới (mục 3.2).
- Hành vi dưới 860px (dùng hamburger có sẵn hay bố cục 1 cột).
- Ảnh chụp dropdown mở ở 1440px, 1024px và 390px.