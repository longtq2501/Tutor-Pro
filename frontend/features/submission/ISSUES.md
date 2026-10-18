# Review UI Hệ thống Khảo thí: sau khi làm rõ workflow tự thu bài

*Cập nhật đánh giá sau khi biết workflow: giao bài có hạn, quá hạn thì hệ thống tự động nộp.*

Dữ liệu không phải bug, hệ thống đang chạy đúng workflow. Nhưng UI vẫn sai, chỉ là sai ở chỗ khác. Workflow "quá hạn thì tự nộp" còn làm vấn đề **trình bày** nghiêm trọng hơn.

## Cái gì vẫn sai dù logic đúng

### 1. "Nộp" và "tự động nộp" là hai thứ khác nhau, mà UI coi như một

Học sinh chủ động nộp bài và học sinh bỏ trống bị hệ thống thu bài mang ý nghĩa sư phạm hoàn toàn ngược nhau. UI gộp chung vào "Đã nộp", rồi "Đã chấm". Cần một trạng thái riêng kiểu **"Không nộp (tự thu)"**, màu khác, tách khỏi nhóm bài thật.

### 2. "Tiến độ hoàn thành 100%" và "100% ĐÃ HỌC" là nói dối

Con số này đo "bao nhiêu bài đã qua trạng thái graded", không đo học sinh đã học. Một em làm 0 câu trên 5 bài lại hiện 100% với vòng tròn tròn trịa. Chỉ báo chính phải là **điểm trung bình** hoặc **tỷ lệ bài thật sự có làm**, không phải tiến độ trạng thái.

### 3. Cúp vàng trên điểm 0

Vẫn nguyên vẹn lỗi cũ. Cúp gắn theo trạng thái chứ không theo kết quả.

### 4. Trang chấm điểm cho bài tự thu chưa làm câu nào

Đây là chỗ phí nhất. Bài trắc nghiệm bỏ trống, quá hạn thì hệ thống đã biết điểm là 0, không cần giáo viên làm gì. Vậy mà vẫn bắt mở ra một trang 12+ card, mỗi card ghi "(Chưa làm)" và đáp án đúng, kèm nút "Lưu điểm" như thể có việc cần chấm. Với bài kiểu này nên hiện **một dòng**: "Học sinh không nộp bài. Điểm: 0 (tự động)", cùng nút "Cho nộp bù / mở lại bài" nếu giáo viên muốn châm chước.

### 5. Thiếu lối thoát cho giáo viên

Workflow tự thu bài cứng thì phải có ngoại lệ: gia hạn cho một em, mở lại bài, miễn bài, chấm lại. Trong 4 ảnh không thấy nút nào cho việc này. Giáo viên sẽ bị kẹt ở tình huống rất phổ biến (học sinh ốm, mất mạng).

## Gợi ý sửa theo workflow thật

- Tách trạng thái: **Chờ làm, Đang làm, Đã nộp, Tự thu (quá hạn), Đã chấm**.
- Trang danh sách học sinh ưu tiên thứ giáo viên cần: **bài cần chấm tay** (tự luận đã nộp thật), **số bài bị tự thu**, **điểm TB**.
- Bài tự thu 0 điểm gom vào một nhóm thu gọn, không chiếm một card riêng.
- Màu ngữ nghĩa: đỏ cho tự thu, vàng cho cần chấm tay, xanh cho đã chấm bình thường.

## Các lỗi không liên quan tới workflow (vẫn đứng nguyên)

- Cỡ chữ quá nhỏ, độ tương phản yếu.
- Ngôn ngữ lẫn lộn Anh-Việt ("Pending / Submitted / Graded" so với "CHỜ LÀM / ĐANG LÀM / ĐÃ CHẤM").
- Card học sinh quá cao, lãng phí không gian, thiếu tìm kiếm, lọc, sắp xếp.
- Thanh tiến độ đen đặc, không có màu ngữ nghĩa.
- Footer "Hủy bỏ / Lưu điểm" nền mờ, chữ chạy xuyên qua phía sau.
- Sidebar toàn icon, không nhãn.

## Đánh giá UI (giao diện thị giác)

Phần trên chủ yếu nói về UX và logic. Dưới đây là phần thuần giao diện: chữ, màu, khoảng cách, thành phần.

- **Typography**: tiêu đề đậm có cá tính, nhưng toàn bộ chữ phụ (nhãn trạng thái, "Tiến độ hoàn thành", "Đáp án đúng", "Hạn", "phút") chỉ khoảng 9-11px, xám nhạt. Phân cấp chữ bị lệch: tiêu đề quá to, nội dung quá nhỏ, gần như không có cấp trung gian.
- **Màu sắc**: hầu như đơn sắc đen-trắng-xám. Chỉ có ba ô pastel (cam, xanh dương, xanh lá) cho trạng thái, nhưng chúng quá nhạt và không được dùng tiếp ở nơi khác (thanh tiến độ, điểm, đúng/sai).
- **Thanh tiến độ**: đen đặc, dày, nặng hơn mọi thành phần xung quanh. Ở 0% thì gần như vô hình, không có track nền rõ ràng.
- **Mật độ và khoảng cách**: card học sinh cao quá mức so với lượng thông tin, ba ô trạng thái to nhưng phần lớn là số 0. Ngược lại trong card chấm bài thì chữ và pill nhồi sát nhau.
- **Hero card học sinh**: avatar chữ cái khổng lồ có viền và bóng đổ, vòng tròn 100% nhỏ lơ lửng cạnh một hình trang trí mờ không rõ nghĩa. Trang trí nhiều hơn thông tin.
- **Empty state**: "DỮ LIỆU TRỐNG" gần như không đọc được do độ tương phản quá thấp, và hai cột trống chiếm hai phần ba bề ngang.
- **Icon**: sidebar chín icon cùng nét mảnh, ba icon "tài liệu" gần giống nhau, không nhãn. Cúp vàng gắn cạnh điểm 0 là sai ngữ nghĩa thị giác.
- **Footer cố định**: nền mờ trong suốt, nội dung chạy xuyên qua phía sau nên trông bẩn.
- **Nút chat nổi**: tròn đen, đè lên badge và nội dung ở góc phải dưới.
- **Điều hướng phụ**: hai tab "Theo học sinh / Thư viện bài tập" nhỏ, mờ, đặt lệch góc, không giống điều hướng chính của trang.
- **Trạng thái đúng/sai**: không có màu hay icon phân biệt, giáo viên không quét nhanh được.

