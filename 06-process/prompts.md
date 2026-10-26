# Bộ prompt làm brand cho chính bạn bằng Agent

8 prompt này là những prompt chính mình đã dùng để làm bộ nhận diện Nghé cho group Đi làm với AI, viết lại thành dạng điền chỗ trống. Thay phần trong `[...]` bằng thông tin của bạn rồi dán vào Claude Code (hoặc Agent tương tự có đọc/ghi file và chạy lệnh).

Cách dùng cho đỡ tốn công:
- Chạy lần lượt từ 1 đến 8. Kết quả bước trước là đầu vào của bước sau.
- Bạn không cần biết vẽ. Việc của bạn là trả lời câu hỏi, chọn và chê. Chê cụ thể ("mõm to giống bò sữa") có ích hơn chê chung ("chưa đẹp").
- Mỗi bước nên giao cho một subagent mới, rồi nhờ một subagent khác review. Xem prompt 0 bên dưới.

## Prompt 0 (đặt một lần): quy tắc làm việc

```
Làm theo kiểu subagent-driven development. Chia việc thành các task nhỏ. Mỗi task giao cho một
subagent mới, chỉ đưa phần brief của task đó. Xong task, gọi một subagent review độc lập
(không phải subagent đã làm) để bắt lỗi trước khi sang task tiếp. Các bước tôi phải duyệt:
[chọn logo / chốt mascot / duyệt cuối]. Tới đó thì dừng và hỏi tôi, đừng tự quyết.
Tất cả ảnh vẽ bằng code (SVG), không dùng ảnh AI raster cho bản chính.
```

**Mẹo:** reviewer không được thấy lý lẽ của người làm, nên mới bắt được lỗi mà người làm đã quen mắt.

---

## Prompt 1. Research đề bài

```
Đọc [link/file thể lệ] và trang [link cộng đồng của bạn]. Cho tôi:
1. Danh sách hạng mục bắt buộc, điều kiện bị loại, hạn nộp.
2. Cộng đồng này nói chuyện kiểu gì, hay dùng từ gì, đang thiếu gì về hình ảnh.
3. Ràng buộc kỹ thuật cần biết trước: định dạng file, font phải có dấu tiếng Việt và miễn phí
   thương mại, [spec design system nếu có, ví dụ DESIGN.md].
Ghi vào RESEARCH.md, mỗi ý kèm nguồn. Chỗ nào không chắc thì ghi "chưa xác minh".
```

**Mẹo:** bắt Agent ghi nguồn và đánh dấu "chưa xác minh", để về sau biết chỗ nào dựa vào được.

## Prompt 2. Chốt concept qua phỏng vấn

```
Tôi muốn làm bộ nhận diện cho [tên cộng đồng], mục tiêu [thắng giải / được dùng chính thức / ...].
Hãy phỏng vấn tôi, mỗi lượt 3-4 câu trắc nghiệm gom theo nhóm (mục tiêu, concept, nhân vật,
giọng điệu, màu). Mỗi câu có đủ ngữ cảnh và một lựa chọn bạn đề xuất kèm lý do. Đừng hỏi
từng câu một. Khi đủ thông tin, viết đề bài thành 6 mục: mục tiêu, hiện trạng, vấn đề,
mong muốn, ràng buộc, KHÔNG đưa giải pháp. Lưu vào docs/briefs/.
Sau đó gọi một subagent "đọc lạnh" chỉ có file brief, bắt nó liệt kê chỗ còn thiếu hoặc mâu thuẫn.
Sửa brief và gọi lại cho tới khi nó trả "NO GAPS".
```

**Mẹo:** phỏng vấn theo nhóm câu trắc nghiệm nhanh hơn nhiều so với hỏi đáp tự do, và vòng "đọc lạnh" lôi ra những điều bạn tưởng đã nói rõ.

## Prompt 3. Phác 3 hướng logo

```
Phác 3 hướng logo thật sự khác nhau cho [tên cộng đồng] theo concept [concept đã chốt],
vẽ bằng SVG code. Hướng A: [ý tưởng 1]. Hướng B: [ý tưởng 2]. Hướng C: [ý tưởng 3].
Màu: [HEX chính, HEX phụ]. Xuất một bảng so sánh gồm cả 3 hướng ở cỡ 96px, 48px, 32px,
dạng avatar tròn, và trên nền tối. Sau đó tự phê bình từng hướng: chỗ nào mất chi tiết ở 32px,
chỗ nào giống logo có sẵn. Chưa chọn hộ tôi.
```

**Mẹo:** luôn so ở 32px; logo đẹp ở 512px mà thành vệt mờ ở 32px thì không dùng được làm avatar.

## Prompt 4. Bộ logo hoàn chỉnh

