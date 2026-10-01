# Task: Phân loại học sinh theo nguồn + Xuất báo cáo học phí tháng

## 0. Hướng dẫn cho Agent
- Đọc codebase trước để nhận diện stack, thư viện toast, cách lưu dữ liệu và
  hàm tính học phí đang dùng ở module Tài Chính. KHÔNG tự đổi stack.
- Tái sử dụng logic tính tiền của module Tài Chính, không viết công thức mới,
  để số liệu báo cáo luôn khớp trang Tài Chính.
- Chỉ thêm duy nhất 1 dependency mới nếu chưa có: `html-to-image`.
- Làm theo thứ tự Phần A -> B -> C. Mỗi phần chạy được độc lập.

## Phần A. Gán nhãn nguồn học sinh

### A1. Dữ liệu
- Thêm trường `nguon` cho học sinh: `"trung_tam" | "day_rieng"`.
- Migration: học sinh cũ mặc định `"trung_tam"`.
- Học sinh mới: mặc định `"trung_tam"`.

### A2. Form Thêm/Sửa học sinh (TÁI SỬ DỤNG form wizard 3 bước hiện có)
- KHÔNG tạo form hoặc modal mới. Chỉ thêm 1 trường vào form hiện có;
  form Thêm mới và form Sửa thông tin dùng chung nên thêm 1 lần là đủ cho cả hai.
- Vị trí: Bước 2 "Thiết lập học vụ & ghi chú", đặt ngay dưới "Trạng thái học tập"
  và phía trên "Học phí / giờ (VNĐ)".
- Control: nhãn "Nguồn học sinh", dạng segmented 2 lựa chọn
  "Trung tâm" | "Dạy riêng". Dùng lại đúng component/style của segmented
  "Đang học | Đã nghỉ / Tạm dừng" ở cùng bước.
- Giá trị mặc định khi thêm mới: "Trung tâm".
- Khi mở form Sửa: hiển thị đúng giá trị `nguon` hiện tại của học sinh.
- Không cần validate thêm (luôn có giá trị).
- Lưu `nguon` cùng payload với các trường khác khi bấm "Tạo Hồ Sơ" / lưu chỉnh sửa.

### A3. Hiển thị
- Trang Học Sinh & PH: badge nhỏ trên mỗi card học sinh
  (Trung tâm: màu xanh dương nhạt; Dạy riêng: màu tím nhạt).
- Thêm bộ lọc nguồn: Tất cả | Trung tâm | Dạy riêng (cạnh bộ lọc
  Tất cả/Đang học/Đã nghỉ hiện có).
- Trang Tài Chính và Lịch Dạy: thêm lọc theo nguồn vào "Bộ lọc" hiện có.
  Các số liệu tổng (doanh thu, số buổi, số học sinh) phải cập nhật theo bộ lọc.
- Lịch Dạy: thẻ buổi học có thể hiển thị chấm nhỏ phân biệt nguồn (tùy chọn).

## Phần B. Nút "Báo cáo" trong Lịch Dạy

### B1. Nút
- Vị trí: cạnh nút "Bộ lọc". Nhãn "Báo cáo" + icon FileText.
- Kiểu nút phụ (nền trắng, viền nhạt, bo tròn, chữ in hoa đậm) giống "Bộ lọc".
- Trạng thái: hover, loading (disable + spinner), disabled nếu tháng không có buổi.

### B2. Chọn phạm vi
- Bấm nút -> popover 3 lựa chọn: "Trung tâm" (mặc định, nổi bật),
  "Dạy riêng", "Tất cả".
- Chọn xong là xuất ngay, không cần thêm nút xác nhận.
- Nhớ lựa chọn gần nhất (state phía client là đủ).

### B3. Luồng xuất
1. Lấy tháng đang xem trên lịch (VD: 09/2026) + phạm vi đã chọn.
2. Tổng hợp dữ liệu bằng chính hàm của module Tài Chính.
3. Render component báo cáo ẩn ngoài màn hình, chụp PNG (pixelRatio 2).
4. Tự tải về, tên file: `bao-cao-hoc-phi-trung-tam-thang-09-2026.png`
   (phần giữa đổi theo phạm vi: `trung-tam` | `day-rieng` | `tat-ca`).
5. Toast thành công: "Xuất báo cáo thành công".
   Lỗi: toast "Xuất báo cáo thất bại, vui lòng thử lại".

### B4. Quy tắc tính toán
- Nguồn dữ liệu dùng chung module Tài Chính.
- Chỉ lấy buổi thuộc tháng đang xem và thuộc học sinh trong phạm vi đã chọn.
- "Đã dạy": trạng thái "Đã dạy". Buổi chưa diễn ra không tính.
- "Đã nghỉ": trạng thái "Học sinh hủy". Buổi nghỉ miễn tiền hoàn toàn.
- Học phí học sinh = tổng giờ đã dạy x đơn giá/giờ của học sinh đó.
- Tổng học phí = tổng học phí các học sinh trong phạm vi.

### B5. Nội dung ảnh - Chi tiết từng học sinh (cập nhật)
- Báo cáo LUÔN hiển thị đơn giá/giờ trong từng card học sinh
  (không có công tắc ẩn).
- Mỗi card gồm: tên; số buổi đã dạy / số buổi nghỉ; tổng giờ dạy;
  đơn giá/giờ; thành tiền; chip ngày học (ngày nghỉ gạch ngang, màu xám).

### B6. Giao diện
- Đồng bộ màu, font, bo góc với UI hiện tại; dễ đọc trên điện thoại.
- Tiền định dạng VNĐ: 5.484.000 đ.
- Chiều cao ảnh tự giãn theo số lượng học sinh.

## Phần C. Tiêu chí nghiệm thu
- [ ] Học sinh cũ đều có nhãn "Trung tâm" sau migration.
- [ ] Đổi nhãn 1 học sinh sang "Dạy riêng": biến mất khỏi báo cáo Trung tâm,
      xuất hiện ở báo cáo Dạy riêng, cả hai cộng lại = báo cáo Tất cả.
- [ ] Tổng tiền trong báo cáo khớp với trang Tài Chính khi lọc cùng nguồn.
- [ ] Buổi "Học sinh hủy" không cộng vào tiền, hiển thị gạch ngang.
- [ ] Toast thành công/thất bại hiển thị đúng; file PNG tải về đúng tên.
- [ ] Tháng không có buổi nào: nút bị disable.
- [ ] Giao diện sáng/tối không làm ảnh xuất bị lỗi màu (ảnh luôn nền trắng).
- [ ] Form Thêm mới và Sửa đều có trường "Nguồn học sinh" ở bước 2,
      mặc định "Trung tâm"; đổi giá trị rồi lưu thì card học sinh
      cập nhật badge ngay.

## Ngoài phạm vi (làm sau)
- Xuất PDF; báo cáo riêng từng học sinh gửi phụ huynh.
- Quản lý nhiều trung tâm (hiện chỉ có 1 nhóm "Trung tâm").
- Chọn khoảng thời gian tùy ý.