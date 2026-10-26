# Research — Minigame "BRAND NÀY AI LÀM" (26/10/2026)

## 1. Đề bài (từ thể lệ PDF)
- Làm bộ nhận diện cho group **Đi làm với AI** bằng AI Agent. Tự do sáng tạo, không cần theo logo/màu cũ.
- 6 hạng mục bắt buộc: Logo (ngang + dọc, SVG + PNG trong suốt; +1 màu / nền tối = điểm cộng), Slogan (tiếng Việt + 1–2 câu giải thích), Mascot (≥1 tư thế, PNG trong suốt, nhân vật mới), Font (1 tiêu đề + 1 nội dung, đủ dấu Việt, free thương mại, ghi nguồn), Brand Voice (tính cách, xưng hô, từ nên/tránh, ≥3 câu mẫu), DESIGN.md (HEX, font, cỡ chữ, spacing, bo góc, quy tắc logo).
- Bắt buộc: tên Agent + ≥2 ảnh chụp quá trình / prompt chính.
- Nộp: thư mục Drive/GitHub public + bài đăng theo mẫu, kèm brand board, logo ngang/dọc, mascot, 2 ảnh quá trình.
- Lịch: nhận bài 26/10–1/11; điểm tính **từ lúc được duyệt** đến 23:59 8/11; BTC duyệt trong 24h theo thứ tự nộp.
- Điểm: reaction 1 · bình luận hợp lệ 2 (thành viên group, ≥5 chữ, 1/tk) · share công khai 3 (tài khoản thật, 1/tk — **không ghi bắt buộc là thành viên group**). Hoà: nhiều bình luận hơn thắng, rồi bài duyệt sớm hơn.
- Bị loại: sửa logo/slogan/mascot sau duyệt (chỉ sửa chính tả), link chết lúc chốt, tương tác mua/ảo, dùng nhân vật thương hiệu khác.
- Giải phụ do BTC chọn: **Quy trình Agent hay nhất** (mời chia sẻ ở webinar). BTC có thể chọn bài khác (không phải bài thắng) làm nhận diện chính thức.

## 2. Bối cảnh group
- Public group, ~724 thành viên (bài thông báo nói >600). Admin: Hưng Kescy ("thầy", dạy workshop, series "Đi làm với AI – ngày N"). Moderator: DT Lan Anh (giọng vui, "mại rô", "thui", emoji).
- Chủ đề lặp lại: AI như **nhân sự / đồng nghiệp** ("Nhân sự Trí thức → Nhân sự Phổ thông", "giao việc cho Agent", "làm chủ tịch chỉ cần ra lệnh"), usecase thật, workshop offline (Bamos Coffee HCM, Bắc → Nam), Claude Code / automation.
- Bài thông báo nhận ~33 reaction, comment ngắn → mặt bằng tương tác thấp; vài chục share từ ngoài group có thể quyết định giải.

## 3. Ràng buộc kỹ thuật
- DESIGN.md theo spec Google Stitch (`@google/design.md`, alpha): YAML front matter (`name` bắt buộc; `colors`, `typography`, `rounded`, `spacing`, `components`), section `##` đúng thứ tự: Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts. Có CLI `npx -p @google/design.md designmd lint` (contrast 4.5:1, broken-ref...). Lint sạch = bằng chứng "AI Agent khác đọc được".
- Máy: Python + Pillow, Node/npx, git, gh, `GEMINI_API_KEY` có sẵn. Thiếu: inkscape/cairosvg/resvg (SVG→PNG có thể dùng npx `@resvg/resvg-js` hoặc Playwright/browser).
- Gemini image: không xuất alpha thật; cần nền trơn rồi tách nền (hoặc 2-pass trắng/đen). Mascot nên vẽ **SVG thuần bằng code** để có vector + nhất quán nhiều tư thế, hoặc AI raster rồi tách nền.
- Font Google có subset Vietnamese (đã kiểm tra CSS API): Be Vietnam Pro, Lexend, Phudu, Bricolage Grotesque, Space Grotesk, Plus Jakarta Sans, Inter, Manrope, Unbounded, Montserrat, Baloo 2, Nunito, Epilogue, Archivo, Onest, Geologica, Fraunces, Dela Gothic One, Paytone One, Chakra Petch, JetBrains Mono, Space Mono, Lora... **Không có**: Sora, Instrument Sans.

