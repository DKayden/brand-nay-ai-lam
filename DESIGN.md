---
version: alpha
name: Đi làm với AI
description: Hệ nhận diện ấm áp, thân thiện cho cộng đồng người đi làm cùng AI; mascot Nghé.
colors:
  primary: "#B54A17"
  primary-soft: "#F59A52"
  background: "#FFF4E4"
  surface: "#F3E2CA"
  text: "#3A2417"
  text-muted: "#7A5A45"
  buffalo: "#8C7B70"
  success: "#5E8C3A"
  dark-bg: "#22150E"
typography:
  display: { fontFamily: Bricolage Grotesque, fontSize: 56px, fontWeight: 800, lineHeight: 1.15 }
  h1: { fontFamily: Bricolage Grotesque, fontSize: 40px, fontWeight: 800, lineHeight: 1.15 }
  h2: { fontFamily: Bricolage Grotesque, fontSize: 32px, fontWeight: 700, lineHeight: 1.15 }
  h3: { fontFamily: Bricolage Grotesque, fontSize: 24px, fontWeight: 700, lineHeight: 1.2 }
  body-lg: { fontFamily: Be Vietnam Pro, fontSize: 18px, fontWeight: 400, lineHeight: 1.6 }
  body: { fontFamily: Be Vietnam Pro, fontSize: 16px, fontWeight: 400, lineHeight: 1.6 }
  label: { fontFamily: Be Vietnam Pro, fontSize: 14px, fontWeight: 600, lineHeight: 1.4 }
  caption: { fontFamily: Be Vietnam Pro, fontSize: 13px, fontWeight: 500, lineHeight: 1.5 }
rounded: { sm: 8px, md: 14px, lg: 24px, pill: 999px }
spacing: { xs: 4px, sm: 8px, md: 12px, base: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px }
components:
  button-primary: { backgroundColor: "{colors.primary}", textColor: "{colors.background}", typography: "{typography.label}", rounded: "{rounded.pill}", padding: 12px 24px }
  button-secondary: { backgroundColor: "{colors.surface}", textColor: "{colors.text}", typography: "{typography.label}", rounded: "{rounded.pill}", padding: 12px 24px }
  card: { backgroundColor: "{colors.surface}", textColor: "{colors.text}", rounded: "{rounded.lg}", padding: 24px }
  badge-nhan-vien: { backgroundColor: "{colors.primary}", textColor: "{colors.background}", typography: "{typography.caption}", rounded: "{rounded.sm}", padding: 4px 12px }
  page: { backgroundColor: "{colors.background}", textColor: "{colors.text}", typography: "{typography.body}" }
  page-dark: { backgroundColor: "{colors.dark-bg}", textColor: "{colors.background}", typography: "{typography.body}" }
---

## Overview

**Đi làm với AI** là nhóm cộng đồng cho người đi làm muốn dùng AI vào việc hằng ngày. Ý tưởng hình ảnh: group vừa tuyển một "nhân viên" mới tên **Nghé**, chú nghé trâu nước đeo thẻ nhân sự AI. Nghé làm việc cùng mọi người, không làm thay mọi người. Slogan: **"AI làm việc, mình làm chủ."**

Tính cách hình ảnh: ấm, gần gũi, vui nhưng không lố. Màu đất và kem như văn phòng buổi sáng có cà phê. Hình khối tròn, viền nâu dày kiểu sticker. Chữ tiếng Việt đầy đủ dấu, dễ đọc.

Tỉ lệ màu trên một bố cục: **60%** nền kem (`background`), **25%** `surface` và chữ `text`, **10%** cam đất `primary`, **5%** còn lại gồm `primary-soft`, `success` và màu mascot.

Màu riêng của mascot (không dùng làm màu giao diện hay màu chữ): sừng kem `#FBE9CF`, mõm xám hồng và hai lỗ mũi `#BA8F89`, má hồng `#F2A99A`, bụng `#A99A8F`. Thân Nghé dùng `buffalo` `#8C7B70`.

Wordmark "Đi làm với AI": chữ "AI" màu `primary`, phần còn lại màu `text`.

## Colors

- **primary `#B54A17`** (cam đất): nút chính, chữ "AI" trong logo, thẻ nhân viên của Nghé. Chữ màu primary chỉ đặt trên `background` (tương phản 4.88:1). Không đặt trên `surface` (4.18:1) hay `dark-bg` (3.35:1) vì không đạt.
- **primary-soft `#F59A52`**: cam nhạt dùng cho điểm nhấn và chữ trên nền tối. Trên `dark-bg`, mọi thứ cần màu cam đều dùng màu này thay cho primary.
- **background `#FFF4E4`**: nền chính, cũng là màu chữ trên nút primary và trên nền tối.
- **surface `#F3E2CA`**: thẻ, khối nội dung, nút phụ. Chữ trên surface dùng `text`.
- **text `#3A2417`**: chữ chính và màu viền sticker.
- **text-muted `#7A5A45`**: chú thích, thông tin phụ.
- **buffalo `#8C7B70`**: màu thân Nghé, dùng cho hình minh hoạ, không dùng làm màu chữ.
- **success `#5E8C3A`**: trạng thái hoàn thành, dấu tick. Không dùng làm màu chữ nhỏ.
- **dark-bg `#22150E`**: nền tối. Trên nền này chỉ dùng logo bản `nen-toi` hoặc `mono-trang`.

