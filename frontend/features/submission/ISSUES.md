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
| FB-05 | P1 | UI | S2 | Cúp vàng hiển thị cạnh điểm 0 /100 | Chỉ hiện cúp khi điểm đạt ngưỡng (ví dụ ≥ 80). Điểm thấp hoặc 0 dùng màu trung tính hoặc đỏ, không dùng cúp | 🟡 Gần xong. Cúp cạnh **điểm số** đã không còn: `TutorStudentCard.tsx` dùng badge `TrendingUp` cho điểm TB (`TutorStudentCard.tsx:45-54`). Nhưng còn 1 chỗ dùng `Trophy` ở `StudentDetailView.tsx:15,169` — cúp gắn cho **tiêu đề nhóm "Đã nộp & chấm điểm"**, không gắn theo điểm. Cần chốt: đổi icon nhóm này, và bổ sung quy tắc màu theo ngưỡng điểm (hiện điểm thấp/0 vẫn dùng `text-primary` trung tính, chưa có màu cảnh báo) |
| FB-06 | P1 | UX | S1 | Không có tìm kiếm, lọc, sắp xếp; danh sách dài vô tận | Thêm ô tìm theo tên, lọc theo lớp và trạng thái, sắp xếp, bộ lọc nhanh "Cần chấm tay" | ⬜ Chưa làm — `SubmissionList.tsx` chỉ có state `submissions` + `isLoading`, không có `Input`/`Select`/`filter`/`sort` nào. Đây là hạng mục nặng nhất của Phase 2 |
| FB-07 | P1 | UI | S1 | Mỗi học sinh chiếm khối cao khoảng 200px, ba ô trạng thái phần lớn là số 0 | Chuyển sang dạng bảng/hàng gọn (một học sinh một hàng): tên, lớp, số bài, cần chấm, tự thu, điểm TB. Ẩn hoặc làm mờ số 0 | 🟡 Một phần. Đã xong: `SubmissionList.tsx` là bảng một hàng mỗi bài (`h-12`, `py-1 px-4`) và số 0 được làm mờ (`text-muted-foreground/40 italic`). Chưa xong: yêu cầu "một **học sinh** một hàng" với cột **Số bài / Cần chấm / Tự thu / Điểm TB**; hiện `SubmissionList` vẫn là **một bài nộp một hàng** (cột: Học sinh, Trạng thái, Nộp lúc, Trắc nghiệm, Tự luận, Tổng, Thao tác). Và card `TutorStudentCard.tsx` vẫn còn 3-4 ô đếm to (dòng 79-102) với cỡ chữ `text-[9px]` |
| FB-08 | P1 | UI | G | Chữ phụ 9-11px, xám nhạt, tương phản yếu | Cỡ chữ tối thiểu 12-13px; tương phản chữ/nền tối thiểu 4.5:1 (WCAG AA) cho cả light và dark mode | ⬜ Chưa làm — còn rất nhiều cỡ chữ dưới ngưỡng: `TutorStudentCard.tsx` (`text-[9px]` ×4, `text-[10px]` ×5, `text-[11px]`), `StudentDetailView.tsx` (`text-[7px]`, `text-[10px]`), `SubmissionList.tsx` (`text-[10px]` ×5), `GradingView.tsx` (`text-[8px]`) |
| FB-09 | P1 | UI | G, S1 | Ngôn ngữ lẫn lộn: "Pending / Submitted / Graded" và "CHỜ LÀM / ĐANG LÀM / ĐÃ CHẤM" cho cùng khái niệm | Thống nhất một bộ nhãn tiếng Việt, dùng chung một bảng map trạng thái ở mọi màn hình | ✅ Xong (18/10/2026) — `constants/submissionStatus.ts` là nguồn duy nhất (`getSubmissionStatusPresentation`, `getSubmissionStatusLabel`) với nhãn "Chờ làm / Đang làm / Đã nộp / Tự thu / Đã chấm", đã dùng ở `SubmissionList.tsx` và `GradingView.tsx`. Đã Việt hoá nốt trong `SubmissionList.tsx`: tiêu đề dòng 81 → **"Bài nộp của học sinh"**; header dòng 102-105 → **"Trắc nghiệm / Tự luận / Tổng / Thao tác"**; toast dòng 43-44 → **"Lỗi" / "Không thể tải danh sách bài nộp"**. Không còn chuỗi tiếng Anh hiển thị ở 3 file S1/S2/S3 |
| FB-10 | P1 | UI | S1, S2 | Thanh tiến độ đen đặc, dày, không có màu ngữ nghĩa | Thanh mảnh hơn, có track nền rõ; màu theo ngữ nghĩa: xanh (ổn), vàng (cần chú ý), đỏ (nhiều bài tự thu/điểm thấp) | ⬜ Chưa làm — đã định vị được: `TutorStudentCard.tsx:76` `<Progress value={completionPercentage} className="h-1.5" />` (S1) và `StudentDetailView.tsx:274-292` `ProgressRing` vẽ bằng SVG `text-primary` (S2). Cả hai đang dùng **một màu duy nhất**, chưa có nhánh xanh/vàng/đỏ theo ngữ nghĩa, chưa có track nền rõ. Lưu ý: **không** có thanh tiến độ nào trong `features/submission` — trước đây bảng ghi S1/S2 là đúng, nhưng file nằm ở `features/exercises` |
| FB-11 | P2 | UI | S1 | "Lớp: N/A" lặp ở mọi học sinh | Ẩn khi không có dữ liệu, hoặc hiển thị nút "Gán lớp" ngay tại chỗ | ⬜ Chưa làm — (18/10/2026) đã bỏ chuỗi tiếng Anh `'N/A'` thành `'—'` ở `TutorStudentCard.tsx:42` và `StudentDetailView.tsx:241`, nhưng yêu cầu chính (**ẩn badge khi không có dữ liệu** hoặc **nút "Gán lớp"** tại chỗ) vẫn chưa làm |
| FB-12 | P2 | UI | S3 | Footer cố định "Hủy bỏ / Lưu điểm" nền mờ, nội dung lộ xuyên qua | Nền đặc (theo theme) có viền trên hoặc bóng nhẹ; thêm padding đáy cho danh sách để không bị che | ⬜ Chưa làm — cần kiểm tra `GradingView.tsx` có footer `sticky`/`fixed` hay không |
| FB-13 | P2 | UI | G | Nút chat nổi đè lên badge và nội dung góc phải dưới | Dời vị trí hoặc thêm vùng đệm; không che các thành phần tương tác | ⬜ Chưa làm — thuộc layout toàn cục, không nằm trong `features/submission` |
| FB-14 | P2 | UI/UX | G | Sidebar chỉ icon, ba icon "tài liệu" gần giống nhau, không nhãn | Thêm tooltip rõ hoặc nhãn khi mở rộng; đổi icon cho khác biệt rõ; đánh dấu mục đang chọn | ⬜ Chưa làm — thuộc layout toàn cục |
| FB-15 | P2 | UI | S1, S2 | Tab "Theo học sinh / Thư viện bài tập" nhỏ, mờ, lệch góc | Dùng segmented control rõ ràng, cỡ chữ lớn hơn, trạng thái active nổi bật, đặt đúng vị trí điều hướng chính | ⬜ Chưa làm — phần tiếng Anh trong `SubmissionList.tsx` đã Việt hoá xong (18/10/2026, xem FB-09); còn lại là thiết kế segmented control rõ ràng cho 2 tab "Theo học sinh / Thư viện bài tập" |
| FB-16 | P2 | UI | S2 | Hero card quá to, avatar lớn, bóng đổ nặng, hình trang trí mờ vô nghĩa | Thu nhỏ chiều cao, avatar vừa phải, bỏ hình trang trí; gom số liệu thành các chỉ số rõ ràng | ⬜ Chưa làm — hero card nằm ở `features/exercises` / `features/students`, không có trong `features/submission` |
| FB-17 | P2 | UI/UX | S2 | Ba cột kanban để trống hai cột, empty state gần như vô hình | Ẩn hoặc thu gọn cột rỗng; tăng tương phản empty state; cột có dữ liệu chiếm phần rộng | ⬜ Chưa làm |
| FB-18 | P2 | UI | S2 | Tiêu đề bài tập xuống dòng lộn xộn, "Hạn" và "phút" nhồi trong pill nhỏ | Tiêu đề tối đa 2 dòng có cắt (ellipsis) kèm tooltip; meta (hạn, thời lượng) tách hàng riêng, cỡ chữ đủ đọc | ⬜ Chưa làm |
| FB-19 | P2 | UI/UX | S3 | Điểm tổng "0/100" và ô MCQ/TỰ LUẬN chữ tí hon, không rõ chỗ nhập điểm | Header điểm to và rõ; ô nhập điểm tự luận nổi bật, kiểm tra giá trị tối đa theo điểm câu hỏi | ⬜ Chưa làm — `GradingView.tsx` đã có header 3 ô điểm (MCQ / Tự luận / Tổng) nhưng cỡ chữ vẫn nhỏ (`text-[8px]`, `text-xs`) và chưa có kiểm tra giá trị tối đa |
| FB-20 | P2 | UI/UX | S3 | Không phân biệt thị giác câu đúng/sai, mỗi câu một card \~250px | Trắc nghiệm tự chấm hiển thị lưới tóm tắt đúng/sai (xanh/đỏ/xám); chỉ mở chi tiết câu sai hoặc tự luận; thêm điều hướng nhảy câu | ⬜ Chưa làm — chưa có lưới đúng/sai; chỉ có `QuestionNav` ở màn học sinh |
| FB-21 | P3 | UI | S1 | Ba ô Pending/Submitted/Graded to nhưng nghèo thông tin | Thay bằng badge nhỏ trong hàng, hoặc chỉ hiện ô có giá trị > 0 | ✅ Xong — `SubmissionList.tsx` dùng `Badge` nhỏ (`h-5 text-[10px]`) trong cột Trạng thái; ba ô đếm to không còn |
| FB-22 | P3 | UI | G | Hệ màu gần như đơn sắc, màu pastel không dùng nhất quán | Định nghĩa token màu trạng thái (chờ, đang làm, tự thu, cần chấm tay, đã chấm) dùng chung cho badge, thanh tiến độ, điểm, icon | 🟡 Một phần (cập nhật 18/10/2026) — `submissionStatus.ts` đã có `token: 'pending' \| 'inProgress' \| 'submitted' \| 'autoSubmitted' \| 'graded'` kèm `badgeClassName` + `textClassName` (badge đã dùng), **và đã bổ sung 3 token mới** `progressClassName` / `scoreClassName` / `iconName` cho cả 5 trạng thái + `FALLBACK_PRESENTATION`, kèm helper `getScoreBand` / `getScorePresentation` (≥80 xanh emerald, 50-79 vàng amber, <50 đỏ, điểm 0 và bài tự thu luôn đỏ; có 7 unit test). **Còn lại:** áp các token này vào thanh tiến độ (FB-10), điểm (FB-05/FB-19) và icon — hiện mới dừng ở khâu định nghĩa |

