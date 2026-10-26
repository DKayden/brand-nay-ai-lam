# Logo "Đi làm với AI"

Ý tưởng: **thẻ nhân viên mọc sừng**. Group vừa tuyển một nhân viên mới là Nghé, chú nghé trâu nước. Logo gồm ba phần:

- Tấm thẻ màu cam đất, có dây đeo và kẹp.
- Hai sừng trâu nước màu kem, quét ngang rồi cong lên thành hình lưỡi liềm.
- Mặt thẻ in chữ **AI** (khi icon đứng một mình) hoặc vẽ **mặt cười** (khi đi cùng chữ, để chữ "AI" không bị lặp lại).

Sinh lại toàn bộ bằng lệnh `node src/logo.mjs`. Lệnh này ghi 8 file SVG, 24 file PNG và trang duyệt `preview-all.png`. Mọi chữ trong SVG đều đã chuyển thành path, không cần cài font.

## Biến thể

| Tên | Dùng khi |
|---|---|
| `logo-ngang` | Nền sáng (kem, trắng). Đây là bản chính. |
| `logo-doc` | Nền sáng, khung vuông hoặc khung đứng như poster, slide bìa, sticker. |
| `logo-ngang-nen-toi` | Nền tối, có sẵn nền `#22150E`. Chữ màu kem, "AI" màu cam nhạt `#F59A52`. |
| `logo-doc-nen-toi` | Như trên, bố cục dọc. |
| `logo-ngang-mono-nau` | In một màu trên nền sáng: khắc, đóng dấu, in lụa. Mặt thẻ được đục thủng để lộ nền. |
| `logo-ngang-mono-trang` | Một màu trắng trên nền tối hoặc trên ảnh đã làm tối. |
| `icon` | Favicon, emoji, chỗ chật. Nền trong suốt. |
| `icon-avatar` | Ảnh đại diện group, nằm trên ô vuông màu kem bo góc 24. Facebook cắt tròn vẫn không mất sừng. |

Có 3 cỡ PNG nền trong suốt cho mỗi biến thể: `png/<tên>-512.png`, `-1024.png` và `-2048.png`.

## Quy tắc dùng

- **Vùng an toàn:** để trống quanh logo một khoảng bằng chiều cao chữ "A" trong wordmark.
- **Cỡ tối thiểu:** bản ngang rộng ít nhất 120px, icon ít nhất 24px. Nhỏ hơn mức này thì chỉ dùng `icon`.
- **Không được:**
  - kéo méo hoặc đổi tỉ lệ;
  - xoay logo;
  - đổi màu ra ngoài bảng màu thương hiệu;
  - đặt logo lên nền rối, ảnh nhiều chi tiết;
  - đặt bản màu đầy đủ lên nền tối, vì chữ "AI" màu `#B54A17` không đủ tương phản. Trên nền tối hãy dùng bản `nen-toi`.
- **Chọn bản nào:**

  | Nền | Bản dùng |
  |---|---|
  | Nền sáng | Màu đầy đủ (`logo-ngang`, `logo-doc`) |
  | Nền tối | `nen-toi` |
  | In một màu | `mono-nau`, hoặc `mono-trang` nếu in trên nền tối |
