# Review giám khảo — vòng 1

Ngày 26/10/2026. Đã đọc: RESEARCH.md (mục 1), README, DESIGN.md, 01-logo → 06-process, brief, `src/check_submission.py`, git log. Đã xem: brand board, poster phẳng, 4 mockup, `preview-all.png`, character sheet, stickers sheet. Đã chạy: `python -I src/check_submission.py` (exit 1, chỉ vì thiếu ảnh quá trình), kiểm alpha PNG, parse toàn bộ SVG, chạy lại `designmd lint` (0 lỗi, 4 cảnh báo, khớp `designmd-lint.txt`).

Kết quả tổng: **đủ 6 hạng mục**, logo + mascot PNG trong suốt thật (góc alpha = 0), SVG mở được, chữ đã thành path, font đúng điều kiện về mặt chọn font, không lộ khoá API. Lỗi còn lại chủ yếu là **việc chưa làm trước khi đăng**, không phải lỗi thiết kế.

---

## (A) Lỗi luật có thể khiến bài bị loại

Xếp theo mức độ: CHẶN = chưa sửa thì không nên đăng; RỦI RO = có thể bị BTC/người khác bắt bẻ.

| # | Mức | File | Lý do | Cách sửa |
|---|---|---|---|---|
| A1 | CHẶN (đang chờ) | `06-process/screenshots/` (trống) | Thể lệ bắt buộc ≥ 2 ảnh quá trình; `check_submission.py` đang exit 1. | Người dự thi thêm 4 ảnh theo bảng trong PROCESS.md, chạy lại `python -I src/check_submission.py` tới khi in `OK`. Lưu ý: ảnh `01-logo-3-huong.png` phải chụp từ `explore/logo-compare.png`, mà `explore/*.png` bị `.gitignore` nên bản gốc không có trên repo. |
| A2 | CHẶN | Cả 4 ảnh quá trình dự kiến | Cả 4 ảnh đều là **sản phẩm** (bảng logo, character sheet, kết quả lint, brand board), không có ảnh nào cho thấy **Agent đang làm**. Thể lệ ghi "ảnh chụp quá trình / prompt chính"; người khác có thể nói "vẽ tay rồi gán cho AI". | Thay ít nhất 2 trong 4 ảnh (hoặc thêm 2 ảnh) bằng ảnh chụp **cửa sổ Claude Code**: (1) lúc gõ prompt phác 3 hướng logo, thấy Agent trả lời; (2) lúc mình góp ý "mõm giống bò sữa" và Agent sửa. Ảnh lint nên chụp cả dòng lệnh trong terminal. |
| A3 | CHẶN | `README.md` dòng 11, toàn repo | Repo chưa có remote (`git remote -v` rỗng), dòng "Bản sao Google Drive: (sẽ cập nhật)" vẫn là chỗ trống. "Link chết lúc chốt" = bị loại. | Tạo repo GitHub public + thư mục Drive, điền link thật vào README; mở thử cả hai bằng cửa sổ ẩn danh, không đăng nhập. Ghi nhắc: không xoá/đổi tên repo, không đổi quyền Drive tới hết 9/11. |
| A4 | CHẶN | (chưa có file) bài đăng theo mẫu | Bài đăng phải có đủ trường bắt buộc: `#BrandNayAiLam - [Tên]`, `Slogan:`, `AI Agent đã dùng:`, `Ý tưởng:` (3–5 câu), `Cách mình làm:` (3–5 câu), `Link file đầy đủ:`. Repo chưa có bản nháp nào; viết vội trên điện thoại dễ thiếu trường hoặc gõ sai slogan (mà slogan không được sửa sau duyệt). | Soạn `06-process/bai-dang.md` đúng thứ tự trường, slogan chép nguyên văn "AI làm việc, mình làm chủ.", phần thêm (câu hỏi kéo comment) để **sau** các trường bắt buộc. |
| A5 | RỦI RO cao | Toàn bộ `01-logo/`, `02-slogan/`, `03-mascot/` sau khi đăng | Sửa logo/slogan/mascot sau duyệt = bị loại. README hướng dẫn `npm run build` dựng lại mọi PNG; chạy lại sau ngày đăng (dù không đổi thiết kế) sẽ tạo commit đổi file PNG/SVG, người khác nhìn lịch sử repo có thể bắt bẻ. | Trước khi đăng: `git tag v1-nop-bai` và đưa link **tới tag** vào bài. Sau khi đăng chỉ commit vào `06-process/` và tài liệu; không chạy build, không đụng 3 thư mục trên. |
| A6 | RỦI RO | `06-process/PROCESS.md` dòng 50–52 | Bảng duyệt còn ghi "Chưa xong tại thời điểm viết (sẽ cập nhật)", "Chưa tới bước này". Đây là bằng chứng người thật duyệt; để trống trông như bài nộp dở. | Điền sau lần duyệt cuối: ngày giờ, câu duyệt của mình, link repo public. |
| A7 | RỦI RO | `assets/fonts/*.ttf` | Repo phát hành lại 5 file TTF nhưng **không kèm `OFL.txt`**. Giấy phép SIL OFL cho dùng thương mại nhưng bắt buộc file font phát hành lại phải đi kèm bản quyền + nội dung giấy phép. Không đủ để bị loại vì chọn font đúng, nhưng là lỗi "điều kiện font" dễ bị soi. | Thêm `assets/fonts/OFL-BricolageGrotesque.txt` và `OFL-BeVietnamPro.txt` (lấy từ repo google/fonts), ghi một dòng trong `04-font/fonts.md`. |
| A8 | RỦI RO thấp | `06-process/PROCESS.md` mục "Kiểm tra trùng nhân vật" | Dòng Trâu Vàng SEA Games 22 tự thừa nhận "không tìm được ảnh"; từ khoá "mascot trâu Tết Tân Sửu 2021" có tìm nhưng không có dòng nào trong bảng. Năm 2021 có rất nhiều linh vật trâu chibi xám/nâu đeo phụ kiện của nhãn hàng VN, đúng loại dễ bị comment "giống con trâu của X". | Bổ sung bảng: ảnh Trâu Vàng (báo Tuổi Trẻ, VnExpress 2003 có ảnh) + 2–3 linh vật trâu Tết 2021 của nhãn hàng/VTV, so 4 đặc điểm như cũ. Chỉ cập nhật bảng, không đổi thiết kế. |
| A9 | RỦI RO thấp | `README.md`, `PROCESS.md` ("lint sạch") | Kết quả lint thật là 0 lỗi nhưng **4 cảnh báo** (token chưa được component dùng). Ghi "lint sạch" có thể bị người đọc kỹ (thầy dạy Claude Code) bắt là nói quá. | Đổi thành "lint 0 lỗi, 4 cảnh báo về token màu mascot, đã giải thích". Hoặc thêm component dùng `text-muted`, `success`… để hết cảnh báo (không đụng logo/mascot). |

