# Task 03: Chỉnh các card minh họa cho khớp nền đào ấm

Dành cho AI triển khai code. Đọc hết trước khi bắt đầu. Task này **chỉ chỉnh màu, bề mặt và chú thích** của các thành phần minh họa trong landing `/`. Không đổi bố cục, nội dung, hay hành vi.

## 1. Bối cảnh

Nền landing ở chế độ sáng đã chuyển sang đào ấm (`#F9E8D2`) kèm lưới. Nhưng các card minh họa của 5 bước vẫn mang tông cũ: nền trắng tinh, ô trống xanh xám lạnh, đường dọc xanh nhạt. Trên nền đào, những màu này tách khỏi nền, khó nhìn và không ăn nhập với tổng thể. Hero cũng có khung video chờ dùng skeleton xanh xám lạnh.

Ngoài ra có một lỗi thừa chữ: dòng "Hình minh họa" dưới mỗi card.

## 2. Phạm vi

### Làm
1. Xóa chú thích "Hình minh họa" dưới mỗi card minh họa.
2. Đổi bề mặt và màu của 5 card minh họa (lịch, lớp học online, nhận xét AI, học phí, tiến độ) sang token ấm.
3. Đổi màu đường dọc, vòng số, chip tóm tắt, skeleton của khung video chờ sang token ấm.

### Không làm
- Không đổi nội dung chữ, bố cục, kích thước, khoảng cách, hiệu ứng.
- Không đổi chế độ tối. Chế độ tối phải giống hệt trước khi làm.
- Không làm lại hình minh họa, không thay bằng ảnh hay video thật (sẽ có task riêng).
- Không đụng navbar, footer, `/features`, `/pricing`.
- Không đổi mascot (màu cố định).
- Không thêm thư viện.

## 3. Cách làm

### 3.1 Xóa chú thích
- Xóa phần tử `<p className="lp-visual-caption">Hình minh họa</p>` trong `StepFlow` (`LandingPageContent.tsx`).
- Xóa CSS `.lp-visual-caption` nếu không còn chỗ nào dùng.
- Hình vẫn là trang trí: giữ `aria-hidden="true"` như hiện có, không thêm chú thích thay thế.

### 3.2 Token ấm dùng cho chế độ sáng
Dùng lại token đã có (`--tile`, `--tile2`, `--line`, `--ink`, `--mut`, `--brand`, `--acc`, `--red`). Nếu chưa có, thêm các token màu nhóm sau vào **chế độ sáng** (và giá trị tương ứng cho chế độ tối, giữ gần màu cũ để chế độ tối không đổi):

| Token | Sáng | Vai trò trong card |
|---|---|---|
| `--g1` | `#0E7C86` | Teal |
| `--g2` | `#7C5CBF` | Tím |
| `--g3` | `#D97706` | Cam đất |
| `--g4` | `#D14B64` | Hồng đỏ |

Quy ước pha nền: **màu ô = `color-mix(in srgb, var(--gN) 30%, var(--tile))`**. Màu ô trống = `color-mix(in srgb, var(--line) 45%, var(--tile))`.

### 3.3 Quy tắc chung cho card minh họa (`.lp-visual`)
- Nền: `var(--tile)` (không dùng `#fff` hay `white`).
- Viền: `1px solid var(--line)`.
- Bóng ấm, chỉ ở chế độ sáng: `0 10px 16px -3px rgba(60, 40, 20, .10), 0 1px 2px rgba(60, 40, 20, .06)`.
- Bo góc giữ nguyên.

### 3.4 Từng hình
| Hình | Thay đổi ở chế độ sáng |
|---|---|
| 1. Lịch tuần | Ô trống dùng màu ô trống ở 3.2. Bốn màu ô (xanh, tím, hồng, vàng cũ) đổi thành pha từ `--g1`, `--g2`, `--g4`, `--g3`. Giữ viền nét đứt đỏ `--red` ở ô trùng giờ và chip cảnh báo. Chữ T2 đến CN dùng `--mut` |
| 2. Lớp học online | Khung bảng trắng tối giữ nguyên (đã tối sẵn, nổi trên nền đào). Hai ô avatar và hàng nút điều khiển dùng `--tile2` và `--line`. Nút đỏ giữ `--red` |
| 3. Nhận xét AI | Bong bóng dùng `--tile2` nền, chữ `--ink`. Nhãn pill "Gợi ý của AI" dùng `--acc` nền, chữ `--bi` |
| 4. Học phí | Hàng danh sách dùng `--tile2` hoặc viền `--line`. Chip "Đã thu" nền pha `--brand` 22%, chữ `--brand`. Chip "Chưa thu" nền pha `--red` 18%, chữ `--red` |
| 5. Tiến độ | Thanh nền (track) dùng màu ô trống. Thanh tiến độ giữ gradient từ `--brand` sang `--acc` |

### 3.5 Các thành phần khác
- **Đường dọc nối các bước:** màu `var(--line)` (hiện đang xanh nhạt).
- **Vòng số bước chưa active:** viền `var(--line)`, nền `var(--bg)`. Vòng số active giữ cam như hiện tại.
- **Chip tóm tắt 5 bước:** nền `var(--tile)`, viền `1px solid var(--line)`.
- **Khung video chờ ở hero:** thanh tiêu đề cửa sổ nền `var(--tile2)`, thân khung nền `var(--tile)`, các khối skeleton dùng màu ô trống ở 3.2, viền `var(--line)`. Giữ 3 chấm tròn đỏ, vàng, xanh lá và chữ chú thích đã có.

### 3.6 Rà soát màu cứng
Tìm trong CSS landing (`lp-*`) các màu cứng thuộc nhóm lạnh hoặc trắng tinh còn sót ở chế độ sáng (ví dụ `#fff`, `white`, các mã xanh xám nhạt, `rgba` xanh dương). Thay bằng token ở trên nếu thuộc phạm vi các thành phần đã liệt kê. Nơi nào ngoài phạm vi thì ghi lại trong báo cáo, không tự sửa.

## 4. Tiêu chí hoàn thành

- [ ] Không còn chữ "Hình minh họa" ở bất kỳ card nào.
- [ ] Ở chế độ sáng, 5 card minh họa có nền ấm (`--tile`), viền `--line`, nhìn rõ tách khỏi nền đào nhưng không chói. Không còn ô xanh xám lạnh hay trắng tinh.
- [ ] Đường dọc, chip, vòng số, khung video chờ cùng tông ấm với nền.
- [ ] Tương phản chữ trong mọi card đạt WCAG AA (đặc biệt chữ nhỏ ở lịch, chip trạng thái, nhãn AI).
- [ ] Chế độ tối giống hệt trước khi làm (so ảnh chụp trước và sau).
- [ ] Bố cục, kích thước, khoảng cách, nội dung chữ không đổi.
- [ ] Lint và build không có cảnh báo mới.

## 5. Cách kiểm tra
1. Mở `/` ở 1920×950, chế độ sáng, cuộn qua cả 5 bước, chụp ảnh từng card.
2. Chuyển sang chế độ tối, so với ảnh trước khi làm.
3. Dùng DevTools (Rendering) giả lập `prefers-color-scheme` cả sáng và tối.
4. Kiểm tra tương phản bằng công cụ của DevTools hoặc Lighthouse.
5. Chạy lint và build.

## 6. Khi xong
Báo lại:
- File đã sửa.
- Danh sách màu cứng đã thay và màu cứng còn lại nằm ngoài phạm vi.
- Ảnh chụp 5 card ở chế độ sáng và 1 ảnh chế độ tối.