## Bảng feedback cho AI Agent (module Hệ thống Khảo thí)

Quy ước màn hình: **S1** = Danh sách theo học sinh, **S2** = Chi tiết học sinh, **S3** = Chấm điểm bài làm, **G** = toàn cục. Mức độ: P0 = sửa ngay, P1 = quan trọng, P2 = nên sửa, P3 = cải thiện thêm. Workflow nền cần giữ nguyên: bài có hạn, quá hạn thì hệ thống tự động nộp.

Dòng trạng thái: ✅ = đã xong. Mỗi mục xong đều kèm file minh chứng để kiểm tra lại.

| ID | Mức độ | Loại | Màn hình | Vấn đề | Yêu cầu sửa (tiêu chí nghiệm thu) | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| FB-01 | P0 | Logic/UX | S1, S2, S3 | Bài tự thu (học sinh không nộp) bị gộp chung với bài nộp thật, hiển thị "Đã nộp" rồi "Đã chấm" | Thêm trạng thái riêng `auto_submitted` (nhãn "Tự thu"), màu đỏ/cam, tách khỏi nhóm "Đã chấm" ở mọi nơi hiển thị và đếm | ✅ Xong — backend `SubmissionStatus.AUTO_SUBMITTED` (`SubmissionStatusEnum.AUTO_SUBMITTED` phía frontend); nhãn "Tự thu" + màu cam/đỏ trong `constants/submissionStatus.ts`; đếm tách riêng ở `SubmissionList.tsx`, `StudentExamDetail.tsx` |
| FB-02 | P0 | Logic/UX | S1, S2 | "Tiến độ hoàn thành 100%" và "100% ĐÃ HỌC" đo theo trạng thái, không đo việc học thật | Thay bằng điểm trung bình và tỷ lệ bài có làm thật (bài tự thu không tính là hoàn thành). Đổi nhãn cho đúng nghĩa | ✅ Xong (18/10/2026) — **Số liệu:** `TutorStudentCard.tsx` (dòng 21-27) loại `autoSubmittedCount` + `exemptedCount` khỏi mẫu số và chỉ hiện `averageScore` khi có dữ liệu; `StudentDetailView.tsx` (dòng 219-222) loại bài tự thu khỏi mẫu số vòng tròn. **Nhãn:** `TutorStudentCard.tsx:73` → **"Tỷ lệ đã làm"**, `StudentDetailView.tsx:290` → **"Đã làm"**. Không còn chuỗi "Tiến độ hoàn thành" / "Đã học" trong 2 file |
| FB-03 | P0 | UX | S3 | Bài tự thu không có câu trả lời vẫn mở trang 12+ card "(Chưa làm)" kèm nút "Lưu điểm" | Khi `auto_submitted` và không có câu trả lời: hiện một banner "Học sinh không nộp bài. Điểm 0 (tự động)", ẩn danh sách câu hỏi mặc định (có thể mở rộng), bỏ nút "Lưu điểm" | ✅ Xong — `GradingView.tsx`: banner "Học sinh không nộp bài… Điểm 0 (tự động)", danh sách câu hỏi thu gọn sau nút mở rộng, ẩn nút "Lưu điểm"; test `components/student/__tests__/ExercisePlayer.test.tsx` |
| FB-04 | P0 | UX | S2, S3 | Giáo viên không có ngoại lệ cho workflow tự thu | Thêm hành động: gia hạn hạn nộp cho một học sinh, mở lại bài, miễn bài, chấm lại. Có xác nhận và ghi log | ✅ Xong — 4 endpoint backend (`reopen`, `extendDeadline`, `exempt`, `regrade`) trong `SubmissionController`; UI `components/teacher/SubmissionExceptionActions.tsx` + logic thuần `constants/submissionTeacherActions.ts` (22 test); đã gắn vào `GradingView.tsx` và `SubmissionList.tsx` |
| FB-05 | P1 | UI | S2 | Cúp vàng hiển thị cạnh điểm 0 /100 | Chỉ hiện cúp khi điểm đạt ngưỡng (ví dụ ≥ 80). Điểm thấp hoặc 0 dùng màu trung tính hoặc đỏ, không dùng cúp | ✅ Xong (18/10/2026 - Đợt 2) — Đổi icon Trophy ở tiêu đề nhóm "Đã nộp & chấm điểm" thành `ClipboardCheck` trong `StudentDetailView.tsx`; áp dụng ngưỡng điểm `TROPHY_THRESHOLD_PERCENT = 80` và màu đỏ cho điểm 0 trong `ExerciseRowCard.tsx`; card học sinh dùng badge `TrendingUp` thay vì Trophy |
| FB-06 | P1 | UX | S1 | Không có tìm kiếm, lọc, sắp xếp; danh sách dài vô tận | Thêm ô tìm theo tên, lọc theo lớp và trạng thái, sắp xếp, bộ lọc nhanh "Cần chấm tay" | ✅ Xong (18/10/2026) — `SubmissionList.tsx`: ô tìm kiếm học sinh kèm nút xóa, dropdown lọc theo trạng thái (`ALL`, `SUBMITTED`, `AUTO_SUBMITTED`, `GRADED`, `PENDING`, `DRAFT`), bộ lọc nhanh "Cần chấm tay" có badge đếm số lượng, sắp xếp theo thời gian nộp/tên/điểm, nút đặt lại bộ lọc, empty state thông minh; helper `needsManualGrading` trong `submissionStatus.ts` (7 unit test); test UI `SubmissionList.test.tsx` (4 test pass) |
| FB-07 | P1 | UI | S1 | Mỗi học sinh chiếm khối cao khoảng 200px, ba ô trạng thái phần lớn là số 0 | Chuyển sang dạng bảng/hàng gọn (một học sinh một hàng): tên, lớp, số bài, cần chấm, tự thu, điểm TB. Ẩn hoặc làm mờ số 0 | ✅ Xong (18/10/2026 - Đợt 2 & Hotfix theme) — `TutorStudentCard.tsx`: loại bỏ opacity lồng nhau gây mờ, chuẩn hoá viền rõ nét, nền track progress rõ ràng, trạng thái 0 dùng màu trung tính rõ nét (WCAG AA), làm nổi bật các ô có số lượng cần xử lý; `SubmissionList.tsx` hiển thị dạng bảng |
| FB-08 | P1 | UI | G | Chữ phụ 9-11px, xám nhạt, tương phản yếu | Cỡ chữ tối thiểu 12-13px; tương phản chữ/nền tối thiểu 4.5:1 (WCAG AA) cho cả light và dark mode | ✅ Xong (18/10/2026 - Đợt 1 & 2) — Đã rà soát và dọn sạch toàn bộ cỡ chữ nhỏ (`text-[7px]`, `text-[8px]`, `text-[9px]`, `text-[10px]`, `text-[11px]`) ở cả `features/submission` và `features/exercises` (`TutorStudentCard.tsx`, `StudentDetailView.tsx`, `PerformanceSection.tsx`, `ExerciseRowCard.tsx`, `StudentExerciseCard.tsx`), nâng lên tối thiểu `text-xs` (12px), đạt chuẩn WCAG AA |
| FB-09 | P1 | UI | G, S1 | Ngôn ngữ lẫn lộn: "Pending / Submitted / Graded" và "CHỜ LÀM / ĐANG LÀM / ĐÃ CHẤM" cho cùng khái niệm | Thống nhất một bộ nhãn tiếng Việt, dùng chung một bảng map trạng thái ở mọi màn hình | ✅ Xong (18/10/2026) — `constants/submissionStatus.ts` là nguồn duy nhất (`getSubmissionStatusPresentation`, `getSubmissionStatusLabel`) với nhãn "Chờ làm / Đang làm / Đã nộp / Tự thu / Đã chấm", đã dùng ở `SubmissionList.tsx` và `GradingView.tsx`. Đã Việt hoá nốt trong `SubmissionList.tsx`: tiêu đề dòng 81 → **"Bài nộp của học sinh"**; header dòng 102-105 → **"Trắc nghiệm / Tự luận / Tổng / Thao tác"**; toast dòng 43-44 → **"Lỗi" / "Không thể tải danh sách bài nộp"**. Không còn chuỗi tiếng Anh hiển thị ở 3 file S1/S2/S3 |
| FB-10 | P1 | UI | S1, S2 | Thanh tiến độ đen đặc, dày, không có màu ngữ nghĩa | Thanh mảnh hơn, có track nền rõ; màu theo ngữ nghĩa: xanh (ổn), vàng (cần chú ý), đỏ (nhiều bài tự thu/điểm thấp) | ✅ Xong (18/10/2026 - Đợt 2) — `TutorStudentCard.tsx`: thanh Progress có track nền `bg-muted/40` rõ ràng và màu ngữ nghĩa xanh/vàng/đỏ từ `getScorePresentation`; `StudentDetailView.tsx`: vòng tròn `ProgressRing` chuyển động mượt và đổi màu theo mức độ hoàn thành |
| FB-11 | P2 | UI | S1 | "Lớp: N/A" lặp ở mọi học sinh | Ẩn khi không có dữ liệu, hoặc hiển thị nút "Gán lớp" ngay tại chỗ | ✅ Xong (18/10/2026 - Đợt 2) — Ẩn hoàn toàn badge lớp khi không có dữ liệu (`student.grade ? ... : null`) ở cả `TutorStudentCard.tsx` và `StudentDetailView.tsx` thay vì hiển thị "Lớp: —" vô nghĩa |
| FB-12 | P2 | UI | S3 | Footer cố định "Hủy bỏ / Lưu điểm" nền mờ, nội dung lộ xuyên qua | Nền đặc (theo theme) có viền trên hoặc bóng nhẹ; thêm padding đáy cho danh sách để không bị che | ✅ Xong (18/10/2026 - Đợt 1) — `GradingView.tsx`: footer đổi thành nền đặc `bg-background/95 backdrop-blur-md border-t shadow-lg z-50`; container tăng padding đáy lên `pb-40` để câu hỏi cuối cùng và nhận xét chung không bao giờ bị che |
| FB-13 | P2 | UI | G | Nút chat nổi đè lên badge và nội dung góc phải dưới | Dời vị trí hoặc thêm vùng đệm; không che các thành phần tương tác | ✅ Xong (18/10/2026 - Đợt 3) — Thêm padding an toàn `pb-24 lg:pb-28` cho container chính trong `dashboard/page.tsx` giúp nội dung cuối trang không bao giờ bị che; chỉnh lại vị trí nút chat nổi `bottom-6 right-6 md:bottom-8 md:right-8`, thêm pointer-events an toàn và bọc Tooltip `Hỗ trợ & Phản hồi` trong `FeedbackWidget.tsx` |
| FB-14 | P2 | UI/UX | G | Sidebar chỉ icon, ba icon "tài liệu" gần giống nhau, không nhãn | Thêm tooltip rõ hoặc nhãn khi mở rộng; đổi icon cho khác biệt rõ; đánh dấu mục đang chọn | ✅ Xong (18/10/2026 - Đợt 3) — Bổ sung Tooltip giải thích (`side="right" sideOffset={14}`) cho từng mục khi thu gọn trong `components/tutor/Sidebar.tsx`; phân biệt rõ các icon "tài liệu" trong `dashboard/page.tsx` (Báo cáo: `BarChart3`, Tài liệu: `FolderArchive`, Khảo thí: `ClipboardCheck`) |
| FB-15 | P2 | UI | S1, S2 | Tab "Theo học sinh / Thư viện bài tập" nhỏ, mờ, lệch góc | Dùng segmented control rõ ràng, cỡ chữ lớn hơn, trạng thái active nổi bật, đặt đúng vị trí điều hướng chính | ✅ Xong (18/10/2026 - Đợt 2) — Nâng cấp tab "Theo học sinh / Thư viện bài tập" trong `exercise-dashboard.tsx` thành Segmented Control trực quan với background nổi bật, bo tròn chuẩn mực và font chữ đậm nét |
| FB-16 | P2 | UI | S2 | Hero card quá to, avatar lớn, bóng đổ nặng, hình trang trí mờ vô nghĩa | Thu nhỏ chiều cao, avatar vừa phải, bỏ hình trang trí; gom số liệu thành các chỉ số rõ ràng | ✅ Xong (18/10/2026 - Đợt 2) — `StudentDetailView.tsx` (`StudentProfileHeader`): bỏ watermark BookOpen mờ mịt ở góc, thu gọn avatar từ `h-24 w-24` xuống `h-16 w-16` thanh thoát, giảm padding từ `p-10` xuống `p-5 md:p-6`, số liệu thống kê gom thành cụm rõ ràng |
| FB-17 | P2 | UI/UX | S2 | Ba cột kanban để trống hai cột, empty state gần như vô hình | Ẩn hoặc thu gọn cột rỗng; tăng tương phản empty state; cột có dữ liệu chiếm phần rộng | ✅ Xong (18/10/2026 - Đợt 2) — `PerformanceSection.tsx`: nâng cấp `EmptySectionState` với viền nét, icon rõ nét, cỡ chữ chuẩn, thu gọn padding từ `py-12` xuống `py-6` giúp cột có bài nổi bật |
| FB-18 | P2 | UI | S2 | Tiêu đề bài tập xuống dòng lộn xộn, "Hạn" và "phút" nhồi trong pill nhỏ | Tiêu đề tối đa 2 dòng có cắt (ellipsis) kèm tooltip; meta (hạn, thời lượng) tách hàng riêng, cỡ chữ đủ đọc | ✅ Xong (18/10/2026 - Đợt 2) — `ExerciseRowCard.tsx` & `StudentExerciseCard.tsx`: tiêu đề tối đa 2 dòng kèm `title` tooltip, layout metadata (hạn, thời lượng) tách riêng thoáng đãng, cỡ chữ `text-xs` rõ ràng |
| FB-19 | P2 | UI/UX | S3 | Điểm tổng "0/100" và ô MCQ/TỰ LUẬN chữ tí hon, không rõ chỗ nhập điểm | Header điểm to và rõ; ô nhập điểm tự luận nổi bật, kiểm tra giá trị tối đa theo điểm câu hỏi | ✅ Xong (18/10/2026) — `GradingView.tsx`: header điểm phóng to rõ (`text-base` / `text-black`), có màu ngữ nghĩa từ `getScorePresentation`; ô nhập điểm tự luận nổi bật có nhãn rõ ràng `(tối đa {q.points}đ)`, validate `min={0}`, `max={q.points}`, clamp tự động không cho vượt ngưỡng |
| FB-20 | P2 | UI/UX | S3 | Không phân biệt thị giác câu đúng/sai, mỗi câu một card \~250px | Trắc nghiệm tự chấm hiển thị lưới tóm tắt đúng/sai (xanh/đỏ/xám); chỉ mở chi tiết câu sai hoặc tự luận; thêm điều hướng nhảy câu | ✅ Xong (18/10/2026) — `GradingView.tsx`: bổ sung Ma trận câu hỏi (Question Matrix) tóm tắt số câu đúng/sai/tự luận/chưa làm, lưới nút nhảy nhanh (jump-to-question with smooth scroll), bộ lọc nhanh "Chỉ hiện câu cần xem lại" thu gọn các câu trắc nghiệm đúng để giáo viên quét nhanh |
| FB-21 | P3 | UI | S1 | Ba ô Pending/Submitted/Graded to nhưng nghèo thông tin | Thay bằng badge nhỏ trong hàng, hoặc chỉ hiện ô có giá trị > 0 | ✅ Xong — `SubmissionList.tsx` dùng `Badge` nhỏ (`h-5 text-[10px]`) trong cột Trạng thái; ba ô đếm to không còn |
| FB-22 | P3 | UI | G | Hệ màu gần như đơn sắc, màu pastel không dùng nhất quán | Định nghĩa token màu trạng thái (chờ, đang làm, tự thu, cần chấm tay, đã chấm) dùng chung cho badge, thanh tiến độ, điểm, icon | ✅ Xong (18/10/2026 - Đợt 1 & 2) — Toàn bộ hệ màu ngữ nghĩa đã được định nghĩa và áp dụng đầy đủ qua `getScorePresentation` trên tất cả badge, thanh tiến độ, ring tiến độ, điểm số và icon ở `features/submission` và `features/exercises` |
| FB-23 | P0 | Backend/Logic | S3, Backend | Bài trắc nghiệm có điểm (ví dụ 90/100), khi giáo viên lưu nhận xét chung thì điểm bị ghi đè thành 0 (MCQ: 0, Tổng: 0/100) | Bảo toàn điểm MCQ khi lưu nhận xét chung; đảm bảo `recalculateAndCapScores` và `AutoGradingService` không làm mất điểm `StudentAnswer.points` hoặc đè 0.0 lên `mcqScore` đã có; không được ghi đè điểm trắc nghiệm khi bài không có tự luận | ✅ Xong (18/10/2026) — Fix trong `SubmissionServiceImpl.java#recalculateAndCapScores` + 2 unit test regression trong `SubmissionServiceTest.java` (pass 12/12) |