Không thấy lỗi ở: thiếu hạng mục (đủ 6/6, có điểm cộng 1 màu + nền tối), file không mở được (SVG parse OK, PNG RGBA), nội dung vi phạm (không có), khoá API (không có trong git), font có dấu Việt + OFL (đúng). Commit có dòng `Co-Authored-By: Claude`, là bằng chứng phụ tốt cho quy trình Agent.

---

## (B) Góp ý thẩm mỹ và khả năng được share/comment

Xếp theo tác động lên điểm (share 3, comment 2, reaction 1). Mỗi ý làm được trong ≤ 1 giờ, và **phải xong trước khi đăng** nếu đụng ảnh có mascot.

1. **Biến comment thành "giao việc cho Nghé" có phần thưởng.** Cuối bài: "Cả nhà muốn giao việc gì đầu tiên cho Nghé? Comment một câu giao việc, Nghé sẽ làm thẻ nhân viên có tên bạn." Câu giao việc tự nhiên dài ≥ 5 chữ (đạt điều kiện comment hợp lệ) và đúng concept. Không ghi "like/share để…" để khỏi bị coi là xin tương tác.
2. **Thẻ nhân viên cá nhân hoá để người khác share ra tường nhà.** Viết script từ `mockup-the-nhan-vien` thay "Nghé / Nhân sự AI / Mã NV: AI-001" bằng tên người comment + "Sếp của Nghé" + "Mã NV: AI-0xx", xuất PNG 1080×1350. Trả lời từng comment bằng ảnh thẻ. Người nhận rất dễ đăng lại thẻ của mình (share 3đ, share từ ngoài group cũng tính). Đây là "đồ chơi" mạnh nhất của bộ này, và vẫn là mockup chứ không sửa mascot.
3. **Ảnh đầu album phải nổi trong feed.** Poster phẳng toàn kem/be, đặt trên nền trắng của Facebook thì chìm, câu "Chào cả nhà, em là Nghé!" lại khá chung chung. Làm thêm bản poster nền cam đất `#B54A17` (như mockup ảnh bìa, contrast đã đạt), câu móc tò mò kiểu "Group mình vừa tuyển nhân sự AI đầu tiên", có thẻ "Mã NV: AI-001". Giữ tỉ lệ 4:5 (1080×1350) để chiếm hết màn hình điện thoại.
4. **Thêm 1 ảnh "hậu trường: người không biết vẽ chỉ việc chê".** Ghép 3 hướng logo A/B/C + Nghé vòng 1 (mõm hồng, giống bò sữa) → bản cuối, chú thích bằng đúng câu mình đã chê. Đây là câu chuyện khiến người ta comment "mình cũng muốn thử", và là ảnh đẹp nhất cho giải "Quy trình Agent hay nhất". Có thể dùng luôn làm 1 trong các ảnh quá trình (giải quyết một phần A2).
5. **Đổi GIF thành video MP4 5–8 giây.** Facebook không phải lúc nào cũng cho GIF trong album tự chạy; video thì tự chạy trong feed và giữ người xem lâu hơn. Dùng `ffmpeg` từ `board/nghe-xong-roi-sep.gif` (thêm 1 giây đầu có chữ "Giao việc cho Nghé…"), đặt video ở vị trí 2 của album.
6. **Brand board: đưa câu cửa miệng lên và phóng to sticker.** "Nói là Nghé nghe!" là câu dễ nhớ nhất của bộ nhưng không có trên brand board. Hàng 3 sticker hiện chỉ cỡ khoảng 230px trên ảnh 2160px, xem trên điện thoại gần như không đọc được biểu cảm. Gợi ý: thu gọn khối "01 Màu sắc" (6 hình tròn chiếm cả một dải ngang) thành dải màu mảnh, lấy chỗ đó để làm hàng 6 sticker có nhãn + câu cửa miệng. Đây chỉ là sửa bố cục board, không sửa mascot.
7. **Cho người ngoài group một lý do để share: "8 prompt làm brand cho cộng đồng của bạn".** Làm 1 ảnh carousel tóm 8 bước trong `prompts.md` (mỗi bước 1 dòng + Nghé ở góc), đặt cuối album, kèm câu "lưu lại / share cho ai đang cần làm logo cho nhóm của họ". Đây là nội dung có giá trị độc lập với cuộc thi, hợp với share công khai (3đ) từ người ngoài group.

---

## Lặt vặt (không ảnh hưởng luật, sửa nếu còn thời gian)

- `mockup-the-nhan-vien.png`: wordmark "Đi làm với AI" trên thẻ để chữ "AI" cùng màu kem, trái quy tắc "AI màu primary" trong DESIGN.md (trên nền cam thì nên dùng `primary-soft`, hoặc ghi thêm ngoại lệ vào DESIGN.md).
- `mockup-ly-ca-phe.png`: ly giấy có khói (nóng) nhưng Nghé uống cà phê sữa đá; chọn một.
- Character sheet có màu "Bụng `#A99A8F`" nhưng DESIGN.md mục màu mascot không liệt kê; một Agent khác đọc DESIGN.md sẽ vẽ thiếu.
- `gemini-log.md` viết tiếng Anh và còn chữ "Task 11", lệch giọng với các file khác. Nên dịch 3 dòng "Outcome" sang tiếng Việt.
