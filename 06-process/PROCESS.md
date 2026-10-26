# Quy trình làm việc với AI Agent

Thư mục này là toàn bộ "hậu trường" của bài dự thi **Nghé — nhân sự AI mới của Đi làm với AI**. Người khác muốn làm brand cho cộng đồng của mình có thể lấy [prompts.md](prompts.md) về dùng.

## Agent dùng

- **Claude Code** (Anthropic), chạy theo kiểu *subagent-driven development*:
  - một Agent điều phối (Claude Opus) chia việc thành 16 task theo [plan](../docs/superpowers/plans/2026-10-26-nghe-brand-production.md);
  - mỗi task giao cho một subagent mới (Haiku/Sonnet/Opus tuỳ độ khó), subagent chỉ thấy phần brief của task đó;
  - xong task, một **subagent review độc lập** đọc lại kết quả và bắt lỗi, rồi mới sang task tiếp theo.
- Công cụ phụ: Node (`opentype.js` đổi chữ thành path, `@resvg/resvg-js` xuất PNG), Python + Pillow (GIF), `designmd lint` (kiểm DESIGN.md), Gemini API (thử làm poster 3D, không thành, xem [gemini-log.md](gemini-log.md)).
- **Người dự thi** không phải designer. Việc của mình: trả lời phỏng vấn, chọn hướng, duyệt hoặc chê. Việc của Agent: nghiên cứu, vẽ, kiểm tra, viết tài liệu.

## Tài liệu nền (theo thứ tự ra đời)

1. [RESEARCH.md](../RESEARCH.md): đọc thể lệ, group, spec DESIGN.md, font có dấu Việt.
2. [Đề bài đã làm rõ](../docs/briefs/2026-10-26-brand-nay-ai-lam.md): 6 mục (mục tiêu, hiện trạng, vấn đề, mong muốn, ràng buộc), chưa có lời giải.
3. [Spec ý tưởng](../docs/superpowers/specs/2026-10-26-nghe-brand-design.md): concept, mascot, màu, chữ, giọng.
4. [Plan sản xuất](../docs/superpowers/plans/2026-10-26-nghe-brand-production.md): 16 task, có 4 cổng để mình duyệt.

## Dòng thời gian thực tế (giờ commit trong git, ngày 26/10/2026)

| Giờ | Việc xong | Commit |
|---|---|---|
| 10:16 | Research, brief, spec, plan | `e5ec5ee` |
| 10:17 | Khởi tạo repo, tải font, kiểm dấu Việt | `d98d733` |
| 10:19 | Màu + test tương phản; sửa màu chính sang `#B54A17` | `33e49c7`, `c5c7f46` |
| 10:20 | Pipeline chữ thành path, SVG thành PNG trong suốt | `8642b42` |
| 10:25 | 3 hướng logo + bảng so ở 32px | `2cf23ab` |
| 10:33 | Mình chọn hướng A | `c0d6f30` |
| 10:40 | Bộ logo đầy đủ (ngang, dọc, 1 màu, nền tối, icon) | `fdc2651` |
| 10:47 | Nghé dáng gốc + character sheet | `cec464f` |
| 11:03, 11:11 | Hai vòng chỉnh Nghé theo góp ý của mình | `58f0f89`, `b146aa5` |
| 11:19, 11:30 | 6 tư thế sticker, rồi sửa lỗi sau review | `914490c`, `39f5cbf` |
| 11:32 - 11:35 | Slogan, font, brand voice, DESIGN.md (lint 0 lỗi (4 cảnh báo orphaned-tokens đã chấp nhận)) | `2ecd396` ... `acedb63` |
| 11:41, 11:43 | Brand board, mockup, poster phẳng; sửa chồng chữ | `aecad2f`, `a45133f` |
| 14:02 | Sửa móng Nghé che chữ trên biển | `f7266a3` |
| 14:05 | Thử poster 3D bằng Gemini (không thành), ghi log | `4634d0b` |
| 14:07 | GIF "Đang chạy → Xong rồi sếp!" | `e8aa097` |