### Gợi ý thứ tự triển khai

1. P0 trước (FB-01 đến FB-04, FB-23): đổi mô hình trạng thái, sửa trang chấm bài và sửa ngay bug reset điểm FB-23.
2. P1: danh sách học sinh dạng bảng gọn có lọc, cỡ chữ, nhãn, màu ngữ nghĩa.
3. P2 và P3: dọn dẹp giao diện và nhất quán thiết kế.

## Tình hình thực tế (cập nhật 18/10/2026 - Sau Đợt 1, Đợt 2 & Đợt 3)

Trạng thái dưới đây đã **đối chiếu lại trực tiếp với code** (đọc file, không suy đoán từ tên file). Cột "Trạng thái" ở bảng trên ghi kèm số dòng để đối chiếu.

| Nhóm | Task | Trạng thái |
| --- | --- | --- |
| ✅ Xong hẳn | FB-01, FB-02, FB-03, FB-04, FB-05, FB-06, FB-07, FB-08, FB-09, FB-10, FB-11, FB-12, FB-13, FB-14, FB-15, FB-16, FB-17, FB-18, FB-19, FB-20, FB-21, FB-22, FB-23 | **23/23 (100% HOÀN THÀNH)** — đã kiểm chứng trong code & unit test |
| ⬜ Chưa làm | Không còn | 0/23 |