## Typography

Hai họ chữ, đều từ Google Fonts, giấy phép SIL Open Font License (dùng tự do, kể cả thương mại):

- **Bricolage Grotesque** (700, 800) cho tiêu đề: https://fonts.google.com/specimen/Bricolage+Grotesque
- **Be Vietnam Pro** (400, 500, 600) cho nội dung, hỗ trợ đủ dấu tiếng Việt: https://fonts.google.com/specimen/Be+Vietnam+Pro

Thang chữ: display 56px, h1 40px, h2 32px, h3 24px, body-lg 18px, body 16px, label 14px, caption 13px. Tiêu đề line-height 1.15 đến 1.2, nội dung 1.6. Cỡ chữ nội dung tối thiểu 13px (chỉ cho caption).

## Layout

Lưới cơ sở 4px. Thang khoảng cách: 4, 8, 12, 16, 24, 32, 48, 64. Lề trang 24px trên điện thoại, 32px trên màn hình lớn. Độ rộng khối chữ tối đa 720px để dễ đọc. Khoảng cách giữa các khối lớn dùng 48 hoặc 64px; trong thẻ dùng 16 hoặc 24px.

## Elevation & Depth

Chỉ có một kiểu nổi: bóng sticker cứng `0 6px 0 #3A2417` (lệch xuống 6px, không mờ) cho thẻ nổi và nút khi cần nhấn mạnh. Không dùng bóng mờ (blur), không dùng gradient đổ bóng. Phần còn lại phẳng; chiều sâu đến từ viền nâu và đổi màu nền giữa `background` và `surface`.

## Shapes

Bo góc lớn, tròn trịa: sm 8px (huy hiệu), md 14px, lg 24px (thẻ), pill 999px (nút). Thẻ có viền nâu `text` dày 2px. Mascot có viền `#3A2417` dày 6px ở khung 512px (co giãn theo tỉ lệ khi đổi cỡ). Không dùng góc vuông sắc.

## Components

- **button-primary**: nền `primary`, chữ `background`, kiểu chữ label, bo pill, padding 12px 24px. Là nút hành động chính, mỗi màn hình chỉ một nút.
- **button-secondary**: nền `surface`, chữ `text`, label, bo pill, padding 12px 24px.
- **card**: nền `surface`, chữ `text`, bo 24px, padding 24px, viền nâu 2px, có thể thêm bóng sticker.
- **badge-nhan-vien**: nền `primary`, chữ `background`, kiểu caption, bo 8px, padding 4px 12px. Dùng cho thẻ "Nghé · Nhân sự AI".
- **page**: nền `background`, chữ `text`, kiểu body.
- **page-dark**: nền `dark-bg`, chữ `background`, kiểu body. Màu nhấn trên nền này là `primary-soft`.

## Do's and Don'ts

### Logo

Bộ logo gồm: `logo-ngang`, `logo-doc`, `mono-nau`, `mono-trang`, `nen-toi` và `icon` (kèm `icon-avatar`). Bản có chữ dùng thẻ mặt cười; icon đứng một mình dùng thẻ chữ "AI".

- Do: chọn bản theo nền: nền sáng dùng `logo-ngang` hoặc `logo-doc`; nền tối dùng `nen-toi`; in một màu dùng `mono-nau`, hoặc `mono-trang` trên nền tối.
- Do: chừa vùng an toàn quanh logo bằng chiều cao chữ "A" trong wordmark.
- Do: giữ cỡ tối thiểu: bản ngang rộng 120px, icon 24px. Nhỏ hơn thì dùng `icon`.
- Don't: kéo méo, đổi tỉ lệ, xoay logo.
- Don't: đổi màu ngoài bảng màu thương hiệu.
- Don't: đặt logo lên nền rối hoặc ảnh nhiều chi tiết.
- Don't: đặt bản màu đầy đủ lên nền tối (chữ "AI" màu primary không đủ tương phản).

### Mascot Nghé

- Do: giữ đúng đặc điểm: hai sừng kem lưỡi liềm giống logo, mõm xám hồng `#BA8F89` với hai lỗ mũi hạt đậu, mắt tròn đen có một đốm sáng, má hồng, bụng `#A99A8F`, thân `#8C7B70`, viền `#3A2417` 6px ở khung 512px.
- Do: luôn cho Nghé đeo thẻ nhân viên cam đất "Nghé · Nhân sự AI".
- Do: dùng 6 tư thế sticker trong `03-mascot/` cho các tình huống tương ứng.
- Don't: đổi màu thân, sừng hay mũi.
- Don't: vẽ Nghé buồn bã hoặc giận dữ.
- Don't: để Nghé "thay thế con người" hay làm thay chủ nhân; Nghé là trợ lý, người dùng làm chủ.

### Màu chữ

- Do: dùng `text` cho chữ chính trên `background` và `surface`; dùng `primary` cho chữ chỉ trên `background`.
- Do: dùng `primary-soft` hoặc `background` cho chữ trên `dark-bg`.
- Don't: đặt chữ primary trên `surface` hoặc `dark-bg`.
- Don't: dùng màu mascot (sừng, mõm, má) hoặc `buffalo`, `success` làm màu chữ.