### Gợi ý thứ tự triển khai

1. P0 trước (FB-01 đến FB-04): đổi mô hình trạng thái và trang chấm bài, vì các mục sau phụ thuộc vào đây.
2. P1: danh sách học sinh dạng bảng gọn có lọc, cỡ chữ, nhãn, màu ngữ nghĩa.
3. P2 và P3: dọn dẹp giao diện và nhất quán thiết kế.

## Tình hình thực tế (cập nhật 18/10/2026)

Trạng thái dưới đây đã **đối chiếu lại trực tiếp với code** (đọc file, không suy đoán từ tên file). Cột "Trạng thái" ở bảng trên ghi kèm số dòng để đối chiếu.

| Nhóm | Task | Trạng thái |
| --- | --- | --- |
| ✅ Xong hẳn | FB-01, FB-02, FB-03, FB-04, FB-09, FB-21 | 6/22 — đã kiểm chứng trong code |
| 🟡 Dở dang | FB-05, FB-07, FB-22 | 3/22 — đã làm phần chính nhưng còn hạng mục con chưa đạt tiêu chí |
| ⬜ Chưa làm | FB-06, FB-08, FB-10, FB-11 → FB-20 | 13/22 |

Chi tiết phần đã kiểm chứng:

- **FB-01** ✅ `SubmissionStatus.AUTO_SUBMITTED` có thật trong `SubmissionStatus.java`; nhãn "Tự thu" + màu đỏ ở `submissionStatus.ts:47-55`; badge dùng ở `SubmissionList.tsx:122-128` và `GradingView.tsx:224-227`.
- **FB-02** ✅ (mới, 18/10/2026) Mẫu số đã loại bài tự thu/miễn ở `TutorStudentCard.tsx:21-27` và `StudentDetailView.tsx:219-222`; nhãn đã đổi ở `TutorStudentCard.tsx:73` ("Tỷ lệ đã làm") và `StudentDetailView.tsx:290` ("Đã làm").
- **FB-03** ✅ `GradingView.tsx:127` gọi `isBlankAutoCollected`; `SubmissionList.tsx:135-136` hiện "Không cần chấm" cho bài tự thu trắng.
- **FB-04** ✅ 4 endpoint trong `SubmissionController`; UI `SubmissionExceptionActions.tsx`; logic `submissionTeacherActions.ts` (22 test pass).
- **FB-09** ✅ (mới, 18/10/2026) Toàn bộ nhãn lấy từ `submissionStatus.ts`; `SubmissionList.tsx` đã Việt hoá tiêu đề (dòng 81), 4 header cột (dòng 102-105) và toast lỗi (dòng 43-44) — không còn chuỗi tiếng Anh hiển thị ở S1/S2/S3.
- **FB-21** ✅ `SubmissionList.tsx:122-128` dùng `Badge` `h-5 text-[10px]`, không còn ba ô đếm to ở màn chấm bài.