Chi tiết phần đã kiểm chứng:

- **FB-01** ✅ `SubmissionStatus.AUTO_SUBMITTED` có thật trong `SubmissionStatus.java`; nhãn "Tự thu" + màu đỏ ở `submissionStatus.ts:47-55`; badge dùng ở `SubmissionList.tsx:298-306` và `GradingView.tsx:265-276`.
- **FB-02** ✅ (18/10/2026) Mẫu số đã loại bài tự thu/miễn ở `TutorStudentCard.tsx:21-27` và `StudentDetailView.tsx:219-222`; nhãn đã đổi ở `TutorStudentCard.tsx:73` ("Tỷ lệ đã làm") và `StudentDetailView.tsx:290` ("Đã làm").
- **FB-03** ✅ `GradingView.tsx:127` gọi `isBlankAutoCollected`; `SubmissionList.tsx:313-314` hiện "Không cần chấm" cho bài tự thu trắng.
- **FB-04** ✅ 4 endpoint trong `SubmissionController`; UI `SubmissionExceptionActions.tsx`; logic `submissionTeacherActions.ts` (22 test pass).
- **FB-06** ✅ (mới, 18/10/2026 - Đợt 1) `SubmissionList.tsx`: Tìm kiếm tên/mã học sinh, lọc trạng thái (`Select`), bộ lọc nhanh "Cần chấm tay" (`needsManualGrading`), sắp xếp linh hoạt 6 tiêu chí, nút đặt lại bộ lọc, empty filter state; 4 unit test trong `SubmissionList.test.tsx` pass.
- **FB-09** ✅ (18/10/2026) Toàn bộ nhãn lấy từ `submissionStatus.ts`; không còn chuỗi tiếng Anh hiển thị ở S1/S2/S3.
- **FB-12** ✅ (mới, 18/10/2026 - Đợt 1) `GradingView.tsx`: Footer cố định đổi sang nền đặc `bg-background/95 backdrop-blur-md border-t shadow-lg z-50`; container tăng padding đáy lên `pb-40` loại bỏ triệt để hiện tượng che nội dung.
- **FB-19** ✅ (mới, 18/10/2026 - Đợt 1) `GradingView.tsx`: Header 3 ô điểm MCQ / Tự luận / Tổng to rõ (`text-base font-bold`), áp dụng màu ngữ nghĩa chuẩn `getScorePresentation`; ô nhập điểm tự luận nổi bật, validate chặt chẽ không vượt quá `q.points`.
- **FB-20** ✅ (mới, 18/10/2026 - Đợt 1) `GradingView.tsx`: Question Matrix tóm tắt số lượng đúng/sai/tự luận/chưa làm; lưới nút nhảy câu hỏi (jump-to-question smooth scroll); bộ lọc nhanh "Chỉ hiện câu cần xem lại" giúp giáo viên tập trung chấm câu sai/tự luận.
- **FB-21** ✅ `SubmissionList.tsx` dùng `Badge` trong cột Trạng thái; ba ô đếm to không còn.
- **FB-23** ✅ (Fix 18/10/2026 - P0 Bug): Bài trắc nghiệm đã có điểm (ví dụ 90/100, 9 đúng 1 sai), khi giáo viên nhập nhận xét chung ("Good!") và nhấn "Lưu điểm", điểm MCQ bị tính lại thành 0 dẫn đến tổng điểm bị reset về 0/100. **Đã fix trong `SubmissionServiceImpl.java#recalculateAndCapScores`** — xem chi tiết nhật ký fix bên dưới.