Tổng: khoảng 4 giờ từ commit đầu đến commit sản phẩm cuối, trong đó có khoảng nghỉ giữa 11:43 và 14:02. Task 13 (build một lệnh, tài liệu) và các bước kiểm tra cuối làm sau mốc này; giờ của chúng xem `git log`.

## Các lần mình duyệt

| Cổng | Mình quyết gì | Kết quả |
|---|---|---|
| Hướng logo | Chọn 1 trong 3 | Chọn **A** (thẻ nhân viên mọc sừng) |
| Nghé, vòng 1 | Xem dáng gốc | Agent góp ý mõm hồng to dễ bị nhìn thành bò sữa và tay trái hơi cụt. Mình đồng ý: "Chỉnh 2 điểm bạn đề xuất (mõm xám-hồng cho ra trâu, tay trái gọn lại)" |
| Nghé, vòng 2 | Xem bản sửa | "Tay trái vẫn hơi cụt, chỉnh thêm cho giống tay phải (tay tròn có móng rõ) rồi duyệt luôn." |
| Duyệt cuối | Xem toàn bộ trước khi đăng | Chưa xong tại thời điểm viết (sẽ cập nhật) |
| Công khai repo | Đồng ý tạo repo GitHub public | Chưa tới bước này |
| Đăng bài | Mình tự đăng lên group | Chưa tới bước này |

## Lỗi bắt được trong lúc làm

Mỗi task có một subagent review chạy độc lập với subagent làm, cộng với test tự động. Những lỗi dưới đây được bắt và sửa trước khi tới tay mình duyệt:

| Lỗi | Ai bắt | Sửa |
|---|---|---|
| Màu chính `#C2521C` trên nền kem chỉ đạt tương phản 4.28:1, dưới ngưỡng 4.5 của `designmd lint` | Test tương phản tự động | Tối màu chính thành `#B54A17` (4.88:1), cập nhật spec và plan (`c5c7f46`) |
| Ở vài tư thế sticker, đạo cụ che mất thẻ tên "Nghé · Nhân sự AI" trên ngực | Subagent review | Sửa lại, thêm test render pixel so vùng chữ trên thẻ với bản gốc (`39f5cbf`) |
| Laptop trong tư thế sticker khó đọc ra là laptop | Subagent review | Vẽ laptop nhìn từ phía sau (`39f5cbf`) |
| Móng tay Nghé đè lên chữ trên biển "Chào member mới" | Agent điều phối, khi xem lại bản sửa mockup | Dời tay khỏi chữ (`f7266a3`) |
| Mascot chồng lên chú thích trong mockup ảnh bìa group | Subagent review | Dời mascot (`a45133f`) |

## Ảnh chụp quá trình (`screenshots/`)

Bộ 4 ảnh bằng chứng, đặt tên đúng như sau:

| Tệp | Chụp gì |
|---|---|
| `01-logo-3-huong.png` | Bảng 3 hướng logo A/B/C ở cỡ 96/48/32px |
| `02-character-sheet.png` | Character sheet của Nghé |
| `03-designmd-lint.png` | Kết quả `designmd lint DESIGN.md` (bản chữ: [designmd-lint.txt](designmd-lint.txt)) |
| `04-brand-board.png` | Brand board hoàn chỉnh |

## Khung quy trình dùng lại được

Mỗi bước dưới đây có prompt điền chỗ trống trong [prompts.md](prompts.md).

