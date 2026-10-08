# Nhiệm vụ: Tinh chỉnh UI theme sáng cho module "Lịch dạy" (không thiết kế lại)

## Bối cảnh
Ứng dụng quản lý lịch dạy kèm cho giáo viên. Có 3 màn hình liên quan:
1. Lịch tháng (calendar).
2. Modal "Lịch dạy trong ngày": danh sách card từng buổi dạy.
3. Modal "Chi tiết buổi học" khi bấm vào một card, có 2 giao diện tùy trạng thái:
   - Đã dạy: bên trái là thông tin (học sinh, ngày, giờ, thanh toán, ghi chú), bên phải là "Phiếu đánh giá" gồm 5 trường (nội dung bài học, thái độ học tập, khả năng tiếp thu, kiến thức chưa nắm vững, lý do/giải pháp).
   - Dự kiến (đang chờ, màu xám): form chỉnh sửa gồm bắt đầu, kết thúc, môn học, trạng thái, ghi chú, và bên phải là kho bài giảng/tài liệu (thống kê danh mục/tìm thấy/đã chọn, tab, ô tìm kiếm, bộ lọc, danh sách).

Theme tối hiện tại trông gọn và dễ nhìn. Theme sáng đang bị rối. Mục tiêu: đưa theme sáng đạt độ gọn tương đương theme tối.

## Nguyên tắc quan trọng
- Chỉ tinh chỉnh giao diện. KHÔNG đổi cấu trúc layout tổng thể, luồng thao tác, tên trường dữ liệu hay logic nghiệp vụ, trừ các điểm nêu rõ bên dưới.
- Theme tối phải giữ nguyên, không được bị ảnh hưởng.
- Dùng design token / CSS variable sẵn có của dự án. Chỉ thêm token mới khi thật sự cần. Không hardcode màu.
- Bước đầu tiên: đọc codebase, xác định stack (framework, thư viện UI, cách khai báo theme) và liệt kê các file sẽ sửa trước khi sửa.

## Quy tắc nghiệp vụ cần phản ánh trong UI
- Buổi bị học sinh hủy KHÔNG tính phí. Số tiền của buổi hủy là 0 đồng, không hiển thị đơn giá × số giờ, không hiển thị nút thanh toán, và không cộng vào "Tổng". Hiển thị dòng phụ "Không tính phí".

## Yêu cầu chỉnh sửa

### A. Cho theme sáng (ưu tiên cao nhất)
1. Bỏ bóng đổ ở card con và các ô thông tin. Thay bằng viền 1px màu xám rất nhạt. Chỉ giữ một bóng duy nhất cho chính modal.
2. Các ô thông tin (Ngày dạy, Thời gian, Thanh toán, Ghi chú, thẻ Học sinh) dùng chung một nền trung tính (xám rất nhạt hoặc trắng có viền). Không dùng mỗi ô một tông pastel khác nhau. Màu chỉ dành cho trạng thái: đã dạy, hủy, đã thu.
3. Header modal dùng màu phẳng, bỏ gradient. Nút tròn cam ở ô thanh toán bỏ glow/bóng.
4. Nhãn nhỏ ("Học sinh", "Thời gian", "Thanh toán"...) dùng chữ thường (sentence case), cỡ 12px, màu xám trung tính, không in hoa, không giãn chữ rộng.
5. Badge trạng thái giảm độ bão hòa: nền rất nhạt, chữ đậm cùng tông màu.
6. Tên học sinh dùng sentence/Title Case, weight 500-600, cỡ 15-17px (không in hoa toàn bộ, không dùng font display quá rộng).

### B. Card trong "Lịch dạy trong ngày"
1. Giờ học nằm ở cột trái (giờ bắt đầu trên, giờ kết thúc dưới, dùng số cùng độ rộng). Mọi card dùng cùng một layout, không để giờ xuống dòng lệch nhau.
2. Bỏ gạch chân ở số tiền. Dùng `font-variant-numeric: tabular-nums`. Dòng phụ "2h × 77.000 đ/h" tối thiểu 12px, đủ tương phản (4.5:1).
3. Thanh màu trạng thái bên trái mỏng 3-4px.
4. Hai nút bật/tắt cùng kích thước, cùng kiểu dáng, nhãn mô tả đúng trạng thái hiện tại:
   - Đã dạy: tắt = "Đánh dấu đã dạy" (outline xám, icon vòng tròn rỗng); bật = "Đã dạy" (nền xanh lá nhạt, chữ xanh lá đậm, icon check).
   - Thanh toán: tắt = "Chưa thu"; bật = "Đã thu" (nền xanh dương nhạt).
   - Trạng thái bật phải nổi bật hơn trạng thái tắt. Có thể bỏ tooltip "Hủy đánh dấu dạy" vì nhãn đã đủ rõ.
   - Vùng bấm tối thiểu cao 36px, trên mobile 44px.
