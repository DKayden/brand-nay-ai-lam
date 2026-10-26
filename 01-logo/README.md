# Logo "Đi làm với AI"

Ý tưởng (bản A2, người dùng chốt ngày 26/10): **thẻ thắt cà vạt, mặt là dấu nhắc lệnh**. AI là một đồng nghiệp cấp cao, đi làm có thắt cà vạt hẳn hoi. Gương mặt của "đồng nghiệp" ấy là dấu nhắc lệnh `>_`, chỗ mình gõ để giao việc cho Agent. Logo gồm ba phần:

- Tấm thẻ màu xanh pastel `#B8D8F5`, viền navy `#1F3A5F`, bo góc tròn.
- Dấu nhắc lệnh navy trên mặt thẻ: một chữ `>` và một con trỏ `_`.
- Cổ áo trắng xanh `#F7FAFD` và cà vạt xanh đậm `#2B5C8A`, viền navy, thả xuống dưới thẻ.

Biểu tượng không có sừng, không có hình não và không có chữ "AI". Chữ "AI" chỉ nằm trong wordmark: **"Đi làm với AI"** viết bằng Bricolage Grotesque ExtraBold màu navy, riêng "AI" nằm trên một viên thuốc tô nền xanh pastel.

Sinh lại toàn bộ bằng lệnh `node src/logo.mjs`. Lệnh này ghi 8 file SVG, 24 file PNG và trang duyệt `preview-all.png`. Mọi chữ trong SVG đều đã chuyển thành path, không cần cài font.

## Biến thể

| Tên | Dùng khi |
|---|---|
| `logo-ngang` | Nền sáng (trắng, trắng xanh, xanh pastel). Đây là bản chính. Chữ canh giữa theo tấm thẻ, cà vạt thả xuống dưới hàng chữ. |
| `logo-doc` | Nền sáng, khung vuông hoặc khung đứng như poster, slide bìa, sticker. |
| `logo-ngang-nen-toi` | Nền tối, có sẵn nền navy đêm `#13243B`. Chữ màu trắng xanh, "AI" màu navy trên viên thuốc xanh pastel (7.75:1). |
| `logo-doc-nen-toi` | Như trên, bố cục dọc. |
| `logo-ngang-mono-navy` | In một màu navy `#1F3A5F` trên nền sáng: khắc, đóng dấu, in lụa. Dấu nhắc lệnh, lòng cổ áo, khe giữa nút và thân cà vạt, chữ "AI" trong viên thuốc đều được đục thủng để lộ nền. |
| `logo-ngang-mono-trang` | Một màu trắng trên nền tối hoặc trên ảnh đã làm tối. |
| `icon` | Favicon, emoji, chỗ chật. Ô vuông 220, nền trong suốt. |
| `icon-avatar` | Ảnh đại diện group, nằm trên ô vuông màu trắng xanh bo góc 24. Facebook cắt tròn vẫn giữ đủ thẻ và cà vạt. |

Có 3 cỡ PNG nền trong suốt cho mỗi biến thể: `png/<tên>-512.png`, `-1024.png` và `-2048.png`.

## Quy tắc dùng

- **Vùng an toàn:** để trống quanh logo một khoảng bằng chiều cao chữ "A" trong wordmark.
- **Cỡ tối thiểu:** bản ngang rộng ít nhất 120px, icon ít nhất 24px. Nhỏ hơn mức này thì chỉ dùng `icon`. Ở 32px, tấm thẻ và dấu `>_` vẫn đọc rõ; cà vạt chỉ còn là một nét nhỏ, chấp nhận được.
- **Canh hàng:** khi đặt chữ khác cùng hàng với `logo-ngang` (chân trang, hashtag), canh theo chân chữ của wordmark, không canh theo đáy cà vạt. Hàm `ngangBaseline()` trong `src/logo.mjs` trả về vị trí này.
- **Không được:**
  - kéo méo hoặc đổi tỉ lệ;
  - xoay logo;
  - thêm lại sừng, hình não hay chữ "AI" vào biểu tượng;
  - đổi màu ra ngoài bảng màu thương hiệu;
  - đặt logo lên nền rối, ảnh nhiều chi tiết;
  - đặt bản màu đầy đủ lên nền tối, vì chữ navy `#1F3A5F` không đủ tương phản. Trên nền tối hãy dùng bản `nen-toi`.
- **Chọn bản nào:**

  | Nền | Bản dùng |
  |---|---|
  | Nền sáng | Màu đầy đủ (`logo-ngang`, `logo-doc`) |
  | Nền tối | `nen-toi` |
  | In một màu | `mono-navy`, hoặc `mono-trang` nếu in trên nền tối |