## 4. Nhận định chiến lược (góc design + luật chơi)
- Giải chính = tương tác, không phải chấm thẩm mỹ. Design tốt là điều kiện cần; phân phối (share 3đ, comment 2đ) là điều kiện đủ.
- Nộp sớm = thêm ngày tích điểm. Không được sửa logo/slogan/mascot sau duyệt ⇒ phải chốt kỹ trước khi đăng.
- Bài cần "đáng share ra ngoài group": brand board đẹp như case study Behance + câu chuyện "không biết vẽ, giao cho Agent" + mascot dễ thương có thể thành sticker.
- Đánh vào giải phụ song song: quy trình Agent minh bạch, tái dùng được (repo GitHub có prompt, script, DESIGN.md lint pass).
- Insight tên: "AI" = trí tuệ nhân tạo **và** "ai" = ai đó (chính tên minigame chơi chữ này). "Đi làm" = đi làm hằng ngày (xe máy, cà phê, thẻ nhân viên) — chất Việt, dễ đồng cảm.

## 5. Quyết định đã chốt với người dự thi
- Mục tiêu: cả 3 (giải chính + giải quy trình Agent + được dùng chính thức). Đăng trong 24–48h (trước ~28/10).
- Mạng lưới share < 10 người ⇒ chính bài phải tự kéo share/comment.
- Người dự thi: không phải designer, đã là thành viên, ≥18t ⇒ câu chuyện "không biết vẽ".
- Concept: **Đồng nghiệp AI** (thẻ nhân viên, "nhân viên mới", giao việc). Gu: **ấm, thân thiện**. Xưng hô: **group – cả nhà**.
- Mascot: **con trâu** (cần cù, "trâu" = giỏi), có tên sẵn trước khi đăng. Làm **SVG code (bản chính) + Gemini (poster/minh hoạ)**, ngân sách Gemini < ~5 USD.
- Bonus: bộ sticker mascot, GIF/video ngắn, câu hỏi kéo comment (Claude chọn).
- Lưu trữ: GitHub public tài khoản DKayden + GitHub Pages, bản sao Google Drive.
- Ảnh quá trình: người dự thi tự chụp; Claude nhắc thời điểm + ghi PROCESS.md / prompts.md.
- Mọi thao tác public (tạo repo public, upload Drive, đăng bài) đều hỏi lại trước.

## 6. Xem lại group bằng Chrome (26/10, tài khoản người dự thi)
- 726 thành viên, **+189 trong tuần qua**. 38 bài trong tháng trước. Tạo nhóm 1/1/2025; **tên cũ "Sếp's Toy - Đồ Chơi Cho Sếp"**, nên chữ "sếp" là văn hoá gốc của group (Nghé gọi admin là "sếp" rất khớp).
- Ban quản trị gồm 4 người: admin Hà, Hưng (Hưng Kescy); kiểm duyệt Duy, Lan Anh.
- Bài thể lệ trên group khớp PDF, thêm câu: "Mời bạn bè vào group xem và cổ vũ, góp ý cho bài dự thi. BTC sẽ loại các bài có tương tác bất thường." Phần bình luận chưa có hỏi đáp nào làm thay đổi luật.
- Chưa có bài dự thi nào khác gắn #BrandNayAiLam.
- Nhận diện hiện tại (ảnh minigame, standee workshop): xanh rêu đậm + kem, "AI" màu vàng chanh. Bộ Nghé (cam đất, kem, nâu) khác hẳn, đúng tinh thần "tự do sáng tạo".
- Thành viên viết đúng ý concept: "mình có một thói quen là xem AI như một nhân sự thực sự trong team" (Minh Phương). Admin có bài "Nhân sự AI đang phát triển từng bước y như con người".