```
Tôi chọn hướng [A/B/C], chỉnh theo góp ý: [góp ý của bạn]. Làm bộ logo đầy đủ:
ngang, dọc, 1 màu nâu, 1 màu trắng, nền tối, icon vuông. Với mỗi bản xuất SVG và PNG nền trong suốt.
Chữ trong logo phải chuyển thành path (dùng opentype.js với file font thật trong assets/fonts)
để SVG mở ở đâu cũng không lỗi font. Viết test kiểm: file nào cũng có đủ cả SVG lẫn PNG,
PNG có kênh alpha, và tương phản chữ/nền đạt 4.5:1.
```

**Mẹo:** bắt Agent chuyển chữ thành path để SVG không lỗi font, và viết test cho tương phản thay vì đoán bằng mắt.

## Prompt 5. Mascot + character sheet

```
Thiết kế mascot cho [tên cộng đồng]: [con vật/nhân vật], tên [tên], tính cách [2-3 từ].
Danh sách đặc điểm khoá (không được đổi giữa các tư thế): [dáng đầu, màu thân, màu mõm,
sừng/tai, phụ kiện đặc trưng như thẻ nhân viên, câu cửa miệng].
Vẽ bằng SVG code, tách thành bộ phận (đầu, thân, tay, chân, phụ kiện) để ghép tư thế sau.
Xuất character sheet: dáng chính, cỡ 128px, bảng màu, 3 biểu cảm.
Trước khi đưa tôi xem, tìm 5 nhân vật gần nhất ([con vật] + linh vật + tranh dân gian) và so
4 đặc điểm: dáng, màu, đạo cụ, tên. Trùng từ 2 đặc điểm thì sửa thiết kế. Ghi bảng so sánh,
nêu rõ nguồn nào bạn không xem được hình.
```

**Mẹo:** chốt "danh sách đặc điểm khoá" ngay từ đầu; khi bạn chê ("mõm giống bò sữa") Agent sửa đúng chỗ mà không làm đổi cả nhân vật.

## Prompt 6. Bộ sticker nhiều tư thế

```
Dùng bộ phận của [tên mascot] làm 6 tư thế sticker: [liệt kê: đang làm việc, uống cà phê,
chào người mới, ...]. Mỗi tư thế: SVG + PNG nền trong suốt, cùng một nhân vật và cùng đặc điểm
khoá. Với mỗi tư thế viết style test: render ra pixel và so với dáng gốc để chắc chắn thẻ tên
không bị đạo cụ, tay hay chân che mất. Làm thêm một tấm tổng hợp 6 sticker. Rồi gọi
subagent review xem từng ảnh ở cỡ nhỏ và liệt kê tư thế nào khó đọc.
```

**Mẹo:** test pixel cho "thẻ tên còn nhìn thấy không" bắt được lỗi mà mắt người làm bỏ sót, vì đạo cụ nào cũng có thể vô tình đè lên thẻ.

## Prompt 7. DESIGN.md + lint

```
Viết DESIGN.md cho [tên cộng đồng] theo spec @google/design.md: YAML front matter (name, colors,
typography, rounded, spacing, components) và các mục ## đúng thứ tự: Overview, Colors,
Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.
Lấy giá trị từ src/tokens.mjs, không gõ lại bằng tay. Phần quy tắc logo ghi rõ: vùng
an toàn, cỡ tối thiểu, bản nào dùng trên nền nào, điều cấm. Chạy
`npx -y -p @google/design.md designmd lint DESIGN.md`, sửa đến khi hết lỗi (cảnh báo thì giải thích),
lưu kết quả vào 06-process/designmd-lint.txt.
```

**Mẹo:** lint 0 lỗi (4 cảnh báo orphaned-tokens đã chấp nhận) là bằng chứng rằng một Agent khác đọc DESIGN.md của bạn cũng hiểu đúng; lưu kết quả lint lại để đưa vào ảnh chụp quá trình.

## Prompt 8. Brand board + một lệnh build

```
Dựng brand board cho [tên cộng đồng] từ file thật trong repo (không vẽ lại): logo ngang/dọc,
mascot, bảng màu có HEX, 2 font kèm mẫu chữ, slogan, 3 câu mẫu brand voice. Thêm 4 mockup:
[thẻ nhân viên, ly cà phê, slide, ảnh bìa nhóm] và một poster. Khổ ảnh đọc được trên điện thoại.
Sau cùng viết src/build.mjs để một lệnh `npm run build` dựng lại toàn bộ SVG và PNG. Chạy thử trong thư mục
sạch (git clone sang thư mục tạm, npm install, npm test, npm run build) và báo
git status có file nào thừa hoặc thiếu không.
```

**Mẹo:** chạy thử trong thư mục sạch là cách duy nhất biết repo của bạn có tái tạo được không, chứ máy bạn thì luôn "chạy được".

---

## Trước khi nộp

- Gọi một subagent "giám khảo khó tính": đưa cho nó thể lệ và repo, bắt nó tìm mọi lý do có thể bị loại (thiếu hạng mục, link chết, trùng nhân vật, sai điều kiện font).
- Tự chụp ảnh màn hình ở những bước chính (3 hướng logo, character sheet, kết quả lint, brand board) để làm bằng chứng quá trình.