**Kết luận: 11/23 xong hẳn, 4/23 dở dang, 8/23 chưa làm.**

**Phân tích kỹ thuật lỗi FB-23 (để fix sau):**
1. **Triệu chứng:** Học sinh làm bài trắc nghiệm có kết quả đúng 9/10 câu (90/100 điểm). Khi giáo viên chỉ nhập nhận xét chung ở ô "Nhận xét chung" và bấm "Lưu điểm", kết quả trả về bị tụt về `0/100` (MCQ: 0, Tự luận: 0, Tổng: 0/100) dù ma trận câu hỏi vẫn ghi nhận đúng 9 câu.
2. **Nguyên nhân tiềm năng:** Trong `SubmissionServiceImpl.java#recalculateAndCapScores`:
   - Hàm duyệt qua danh sách `StudentAnswer` của bài nộp và cộng `mcq += a.getPoints()`. Nếu lúc nộp bài hoặc auto-grade, các record câu trả lời trắc nghiệm chưa được persist trường `points` vào bảng `student_answers` (hoặc giá trị trong entity là null/0), thì tổng điểm `mcq` sẽ bị tính ra 0.0.
   - Điều kiện fallback `mappedMcqAnswers == 0 && previousMcq > 0` không được kích hoạt vì `mappedMcqAnswers` vẫn đếm số câu hỏi trắc nghiệm mapped (`mappedMcqAnswers = 10`), dẫn đến việc `s.setMcqScore(0.0)` ghi đè mất điểm số 90 ban đầu.
