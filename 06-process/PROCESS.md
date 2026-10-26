# Quy trình làm việc với AI Agent

- **Agent:** Claude Code (Claude Opus điều phối; subagent Haiku/Sonnet/Opus làm từng task, mỗi task có một subagent review riêng)
- **Người dự thi:** không phải designer. Vai trò: trả lời phỏng vấn, chọn và duyệt.
- Tài liệu nền: `RESEARCH.md` → `docs/briefs/` → `docs/superpowers/specs/` → `docs/superpowers/plans/`

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
- Mõm hồng to trông như bò sữa → đổi mõm sang xám-hồng (#BA8F89, nằm giữa thân #8C7B70 và hồng), lỗ mũi hạt đậu to hơn một chút; má vẫn hồng. Tay trái (phía người xem) gọn lại: ngắn, tròn, ép sát thân, móng nhỏ gọn cùng kiểu tay giơ.
- 26/10 (vòng 2): tay trái chỉnh giống tay phải, móng rõ — mình duyệt Nghé.
