# Task 02: Chỉnh lại kích thước nội dung và đặt khung video ở hero

Dành cho AI triển khai code. Đọc hết trước khi bắt đầu. Task này **chỉ chỉnh bố cục và kích thước nội dung của landing `/`**, kèm thay phần minh họa động ở hero bằng khung chờ video.

## 1. Vấn đề hiện tại

Nhìn màn hình thực tế (viewport khoảng 1920×950):
- Nội dung quá nhỏ so với màn hình: container chỉ 1120px nên hai bên trống rất nhiều.
- Hero quá cao: chữ H1 bắt đầu cách đỉnh khoảng 300px, nửa trên và nửa dưới hero đều trống.
- H1 chỉ khoảng 48px, mô tả và nút sát nhau, trong khi các khoảng trống lớn thì bỏ không.
- Phần minh họa bên phải (mascot trong khối cam + hai thẻ nổi + nghiêng 3D) nhìn không đạt. Cần thay bằng một **khung video lớn** để chủ dự án đặt video quay màn hình sau này.
- Các section bên dưới (giới thiệu luồng, 5 bước) cũng có khoảng trống quá lớn giữa các phần.

## 2. Hướng tham chiếu

Bố cục hero của landing Fibery: chữ lớn ở cột trái (khoảng 40% chiều rộng), **khung video lớn ở cột phải (khoảng 60%)**, hero ôm sát nội dung, không có khoảng trống thừa. Chỉ học bố cục và tỉ lệ, không sao chép hình hay chữ.

## 3. Phạm vi

### Làm
1. Tăng độ rộng container và nới thang chữ cho landing.
2. Làm hero ôm sát nội dung, bố cục 2 cột chữ trái, video phải.
3. Thay phần minh họa mascot bằng component khung video (`HeroVideo`) có sẵn chỗ chờ.
4. Giảm khoảng trống thừa ở FlowIntro, luồng 5 bước và CTA.

### Không làm
- Không đổi nội dung chữ (H1, mô tả, nhãn nút, 5 bước, CTA, footer).
- Không đổi màu, font, token, nền lưới (đã làm ở task 01).
- Không làm navbar nổi tách đôi, mega menu, footer mới.
- Không đụng `/features`, `/pricing` hay trang nào khác.
- Không xóa file `Mascot.tsx` và CSS của mascot (sẽ dùng lại ở phần khác). Chỉ ngừng dùng trong hero.
- Không refactor tách file lớn.
- Không thêm thư viện.

## 4. Đặc tả

Các con số dưới đây là **mục tiêu**. Đo bằng DevTools ở viewport 1920×950, điều chỉnh nếu cần nhưng giữ đúng tinh thần: nội dung lớn hơn, ôm sát hơn, video là tâm điểm.

### 4.1 Container
- `.landing-container`: `max-width` từ `1120px` lên **`1280px`**, padding ngang `24px`.
- Navbar dùng cùng container nên tự rộng theo. Chỉ đổi giá trị này, không đổi cấu trúc navbar.

### 4.2 Hero
| Thuộc tính | Mục tiêu |
|---|---|
| Chiều cao hero | Theo nội dung. **Bỏ** `min-height` lớn và căn giữa dọc kiểu chiếm cả màn hình |
| Padding hero | trên `56px`, dưới `72px` |
| Lưới 2 cột | `minmax(0, 5fr) minmax(0, 7fr)`, khoảng cách `48px`, căn giữa theo chiều dọc |
| H1 | `font-size: clamp(44px, 5.2vw, 72px)`, `line-height: 1.08`, trọng lượng 800 |
| Mô tả | `22px`, `max-width: 28em`, cách H1 `24px` |
| Khoảng cách mô tả đến nút | `32px` (hiện đang gần như sát nhau) |
| Nút | padding `14px 28px`, khoảng cách giữa hai nút `14px` |

Kết quả cần thấy ở 1920×950: **toàn bộ khung video nằm trong màn hình đầu tiên** mà không cần cuộn, H1 bắt đầu cách dưới navbar không quá khoảng 80px.

### 4.3 Khung video `HeroVideo`
Tạo component mới (có thể đặt cùng file `LandingPageContent.tsx` vì task này không refactor tách file). Cần là client component vì có nút tạm dừng.

**Props:** `src?: string`, `poster?: string`. Khai báo một hằng số dễ thấy ở đầu file để chủ dự án điền sau:

```ts
const HERO_VIDEO = { src: '', poster: '' }; // điền đường dẫn video và ảnh poster vào đây
```

**Khung ngoài:**
- `width: 100%`, `aspect-ratio: 16 / 9`, `border-radius: 24px`, `overflow: hidden`.
- Viền `1px solid var(--line)`, nền `var(--tile)`, bóng nhẹ (dùng bóng của card sẵn có trong landing).
- Không dùng chiều cao cố định bằng px, để khung co theo chiều rộng.

**Khi có `src`:**
- Thẻ `<video>` với `autoPlay muted loop playsInline preload="metadata"`, `poster={poster}`, `object-fit: cover`, phủ kín khung.
- Có nút Tạm dừng / Phát ở góc dưới phải, `aria-label` tiếng Việt ("Tạm dừng video", "Phát video"), có `:focus-visible`.
- Khi người dùng bật `prefers-reduced-motion: reduce`: **không tự phát**, chỉ hiện ảnh poster và nút Phát.
- Không để video làm lệch bố cục khi đang tải (khung đã giữ chỗ bằng `aspect-ratio`).