1. Research đề bài, thể lệ, đối thủ.
2. Phỏng vấn theo nhóm câu trắc nghiệm để chốt concept, rồi cho một subagent "đọc lạnh" soi chỗ hổng.
3. Phác 3 hướng logo bằng SVG code, so ở 32px, tự phê bình, người dùng chọn.
4. Dựng bộ logo; chữ luôn đổi thành path.
5. Vẽ mascot bằng code, khoá danh sách đặc điểm, kiểm trùng nhân vật có sẵn.
6. Làm sticker bằng cách ghép bộ phận, kèm test pixel cho chỗ dễ lỗi.
7. Viết DESIGN.md và chạy lint.
8. Dựng brand board, mockup; một lệnh build lại tất cả.

---

# Chi tiết từng bước

## Bước 0: Research + brainstorm (26/10)
- Agent đọc thể lệ (PDF Drive) và trang group, rồi research spec DESIGN.md, font Google có dấu tiếng Việt, giới hạn của Gemini.
- Agent phỏng vấn mình theo từng nhóm câu hỏi trắc nghiệm (mục tiêu, concept, mascot, giọng, cách kéo tương tác).
- Một subagent "đọc lạnh" kiểm brief 3 vòng, đến khi trả về NO GAPS.

## Bước 1: Chọn hướng logo (26/10)
- Agent phác 3 hướng bằng code SVG: **A** thẻ nhân viên mọc sừng · **B** đầu Nghé · **C** sừng thành chữ A. Có bảng so sánh ở cỡ 96/48/32px, avatar và nền tối.
- **Mình chọn A.** Lý do: rõ nhất ở 32px và kể đúng ý "nhân sự AI".
- Chỉnh theo góp ý của Agent:
  - sừng vểnh ngang, cong về sau, đúng dáng trâu Việt;
  - thêm dây đeo thẻ;
  - logo có wordmark thì mặt thẻ là khuôn mặt cười, để chữ "AI" không lặp lại.
- Ảnh so sánh 3 hướng (bằng chứng quá trình): [logo-3-huong-so-sanh.png](logo-3-huong-so-sanh.png).
- Prompt chính: *"Phác 3 hướng logo khác biệt thật cho group 'Đi làm với AI' theo concept Đồng nghiệp AI, vẽ bằng SVG code, so sánh ở cỡ 32px rồi tự phê bình từng hướng."*

## Bước 2 — Mascot Nghé (26/10)
- Agent vẽ Nghé bằng code SVG (`src/mascot.mjs`), tách bộ phận (sừng, tai, đầu, thân, thẻ, tay, chân) để ghép 6 tư thế sau này.
- Chỉnh so với bản phác đầu Nghé ở hướng logo B (bị nhận xét giống heo/bò):
  - mõm rộng gần gấp đôi chiều cao, bo chữ nhật mềm, 2 lỗ mũi hạt đậu đặt xa nhau;
  - sừng lưỡi liềm quét ngang rồi vút lên, cùng công thức với sừng logo;
  - tai cụp ngang hai bên, thêm xoáy lông trán cho ra "nghé" (trâu con).
- Tự kiểm ở cỡ 128px: vẫn đọc ra trâu con đeo thẻ, đang giơ tay "Dạ!".

### Kiểm tra trùng nhân vật
So 4 đặc điểm (dáng · màu · đạo cụ · tên) với 5 nhân vật trâu gần nhất tìm được:

| Nhân vật | Dáng | Màu | Đạo cụ | Tên | Trùng |
|---|---|---|---|---|---|
| Trâu Vàng, linh vật SEA Games 22 (2003), hoạ sĩ Nguyễn Thái Hưng | trâu đứng, vẫy chào | vàng | đồ thể thao | Trâu Vàng | 1 (dáng vẫy tay) |
| Trâu trong tranh Đông Hồ "Chăn trâu thổi sáo" | trâu thật, bốn chân, có mục đồng | đen/nâu khắc gỗ | lá sen, sáo | không tên | 0 |
| Chip the Buffalo (ĐH Colorado) | bò rừng bison, cơ bắp | nâu | đồng phục thể thao | Chip | 0 |
| Billy Buffalo (Buffalo Bills) | bò rừng bison xanh dương | xanh | áo đấu | Billy | 0 |
| Tranh stock "cute bison/buffalo cartoon" (Adobe Stock, Alamy) | chibi bốn chân | nâu | không | không tên | 0 |