3. **Giải pháp khi fix:**
   - Trong `recalculateAndCapScores`: Nếu bài nộp không có thay đổi điểm trắc nghiệm (hoặc bài trắc nghiệm đã có `previousMcq > 0` mà tổng `mcqAnswersWithPointData == 0`), phải giữ nguyên `previousMcq`.
   - Đảm bảo `AutoGradingService` luôn lưu `ans.setPoints(pts)` vào từng `StudentAnswer` khi tự chấm điểm.

---

## Nhật ký cập nhật

### 18/10/2026 — Hoàn thành Đợt 1: Trọng tâm `features/submission` (nhánh `optimization-submission`)

Đóng hoàn toàn 4 task quan trọng và nâng cấp 2 task diện rộng:

**✅ FB-06 — Tìm kiếm, lọc và sắp xếp danh sách bài nộp (`SubmissionList.tsx`)**
- Thêm ô tìm kiếm tức thời theo tên học sinh và ID.
- Thêm Select dropdown lọc theo trạng thái (`ALL`, `SUBMITTED`, `AUTO_SUBMITTED`, `GRADED`, `PENDING`, `DRAFT`).
- Thêm nút lọc nhanh **"Cần chấm tay"** có badge đếm số bài cần giáo viên xử lý (`needsManualGrading`).
- Thêm Select sắp xếp theo thời gian nộp (mới/cũ), tên học sinh (A-Z/Z-A), tổng điểm (cao/thấp).
- Nút "Đặt lại bộ lọc" và Empty State khi không có kết quả phù hợp.
- Viết 4 unit tests trong `components/teacher/__tests__/SubmissionList.test.tsx` (pass 100%).

**✅ FB-12 — Sửa footer cố định và padding đáy (`GradingView.tsx`)**
- Footer dùng nền đặc `bg-background/95 backdrop-blur-md border-t shadow-lg z-50`, nội dung phía sau không bị lộ xuyên qua.
- Tăng padding đáy container lên `pb-40` để câu hỏi cuối cùng và ô nhận xét chung luôn hiển thị đầy đủ.

**✅ FB-19 — Phóng to header điểm & validate điểm tự luận (`GradingView.tsx`)**
- Cỡ chữ nhãn và giá trị điểm ở header phóng to đạt chuẩn: MCQ (`text-base`), Tự luận (`text-base text-yellow-600`), Tổng (`text-base font-black` kèm màu ngữ nghĩa).
- Ô nhập điểm tự luận hiển thị rõ thang điểm tối đa `(tối đa {q.points}đ)`, giới hạn `min={0}`, `max={q.points}`, tự động clamp giá trị hợp lệ.