**Kết luận: 6/22 xong hẳn, 3/22 dở dang, 13/22 chưa làm.**

**Việc cần phân tích tiếp (đã thu hẹp, có vị trí file cụ thể):**

1. **FB-10 phải sửa ở `features/exercises`, không phải `features/submission`.** Hai chỗ cần sửa: `TutorStudentCard.tsx:76` (`<Progress className="h-1.5">`, màu mặc định `bg-primary`) và `StudentDetailView.tsx:274-292` (`ProgressRing` SVG `text-primary`). Cả hai chưa có nhánh xanh/vàng/đỏ theo ngữ nghĩa và chưa có track nền rõ.
2. **Nên gộp FB-05 + FB-10 + FB-22 làm một đợt** vì cùng phụ thuộc bảng token màu. (18/10/2026) Phần **bổ sung token đã xong**: `progressClassName` / `scoreClassName` / `iconName` có mặt ở cả 5 trạng thái + fallback. Việc còn lại của cả ba mục chỉ là **đọc ra dùng** ở `TutorStudentCard.tsx:76`, `StudentDetailView.tsx:274-292` và `GradingView.tsx`.
3. ~~**FB-02 và FB-09 gần xong, chỉ còn phần nhãn chữ.**~~ → **đã đóng cả hai (18/10/2026)**, xem "Nhật ký cập nhật" ở cuối file.
4. **FB-06 cần chốt kiến trúc trước khi code**: lọc/tìm/sắp xếp phía client (giữ nguyên `submissionService.listByExercise` + state hiện tại) hay bổ sung tham số query phía backend. Danh sách hiện tải toàn bộ một lần nên lọc client là đường ngắn nhất.
5. **FB-08 là thay đổi diện rộng**, ảnh hưởng ít nhất `TutorStudentCard.tsx`, `StudentDetailView.tsx`, `SubmissionList.tsx`, `GradingView.tsx` với cỡ chữ `text-[7px]` → `text-[11px]`. Nên sửa cùng lúc với FB-10/FB-19 ở các file đó để tránh phải mở lại file hai lần.
6. **FB-12, FB-13, FB-14, FB-16, FB-17 nằm ngoài `features/submission`** (footer sticky, nút chat nổi, sidebar, hero card, kanban). Cần quyết định gộp vào đợt này hay chuyển sang `ISSUES.md` của feature tương ứng — nếu để chung file này thì không thể kiểm chứng "xong" chỉ bằng `features/submission`.