5. Buổi học sinh hủy: dùng màu vàng cam dịu thay cho đỏ, ẩn nút thanh toán, hiển thị "Không tính phí".
6. Nút xóa chuyển vào menu "⋯" của card, kèm toast "Hoàn tác" khoảng 6 giây. Menu này cũng có mục "Học sinh hủy buổi" / "Khôi phục buổi".
7. Bỏ dấu "·" lẻ loi sau tên môn.

### C. Header modal "Lịch dạy trong ngày"
1. Thay ô "8 / 10" bằng dòng chữ rõ nghĩa: "Thứ Năm, 8 tháng 10".
2. Thêm 3 chỉ số: Tổng, Đã thu, Còn lại (buổi hủy không tính vào Tổng).
3. Nút "+" đổi thành nút có nhãn "+ Thêm buổi".
4. Sửa padding đáy modal cho cân đối (hiện đang thừa khoảng trắng).

### D. Modal "Chi tiết buổi học"
1. Giao diện "Đã dạy" và "Dự kiến" giữ đúng cấu trúc hiện tại, chỉ áp dụng các quy tắc style ở mục A.
2. Phiếu đánh giá: nhãn trường nhỏ, chữ thường; ô nhập có viền nhạt, placeholder "Chưa có thông tin" màu xám nhạt in nghiêng, cỡ chữ không nhỏ hơn 14px.
3. Nút "Viết đánh giá" chuyển thành "Lưu đánh giá" khi đang sửa.
4. Footer: nút xóa (icon, màu đỏ), "Nhân bản" (secondary), "Sửa" (primary đen). Chỉ một nút primary trong mỗi màn hình.
5. Form dự kiến: nút "Lưu" khi chưa hợp lệ vẫn bật và hiện lỗi cụ thể ("Giờ kết thúc phải sau giờ bắt đầu"), không làm mờ nút.

### E. Lịch tháng (làm sau cùng nếu còn thời gian)
1. Pill sự kiện hiển thị giờ bắt đầu thay cho icon đồng hồ không có giờ.
2. Thêm chú giải màu nhỏ phía trên lịch.
3. Chủ nhật không dùng cùng màu đỏ với trạng thái hủy (hủy dùng màu vàng cam).

## Trạng thái cần kiểm tra
Đã dạy, Dự kiến, Học sinh hủy, mỗi trạng thái ở cả hai trạng thái thanh toán. Cả theme sáng và tối. Cả desktop và mobile (modal chuyển thành bottom sheet hoặc xếp cột dọc khi hẹp).

## Accessibility
- Không chỉ dùng màu để thể hiện trạng thái, luôn kèm icon hoặc chữ.
- Toggle dùng `aria-pressed`. Nút chỉ có icon phải có `aria-label`.
- Tương phản chữ thường tối thiểu 4.5:1.
- Hỗ trợ focus bằng bàn phím, có vòng focus rõ.

## Cách làm việc và bàn giao
1. Đọc code, báo stack và danh sách file dự định sửa.
2. Sửa từng nhóm A → B → C → D → E, mỗi nhóm một commit riêng, message ngắn gọn.
3. Không thêm thư viện mới nếu không cần.
4. Cuối cùng, báo cáo: file đã sửa, token mới đã thêm (nếu có), những điểm chưa làm được và lý do, ảnh chụp trước/sau của theme sáng ở 3 trạng thái.

## Checklist nghiệm thu
- [ ] Theme sáng không còn bóng đổ ở card con, chỉ modal có bóng
- [ ] Các ô thông tin dùng chung một nền trung tính, màu chỉ xuất hiện ở trạng thái
- [ ] Header phẳng, không gradient, không glow
- [ ] Nhãn nhỏ viết thường, tên học sinh không in hoa toàn bộ
- [ ] Giờ học ở cột trái, mọi card thẳng hàng
- [ ] Số tiền không gạch chân, tabular-nums
- [ ] Hai nút bật/tắt cùng kiểu, nhãn đúng trạng thái, bật nổi hơn tắt
- [ ] Buổi hủy: màu vàng cam, 0 đồng, "Không tính phí", không có nút thanh toán, không cộng vào Tổng
- [ ] Nút xóa nằm trong menu "⋯", có Hoàn tác
- [ ] Header ghi "Thứ Năm, 8 tháng 10", có Tổng / Đã thu / Còn lại
- [ ] Modal chi tiết giữ nguyên cấu trúc cho cả hai giao diện
- [ ] Theme tối không bị thay đổi
- [ ] Hoạt động tốt trên mobile