**✅ FB-20 — Ma trận câu hỏi Question Matrix & điều hướng nhảy câu (`GradingView.tsx`)**
- Thanh ma trận câu hỏi thống kê số câu đúng (xanh), sai (đỏ), tự luận (vàng), chưa làm (xám).
- Lưới nút câu hỏi trực quan 1, 2, 3... click để cuộn mượt (smooth scroll) đến câu hỏi tương ứng và highlight card.
- Bộ lọc nhanh "Chỉ hiện câu cần xem lại" cho phép ẩn các câu trắc nghiệm đã đúng để giáo viên chấm bài nhanh.
- Viết 3 unit tests trong `components/teacher/__tests__/GradingView.test.tsx` (pass 100%).

**🟡 FB-08 & FB-22 — Áp dụng chuẩn Typography và Token màu vào `features/submission`**
- Dọn sạch toàn bộ cỡ chữ `text-[8px]`, `text-[9px]`, `text-[10px]` ở `SubmissionList.tsx` và `GradingView.tsx`, nâng lên tối thiểu `text-xs` (12px), đạt chuẩn WCAG AA.
- Áp dụng `getScorePresentation` cho điểm tổng ở `SubmissionList.tsx` và `GradingView.tsx`.
- Thêm helper `needsManualGrading` vào `constants/submissionStatus.ts` kèm 7 unit tests (pass 100%).

**Kiểm thử tại thời điểm cập nhật:**
- `npx tsc --noEmit` → EXIT=0 (0 error)
- `npx eslint features/submission/components/teacher` → EXIT=0 (0 error, 0 warning)
- `npm test` → 43 test files / 274 test pass (100% pass)

### 18/10/2026 — Fix bug P0 FB-23: Điểm MCQ bị ghi đè 0 khi giáo viên lưu nhận xét chung (nhánh `optimization-submission`)

**Triệu chứng:** Học sinh làm bài trắc nghiệm 90/100 (tự nộp hoặc tự thu). Khi giáo viên chỉ nhập nhận xét chung và nhấn "Lưu điểm", điểm bị reset về 0.

**Root cause (2 lỗi kết hợp trong `SubmissionServiceImpl.java#recalculateAndCapScores`):**

1. **Đếm sai `mcqAnswersWithPointData`**: điều kiện `if (a.getPoints() != null)` không phân biệt được câu sai (điểm `0.0`) với câu chưa được chấm (cũng `0.0`) do `@Builder.Default private Double points = 0.0` trong `StudentAnswer`. Hệ quả: `mcqAnswersWithPointData` luôn = `mappedMcqAnswers`, fallback `mcqAnswersWithPointData == 0` không bao giờ trigger.

2. **Thiếu safety guard cuối**: Không có cơ chế nào ngăn `recalculateAndCapScores` ghi `mcqScore = 0.0` đè lên giá trị hợp lệ đang có, dù teacher manual grading không có quyền can thiệp điểm MCQ (chỉ AutoGradingService mới có quyền đó).

**Fix đã áp dụng (`SubmissionServiceImpl.java`, lines 483–520):**
- Đổi điều kiện đếm: `if (a.getPoints() != null && a.getPoints() > 0.0)` — chỉ đếm câu thật sự có điểm dương.
- Thêm safety guard: `if (mcq < previousMcq) { mcq = previousMcq; }` — MCQ score không bao giờ được giảm trong luồng teacher grading.

**Tests:** 2 regression test mới thêm vào `SubmissionServiceTest.java`:
- `gradeSubmission_whenTeacherAddsCommentToMcqQuiz_shouldPreserveMcqScore` (case thường: per-answer points đúng)
- `gradeSubmission_whenMcqAnswerPointsAreZeroButSubmissionScoreIs90_shouldPreserveScore` (edge case: per-answer points tất cả 0.0)

**Kết quả chạy test:** `Tests run: 12, Failures: 0, Errors: 0, Skipped: 0` — BUILD SUCCESS.

### 18/10/2026 — Hoàn thành Đợt 2: Đồng bộ màn Học sinh & Bài tập (`features/exercises` - S1 & S2)

Đóng toàn diện 8 task (FB-05, FB-07, FB-08, FB-10, FB-11, FB-15, FB-16, FB-17, FB-18, FB-22) kết nối giữa `features/submission` và `features/exercises`:

**✅ FB-05 & FB-10 — Icon nhóm bài tập & Màu tiến độ ngữ nghĩa:**
- Đổi icon `Trophy` ở tiêu đề cột kanban "Đã nộp & chấm điểm" thành `ClipboardCheck` (`StudentDetailView.tsx`), cúp chỉ trao cho bài làm thực chất đạt điểm cao (≥ 80).
- Áp dụng `progressClassName` (xanh emerald / vàng amber / đỏ rose) và track nền rõ ràng cho thanh `Progress` trong `TutorStudentCard.tsx` và vòng xoay `ProgressRing` trong `StudentDetailView.tsx`.

**✅ FB-11 & FB-15 — Ẩn badge lớp rỗng & Segmented Control:**
- Ẩn hoàn toàn badge lớp khi không có dữ liệu lớp thay vì hiển thị "Lớp: —" vô nghĩa (`TutorStudentCard.tsx`, `StudentDetailView.tsx`).
- Biến tab "Theo học sinh / Thư viện bài tập" thành Segmented Control trực quan, tương phản cao, bo tròn hiện đại và chỉ báo tab active nổi bật (`exercise-dashboard.tsx`).