**Khi chưa có `src` (trạng thái chờ, là trạng thái mặc định lúc làm task này):**
- Hiện khung giữ chỗ trung tính trông như cửa sổ ứng dụng: thanh trên cùng có 3 chấm tròn nhỏ, phía dưới là vài khối xám mờ (skeleton) dạng thanh bên và vùng nội dung. Dùng màu từ token sẵn có, không dùng màu cứng.
- Ở giữa hoặc góc có dòng chữ nhỏ "Video giới thiệu sẽ đặt ở đây" để chủ dự án nhận ra chỗ cần điền.
- `aria-hidden="true"` cho phần giữ chỗ trang trí.

### 4.4 Loại bỏ trong hero
Xóa khỏi hero: khối mascot trong ô cam, hai thẻ nổi ("Hôm nay 19:00", "Đã thu học phí"), và toàn bộ logic nghiêng 3D theo chuột (`sceneRef`, `rigRef`, `useEffect` mouse-move). Xóa CSS chỉ phục vụ phần này (`.lp-hero-3d`, `.lp-hero-rig`, `.lp-float-card*`) **nếu không còn nơi nào dùng**. Giữ import và CSS của `Mascot` vì file vẫn tồn tại.

### 4.5 Section phía dưới
Mục tiêu là bỏ khoảng trống thừa. Đo và chỉnh các giá trị sau:

| Vị trí | Mục tiêu |
|---|---|
| FlowIntro (tiêu đề + 5 chip) | padding trên và dưới mỗi bên `72px` đến `88px` |
| Khoảng cách từ hàng chip đến nội dung bước 1 | không quá khoảng `64px` (hiện có khoảng trống hơn 400px) |
| Mỗi hàng bước (`.lp-row`) | **bỏ `min-height` cố định**; chiều cao theo nội dung; khoảng cách giữa hai bước `56px` |
| H2 | `clamp(32px, 4vw, 48px)` |
| H3 trong từng bước | `clamp(28px, 3vw, 40px)` |
| Chữ mô tả và gạch đầu dòng | `18px` |
| Hình minh họa mỗi bước | `width: 100%` của cột, không nhỏ lại |
| Khối CTA cuối | padding `56px 24px`, khoảng cách tới footer không quá `88px` |

Nguyên nhân khoảng trống lớn ở phần bước hiện chưa rõ (nghi ngờ do `min-height` kết hợp căn chỉnh dọc, hoặc margin trên đường dọc). **Tìm nguyên nhân thật trong DevTools trước khi sửa**, ghi lại trong báo cáo.

### 4.6 Responsive
- Từ `860px` trở xuống: hero về 1 cột, chữ trên, khung video dưới, video vẫn full chiều rộng và giữ tỉ lệ 16:9.
- Giảm padding hero xuống `40px` trên, `48px` dưới.
- Không xuất hiện thanh cuộn ngang ở bất kỳ độ rộng nào từ 360px trở lên.

## 5. Tiêu chí hoàn thành

- [ ] Container 1280px, nội dung lấp đầy màn hình hợp lý ở 1920×950, không còn hai dải trống lớn hai bên.
- [ ] Hero không còn khoảng trống thừa phía trên và dưới. H1 từ 60px trở lên ở màn hình rộng.
- [ ] Khung video 16:9 nằm hoàn toàn trong màn hình đầu tiên ở 1920×950.
- [ ] Khung chờ hiện đúng khi `HERO_VIDEO.src` rỗng. Điền thử một video mp4 bất kỳ thì video tự phát, lặp, tắt tiếng, có nút Tạm dừng hoạt động bằng chuột và bàn phím.
- [ ] Bật `prefers-reduced-motion` thì video không tự phát.
- [ ] Mascot, thẻ nổi, hiệu ứng nghiêng 3D đã khỏi hero. `Mascot.tsx` vẫn còn.
- [ ] Khoảng trống giữa các section và giữa chip với bước 1 đạt mục tiêu mục 4.5.
- [ ] Cả chế độ sáng và tối đều đúng, lưới nền vẫn hiện ở hero và CTA.
- [ ] Mobile 360px, 390px, 768px không cuộn ngang, bố cục xếp 1 cột đúng.
- [ ] Nội dung chữ không đổi. Lint và build không có cảnh báo mới.

## 6. Cách kiểm tra
1. Mở `/` ở 1920×950, chụp ảnh màn hình đầu tiên, so với mục tiêu mục 4.2.
2. Cuộn từ FlowIntro tới footer, đo các khoảng trống theo mục 4.5.
3. Điền `HERO_VIDEO.src` bằng một file mp4 thử, kiểm tra phát và tạm dừng. Xóa lại về rỗng sau khi thử.
4. DevTools, Rendering, bật giả lập `prefers-reduced-motion`.
5. Thu hẹp xuống 360px kiểm tra cuộn ngang.
6. Chạy lint và build.

## 7. Khi xong
Báo lại:
- File đã sửa.
- Nguyên nhân thật của khoảng trống lớn ở phần 5 bước.
- Chỗ nào không đạt đúng con số mục tiêu và lý do.
- Chụp ảnh hero ở 1920×950 và 390×844, ở cả sáng và tối.

---

## Ghi chú cho người làm video (không thuộc task code)

- Tỉ lệ **16:9**, đề xuất 1280×720.
- Định dạng mp4 (H.264), **không tiếng**, dài 6 đến 10 giây, lặp liền mạch.
- Dung lượng mục tiêu dưới khoảng 1,5 MB.
- Quay màn hình app thật bằng **dữ liệu giả** (tên học sinh, học phí mẫu).
- Kèm một ảnh poster (khung hình đẹp nhất) để hiện khi chưa tải xong.