*Lưu ý: không tìm được ảnh/mô tả hình của Trâu Vàng (SEA Games 22), nên dòng so sánh này dựa trên tên và bối cảnh (linh vật thể thao, màu vàng), không dựa trên hình.*

Bổ sung (vòng review 1), tìm lại bằng WebSearch cho hai từ khoá "linh vật trâu Tết Tân Sửu 2021" và "linh vật trâu vàng SEA Games 22 hình ảnh". Cả hai lần đều không tìm được ảnh trực tiếp, chỉ có mô tả bằng chữ:

| Nhân vật | Link | Dáng | Màu | Đạo cụ | Tên | Trùng |
|---|---|---|---|---|---|---|
| Đàn trâu linh vật đường hoa Nguyễn Huệ 2021 (60 con, cao ~1m, kèm mục đồng) | https://plo.vn/thiet-ke-doc-dao-cua-linh-vat-duong-hoa-tet-nguyen-hue-post609722.html | không tìm được ảnh; mô tả "gia đình trâu, phong cách hiện đại" | không tìm được ảnh | mục đồng (khác thẻ nhân viên) | không có tên riêng | 0 chắc chắn (dáng và màu chưa kiểm được bằng hình) |
| Biểu tượng linh vật Tân Sửu 2021, quảng trường Nguyễn Tất Thành, Quy Nhơn | https://nongnghiepmoitruong.vn/linh-vat-tag2295/ | không tìm được ảnh | không tìm được ảnh | không rõ | không rõ | 0 (chưa kiểm được bằng hình) |
| Trâu Vàng, SEA Games 22 (tìm lại) | https://vov.vn/chuyen-nam-mao/tan-man-ve-trau | nhân cách hoá, vui vẻ, mến khách; không tìm được ảnh | vàng | không rõ | Trâu Vàng | 1 (như bảng trên) |

**Kết luận:** không nhân vật nào trùng từ 2 đặc điểm trở lên → giữ thiết kế. Thẻ nhân viên, thân xám, tên "Nghé" là phần riêng. Không tìm thấy mascot nào tên "Nghé".

Nguồn:
- https://en.wikipedia.org/wiki/List_of_SEA_Games_mascots
- https://en.wikipedia.org/wiki/2003_SEA_Games
- https://tuoitre.vn/sao-la-linh-vat-cua-sea-games-31-20200924231348027.htm (tham khảo phụ: linh vật sao la SEA Games 31, không phải Trâu Vàng)
- https://en.wikipedia.org/wiki/%C4%90%C3%B4ng_H%E1%BB%93_painting
- https://www.vietnam.vn/tranh-chan-trau-thoi-sao
- https://www.colorado.edu/coloradan/2020/02/01/chip-tales
- https://en.wikipedia.org/wiki/Billy_Buffalo
- https://stock.adobe.com/577883450
- Từ khoá đã tìm: "linh vật trâu vàng SEA Games 22", "chibi buffalo mascot", "nghé mascot linh vật", "mascot trâu linh vật Tết Tân Sửu", "cute baby water buffalo cartoon character mascot brand".

### Góp ý của người dùng (26/10)
- Agent nhận xét mõm hồng to dễ bị nhìn thành bò sữa, mình đồng ý → đổi mõm sang xám-hồng (#BA8F89, nằm giữa thân #8C7B70 và hồng), lỗ mũi hạt đậu to hơn một chút; má vẫn hồng. Tay trái (phía người xem) gọn lại: ngắn, tròn, ép sát thân, móng nhỏ gọn cùng kiểu tay giơ.
- 26/10 (vòng 2): tay trái chỉnh giống tay phải, móng rõ — mình duyệt Nghé.
