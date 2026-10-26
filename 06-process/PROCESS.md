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