## Nhật ký cập nhật

### 18/10/2026 — nhánh `optimization-submission` (chưa merge vào `main`)

Đóng thêm 2 mục và đẩy 1 mục gần xong:

**✅ FB-02 — nhãn đo đúng nghĩa**
- `TutorStudentCard.tsx:73`: "Tiến độ hoàn thành" → "Tỷ lệ đã làm".
- `StudentDetailView.tsx:290`: "Đã học" → "Đã làm".

**✅ FB-09 — hết nhãn tiếng Anh**
- `SubmissionList.tsx:81`: "Student Submissions" → "Bài nộp của học sinh".
- `SubmissionList.tsx:102-105`: "MCQ / Essay / Total / Actions" → "Trắc nghiệm / Tự luận / Tổng / Thao tác".
- `SubmissionList.tsx:43-44`: toast "Error" / "Failed to load submissions" → "Lỗi" / "Không thể tải danh sách bài nộp".

**🟡 FB-22 — đã có đủ token màu, chưa áp dụng**
- `constants/submissionStatus.ts`: `SubmissionStatusPresentation` thêm `progressClassName`, `scoreClassName`, `iconName`, áp cho cả 5 trạng thái + `FALLBACK_PRESENTATION`.
- Thêm `SCORE_PRESENTATION` + `getScoreBand` + `getScorePresentation`: ≥80 emerald (xanh), 50-79 amber (vàng), <50 red (đỏ); điểm 0, điểm không hợp lệ và bài tự thu luôn đỏ.
- Còn lại: đọc token ở `TutorStudentCard.tsx:76` / `StudentDetailView.tsx:274-292` (FB-10) và ở phần điểm/icon của `GradingView.tsx` (FB-05, FB-19).

**⬜ FB-11 — mới bỏ chuỗi tiếng Anh**
- `TutorStudentCard.tsx:42`, `StudentDetailView.tsx:241`: `'N/A'` → `'—'`. Việc ẩn badge hoặc thêm nút "Gán lớp" vẫn còn nguyên.

**Kiểm thử tại thời điểm cập nhật:** `npx tsc --noEmit` → EXIT=0 · `npx eslint` → 0 error, 1 warning có sẵn (`'err' unused` ở `SubmissionList.tsx:42`) · `npx vitest run` → 41 file / 260 test pass.