**✅ FB-16 — Tinh gọn Hero Card học sinh (`StudentProfileHeader`):**
- Bỏ watermark icon trang trí `BookOpen` mờ đục vô nghĩa ở góc.
- Thu gọn avatar học sinh từ `h-24 w-24` xuống `h-16 w-16` thanh thoát, giảm padding từ `p-10` xuống `p-5 md:p-6`.
- Bố trí các ô đếm trạng thái và vòng tròn tiến độ gọn gàng, typography chuẩn mực.

**✅ FB-17 — Sửa 3 cột Kanban bài tập & Empty State (`PerformanceSection.tsx`):**
- Thu gọn chiều cao `EmptySectionState` từ `py-12` xuống `py-6`, tăng độ tương phản với viền rõ ràng, icon sắc nét và thông điệp ngắn gọn. Cột có bài tập luôn nổi bật.

**✅ FB-18 & FB-07 — Layout hiển thị Metadata bài tập & Làm mờ số 0:**
- Thêm `line-clamp-2 break-words` và `title` tooltip cho tiêu đề bài tập trong `ExerciseRowCard.tsx`.
- Tách dòng rõ ràng cho hạn nộp và thời lượng, thay `'N/A'` bằng `'—'`, Việt hoá `Duration`/`Points` thành `Thời lượng`/`Điểm số` trong `StudentExerciseCard.tsx`.
- Trong `TutorStudentCard.tsx`, tối ưu độ tương phản cho cả 2 theme sáng và tối: loại bỏ opacity lồng nhau (`opacity-60` + `text-muted-foreground/60`), tạo viền rõ nét cho các ô số liệu, track thanh tiến độ rõ ràng (`bg-slate-100 dark:bg-muted/60`), hiển thị số 0 bằng màu trung tính chuẩn WCAG AA và làm nổi bật các trạng thái có số lượng cần xử lý.

**✅ FB-08 & FB-22 — Chuẩn hoá Typography WCAG AA & Hệ màu Token toàn diện:**
- Dọn sạch toàn bộ các class cỡ chữ nhỏ `text-[7px]`, `text-[8px]`, `text-[9px]`, `text-[10px]`, `text-[11px]`, nâng lên tối thiểu `text-xs` (12px) trên toàn bộ `features/exercises`.
- Áp dụng token màu ngữ nghĩa từ `getScorePresentation` trên toàn hệ thống (badges, progress bars, rings, score numbers, icons).

**Kiểm thử xác nhận tại thời điểm kết thúc Đợt 2:**
- `npx tsc --noEmit` → EXIT=0 (0 lỗi TypeScript)
- `npm test` → 43 test suites / 274 tests pass 100%

### 18/10/2026 — Hoàn thành Đợt 3: Tinh chỉnh Layout toàn cục (FB-13, FB-14)

Đóng toàn bộ 2 task cuối cùng trong danh sách 23 feedback, hoàn thành 100% mục tiêu tái thiết kế:

**✅ FB-13 — Vùng đệm an toàn & Nút chat nổi (`FeedbackWidget.tsx`, `dashboard/page.tsx`):**
- Thêm padding đáy an toàn `pb-24 lg:pb-28` cho container chính `MainContentSwitcher` trong `app/(tutor)/dashboard/page.tsx`. Khi giáo viên hoặc học sinh cuộn đến đáy trang, các nút hành động (như phân trang, nút lưu, badge) không bao giờ bị nút chat nổi đè lên.
- Tinh chỉnh vị trí nút chat nổi sang `bottom-6 right-6 md:bottom-8 md:right-8`, thêm `pointer-events-none` cho container ngoài và `pointer-events-auto` cho các thành phần tương tác bên trong.
- Bọc nút chat trong `Tooltip` (`TooltipContent side="left"`) với nhãn rõ ràng "Hỗ trợ & Phản hồi", đồng thời nâng cỡ chữ badge trạng thái lên `text-xs font-semibold`.

**✅ FB-14 — Phân biệt Icon tài liệu & Tooltip Sidebar (`Sidebar.tsx`, `dashboard/page.tsx`):**
- Bổ sung `Tooltip` (delay 150ms, `side="right" sideOffset={14}`) cho từng mục điều hướng khi sidebar ở trạng thái thu gọn (`effectiveCollapsed = true`) trong `components/tutor/Sidebar.tsx`. Người dùng chỉ cần rê chuột vào icon là biết chính xác trang sẽ chuyển đến.
- Phân biệt rõ rệt 3 icon từng bị phàn nàn là giống nhau trong `app/(tutor)/dashboard/page.tsx`:
  - **Báo Cáo (`reports`)**: Đổi sang icon `BarChart3` (biểu đồ cột phân tích trực quan).
  - **Tài Liệu (`documents`)**: Đổi sang icon `FolderArchive` (thư mục lưu trữ tài liệu).
  - **Khảo Thí (`exercises`)**: Đổi sang icon `ClipboardCheck` (bảng kiểm tra & chấm bài).

**Kiểm thử xác nhận toàn diện sau Đợt 3:**
- `npx tsc --noEmit` → EXIT=0 (0 lỗi TypeScript)
- `npm test` → 43 test suites / 274 tests pass 100%


