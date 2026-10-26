# Sản xuất bộ nhận diện "Nghé" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sản xuất đủ 6 hạng mục + bằng chứng + phần thưởng thêm cho bài dự thi "BRAND NÀY AI LÀM", dựng lại được bằng 1 lệnh, qua kiểm tra luật trước khi đăng.

**Architecture:** Mọi hình ảnh là SVG do Agent viết bằng code (mascot ghép từ các bộ phận dùng chung để giữ nhất quán), chữ trong logo chuyển thành path để không phụ thuộc font. Một pipeline Node (`@resvg/resvg-js`) render SVG → PNG trong suốt ở nhiều cỡ. Python (stdlib + Pillow) kiểm tra bài nộp, ghép GIF, gọi Gemini cho poster 3D. Token màu/font khai báo một chỗ (`src/tokens.mjs`), DESIGN.md lint bằng CLI chính thức.

**Tech Stack:** Node 18+ ESM, `@resvg/resvg-js@2.6.2`, `opentype.js@1.3.4`, `@google/design.md@0.4.0` (npx), Python 3.14 + Pillow 12, Gemini `gemini-3.1-flash-image` (REST, urllib), git + gh.

**Nguồn:** brief `docs/briefs/2026-10-26-brand-nay-ai-lam.md`, spec `docs/superpowers/specs/2026-10-26-nghe-brand-design.md`.

## Global Constraints

- Agent khai báo: **Claude Code**. Mascot tên **Nghé**. Slogan **"AI làm việc, mình làm chủ."** Wordmark **"Đi làm với AI"** ("AI" màu primary).
- Font: **Bricolage Grotesque** (tiêu đề, 700–800) + **Be Vietnam Pro** (nội dung, 400/500/600), Google Fonts, SIL OFL.
- Màu (nháp, chỉnh nếu fail tương phản): primary `#C2521C`, primary-soft `#F59A52`, background `#FFF4E4`, surface `#F3E2CA`, text `#3A2417`, text-muted `#7A5A45`, buffalo `#8C7B70`, success `#5E8C3A`, dark-bg `#22150E`.
- Thang chữ px: display 56 · h1 40 · h2 32 · h3 24 · body-lg 18 · body 16 · caption 13. Spacing 4–8–12–16–24–32–48–64. Bo góc sm 8 · md 14 · lg 24 · pill 999.
- Logo: bản ngang + dọc, SVG + PNG trong suốt 512/1024/2048 px; thêm mono nâu, mono trắng, nền tối, icon vuông. Ngang tối thiểu 120px, icon tối thiểu 24px.
- Mascot: viền `#3A2417` 6px ở khung 512; đặc điểm khoá: 2 sừng kem, mũi hồng đất 2 lỗ hạt đậu, mắt tròn đen 1 đốm sáng, má hồng, thân `#8C7B70`, thẻ nhân viên cam đất "Nghé · Nhân sự AI". 6 tư thế.
- Gemini: tối đa **15 lần gọi hoặc 2 USD** cho poster 3D; quá → poster SVG phẳng.
- GIF/clip **≤ 15 giây**.
- Không: web tạo thẻ cá nhân, quảng cáo/mua tương tác, video > 15s, in ấn.
- **Cổng duyệt người dùng (không được bỏ qua):** chọn logo (Task 4), duyệt Nghé (Task 6), duyệt toàn bộ (Task 14), đồng ý tạo repo public (Task 15), người dùng tự đăng bài.
- **Nhắc chụp màn hình** tại: Task 4 (so 3 logo), Task 6 (character sheet), Task 9 (lint pass), Task 10 (brand board). Ảnh lưu `06-process/screenshots/`.
- Lịch: Ngày 1 (26/10) Task 1–6 · Ngày 2 (27/10) Task 7–12 · Ngày 3 (28/10) Task 13–16. 21:00 28/10 chưa duyệt xong → dời đăng sang 29–30/10.
- Mọi file text UTF-8 không BOM.

## Cấu trúc file

```
package.json, .gitignore
src/
  tokens.mjs          token màu/font/thang (nguồn duy nhất cho code)
  fonts.mjs           tải TTF từ Google Fonts vào assets/fonts/
  textpath.mjs        chuỗi → SVG path bằng opentype.js
  render.mjs          SVG → PNG (resvg), hàm renderFile/renderSizes
  logo.mjs            sinh mọi biến thể logo từ hướng đã chọn
  mascot.mjs          bộ phận Nghé + 6 tư thế
  board.mjs           brand board, mockup, poster SVG phẳng
  build.mjs           chạy toàn bộ pipeline (npm run build)
  gif.py              ghép frame PNG → GIF
  gemini_poster.py    poster 3D qua Gemini REST
  check_submission.py kiểm tra luật trước khi đăng
tests/
  test_tokens.mjs, test_textpath.mjs, test_render.mjs
explore/              phác thảo logo A/B/C (không nộp)
01-logo/ 02-slogan/ 03-mascot/ 04-font/ 05-brand-voice/ 06-process/ board/
DESIGN.md, README.md, post.md
```

---

### Task 1: Khởi tạo repo + tải font

**Files:**
- Create: `package.json`, `.gitignore`, `src/fonts.mjs`, `tests/test_fonts.mjs`

**Interfaces:**
- Produces: `assets/fonts/BricolageGrotesque-800.ttf`, `BricolageGrotesque-700.ttf`, `BeVietnamPro-400.ttf`, `BeVietnamPro-500.ttf`, `BeVietnamPro-600.ttf`; `FONT_FILES` (mảng đường dẫn) export từ `src/fonts.mjs`.

- [ ] **Step 1: git init + package.json**

```bash
cd D:/Claude/Challenge/BrandNayAiLam && git init -b main
```

`package.json`:
```json
{
  "name": "brand-nay-ai-lam",
  "private": true,
  "type": "module",
  "scripts": {
    "fonts": "node src/fonts.mjs",
    "test": "node --test tests/",
    "build": "node src/build.mjs",
    "lint:design": "npx -y -p @google/design.md@0.4.0 designmd lint DESIGN.md"
  },
  "devDependencies": {
    "@resvg/resvg-js": "2.6.2",
    "opentype.js": "1.3.4"
  }
}
```

`.gitignore`:
```
node_modules/
explore/*.png
.env
```

Run: `npm install` — Expected: không lỗi.

- [ ] **Step 2: Viết test font (failing)**

`tests/test_fonts.mjs`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import opentype from 'opentype.js';
import { FONT_FILES } from '../src/fonts.mjs';

const VI = 'ĐđẮẰẲẴẶắằẳẵặỨỪỬỮỰứừửữựỹỷỳ';

test('đủ 5 file font và có glyph tiếng Việt', () => {
  assert.equal(FONT_FILES.length, 5);
  for (const f of FONT_FILES) {
    assert.ok(fs.existsSync(f), `thiếu ${f}`);
    const b = fs.readFileSync(f);
    const font = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
    for (const ch of VI) {
      assert.notEqual(font.charToGlyphIndex(ch), 0, `${f} thiếu glyph ${ch}`);
    }
  }
});
```

Run: `npm test` — Expected: FAIL (`Cannot find module '../src/fonts.mjs'`).

- [ ] **Step 3: Viết `src/fonts.mjs`**

```js
// Tải TTF tĩnh từ Google Fonts CSS2 API (UA mặc định của Node nhận về truetype).
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'assets/fonts';
const SPECS = [
  ['Bricolage Grotesque', 800, 'BricolageGrotesque-800.ttf'],
  ['Bricolage Grotesque', 700, 'BricolageGrotesque-700.ttf'],
  ['Be Vietnam Pro', 400, 'BeVietnamPro-400.ttf'],
  ['Be Vietnam Pro', 500, 'BeVietnamPro-500.ttf'],
  ['Be Vietnam Pro', 600, 'BeVietnamPro-600.ttf'],
];

export const FONT_FILES = SPECS.map(([, , file]) => path.join(DIR, file));
export const fontPath = (family, weight) =>
  path.join(DIR, SPECS.find(([f, w]) => f === family && w === weight)[2]);

async function download() {
  fs.mkdirSync(DIR, { recursive: true });
  for (const [family, weight, file] of SPECS) {
    const css = await (await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replaceAll(' ', '+')}:wght@${weight}`
    )).text();
    const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) throw new Error(`Không thấy TTF cho ${family} ${weight}`);
    fs.writeFileSync(path.join(DIR, file), Buffer.from(await (await fetch(url)).arrayBuffer()));
    console.log('ok', file);
  }
}

if (process.argv[1].endsWith('fonts.mjs')) await download();
```

- [ ] **Step 4: Tải font, chạy test**

Run: `npm run fonts && npm test` — Expected: 5 dòng `ok …ttf`, test PASS. Nếu glyph thiếu → dừng, báo người dùng (font sai điều kiện thể lệ).

- [ ] **Step 5: Commit** (kèm RESEARCH.md, docs/ đã có)

```bash
git add -A && git commit -m "chore: init repo, download brand fonts with Vietnamese check"
```

---

### Task 2: Token + kiểm tra tương phản

**Files:**
- Create: `src/tokens.mjs`, `tests/test_tokens.mjs`

**Interfaces:**
- Produces: `COLORS` (object tên → HEX), `TYPE` (object tên → `{family, weight, size, lineHeight}`), `SPACING`, `ROUNDED`, `contrast(hexA, hexB) → number`.

- [ ] **Step 1: Test (failing)**

`tests/test_tokens.mjs`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { COLORS, contrast } from '../src/tokens.mjs';

test('contrast đúng công thức WCAG', () => {
  assert.equal(contrast('#000000', '#FFFFFF').toFixed(1), '21.0');
});

const PAIRS = [
  ['text', 'background'], ['text', 'surface'], ['text-muted', 'background'],
  ['primary', 'background'], ['background', 'primary'], ['background', 'dark-bg'],
  ['primary-soft', 'dark-bg'],
];
for (const [fg, bg] of PAIRS) {
  test(`${fg} trên ${bg} ≥ 4.5`, () => {
    assert.ok(contrast(COLORS[fg], COLORS[bg]) >= 4.5,
      `${fg}/${bg} = ${contrast(COLORS[fg], COLORS[bg]).toFixed(2)}`);
  });
}
```

Run: `npm test` — Expected: FAIL (module chưa có).

- [ ] **Step 2: Viết `src/tokens.mjs`**

```js
export const COLORS = {
  primary: '#C2521C',
  'primary-soft': '#F59A52',
  background: '#FFF4E4',
  surface: '#F3E2CA',
  text: '#3A2417',
  'text-muted': '#7A5A45',
  buffalo: '#8C7B70',
  success: '#5E8C3A',
  'dark-bg': '#22150E',
  // mascot-only (không dùng cho chữ)
  horn: '#FBE9CF',
  nose: '#D98A7A',
  cheek: '#F2A99A',
};

const H = 'Bricolage Grotesque', B = 'Be Vietnam Pro';
export const TYPE = {
  display: { family: H, weight: 800, size: 56, lineHeight: 1.15 },
  h1: { family: H, weight: 800, size: 40, lineHeight: 1.15 },
  h2: { family: H, weight: 700, size: 32, lineHeight: 1.15 },
  h3: { family: H, weight: 700, size: 24, lineHeight: 1.2 },
  'body-lg': { family: B, weight: 400, size: 18, lineHeight: 1.6 },
  body: { family: B, weight: 400, size: 16, lineHeight: 1.6 },
  label: { family: B, weight: 600, size: 14, lineHeight: 1.4 },
  caption: { family: B, weight: 500, size: 13, lineHeight: 1.5 },
};
export const SPACING = { xs: 4, sm: 8, md: 12, base: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 };
export const ROUNDED = { sm: 8, md: 14, lg: 24, pill: 999 };

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
```

- [ ] **Step 3: Chạy test, chỉnh HEX nếu fail**

Run: `npm test` — Expected: PASS. Cặp nào fail: chỉ chỉnh độ sáng (giữ sắc độ) của màu chữ/nền trong cặp đó — ví dụ `primary` tối dần theo bước 4% (`#C2521C` → `#B54A17` → …) đến khi ≥ 4.5 — rồi cập nhật lại bảng màu trong spec mục 4 cho khớp.

- [ ] **Step 4: Commit**

```bash
git add src/tokens.mjs tests/test_tokens.mjs && git commit -m "feat: design tokens with WCAG contrast tests"
```

---

### Task 3: Pipeline chữ → path và SVG → PNG

**Files:**
- Create: `src/textpath.mjs`, `src/render.mjs`, `tests/test_textpath.mjs`, `tests/test_render.mjs`

**Interfaces:**
- Consumes: `fontPath(family, weight)` (Task 1).
- Produces:
  - `textPath(text, {family, weight, size, x, y, fill, anchor='start'}) → {d: string, width: number, svg: string}` (`svg` là `<path d=… fill=…/>`).
  - `measure(text, {family, weight, size}) → number` (px).
  - `renderPng(svgString, width) → Buffer` (PNG, nền trong suốt, font lấy từ `assets/fonts`).
  - `renderSizes(svgPath, outBase, widths=[512,1024,2048]) → string[]` ghi `${outBase}-${w}.png`, trả danh sách file.

- [ ] **Step 1: Test (failing)**

`tests/test_textpath.mjs`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { textPath, measure } from '../src/textpath.mjs';

test('chuỗi có dấu thành path không rỗng, rộng tỉ lệ cỡ chữ', () => {
  const o = { family: 'Bricolage Grotesque', weight: 800, size: 100, x: 0, y: 100, fill: '#3A2417' };
  const r = textPath('Đi làm với AI', o);
  assert.match(r.d, /^M/);
  assert.ok(r.svg.includes('fill="#3A2417"'));
  assert.ok(Math.abs(measure('Đi làm với AI', { ...o, size: 200 }) - 2 * r.width) < 1);
});
```

`tests/test_render.mjs`:
```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPng } from '../src/render.mjs';

test('PNG có kênh alpha và góc trong suốt', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#C2521C"/></svg>';
  const png = renderPng(svg, 200);
  assert.equal(png.readUInt32BE(16), 200);           // IHDR width
  assert.equal(png[25], 6);                          // color type RGBA
});
```

Run: `npm test` — Expected: FAIL (module chưa có).

- [ ] **Step 2: `src/textpath.mjs`**

```js
import fs from 'node:fs';
import opentype from 'opentype.js';
import { fontPath } from './fonts.mjs';

const cache = new Map();
const load = (family, weight) => {
  const k = `${family}|${weight}`;
  if (!cache.has(k)) {
    const buf = fs.readFileSync(fontPath(family, weight));
    cache.set(k, opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)));
  }
  return cache.get(k);
};

export const measure = (text, { family, weight, size }) =>
  load(family, weight).getAdvanceWidth(text, size, { kerning: true });

export function textPath(text, { family, weight, size, x = 0, y = 0, fill = '#000', anchor = 'start' }) {
  const width = measure(text, { family, weight, size });
  const x0 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  const d = load(family, weight).getPath(text, x0, y, size, { kerning: true }).toPathData(2);
  return { d, width, svg: `<path d="${d}" fill="${fill}"/>` };
}
```

- [ ] **Step 3: `src/render.mjs`**

```js
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { FONT_FILES } from './fonts.mjs';

export function renderPng(svg, width) {
  return new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Be Vietnam Pro' },
  }).render().asPng();
}

export function renderSizes(svgPath, outBase, widths = [512, 1024, 2048]) {
  const svg = fs.readFileSync(svgPath, 'utf8');
  fs.mkdirSync(path.dirname(outBase), { recursive: true });
  return widths.map((w) => {
    const out = `${outBase}-${w}.png`;
    fs.writeFileSync(out, renderPng(svg, w));
    return out;
  });
}
```

- [ ] **Step 4: Chạy test**

Run: `npm test` — Expected: PASS toàn bộ.

- [ ] **Step 5: Commit**

```bash
git add src/textpath.mjs src/render.mjs tests/ && git commit -m "feat: text-to-path and SVG to transparent PNG pipeline"
```

---

### Task 4: Phác 3 hướng logo → người dùng chọn (CỔNG DUYỆT)

**Files:**
- Create: `explore/logo-sketches.mjs`, `explore/logo-a.svg`, `explore/logo-b.svg`, `explore/logo-c.svg`, `explore/logo-compare.svg`

**Interfaces:**
- Consumes: `COLORS` (Task 2), `textPath` (Task 3), `renderPng` (Task 3).
- Produces: quyết định `LOGO_DIRECTION ∈ {'A','B','C'}` ghi vào `06-process/PROCESS.md`; hàm vẽ icon của hướng được chọn sẽ chuyển sang Task 5.

- [ ] **Step 1: Viết `explore/logo-sketches.mjs`** — mỗi hướng là một hàm `iconA/iconB/iconC(size=200) → string` (nhóm `<g>` trong khung 0..200), cùng wordmark `textPath('Đi làm với AI', {family:'Bricolage Grotesque', weight:800, size:64, …})` với "AI" là path riêng màu `COLORS.primary`, phần còn lại `COLORS.text`. Hình học bắt buộc:
  - **A — Thẻ + sừng:** `rect` 120×150 bo góc 22 tô `COLORS.primary`, lỗ đeo `rect` 36×10 bo 5 màu `COLORS.background` cách mép trên 18; hai sừng là `path` cong (cubic) màu `COLORS.horn` viền `COLORS.text` 6, mọc từ hai góc trên ra ngoài rồi cong vào; chữ "AI" (Bricolage 800, 64) màu `COLORS.background` canh giữa thẻ.
  - **B — Đầu Nghé tối giản:** `circle` r=88 màu `COLORS.buffalo` viền `COLORS.text` 6; 2 sừng như A; mũi `ellipse` 46×30 màu `COLORS.nose`, 2 lỗ mũi `ellipse` 6×9 `COLORS.text`; 2 mắt `circle` r=9 + đốm sáng r=3 trắng.
  - **C — Sừng thành chữ A:** hai sừng đối xứng chụm đỉnh tạo chữ A (nét dày 22, `COLORS.primary`), gạch ngang chữ A là thanh `rect` bo tròn `COLORS.text`; bên phải là chữ "I" cùng độ dày.
  Script ghi 3 file `explore/logo-{a,b,c}.svg` (icon trái + wordmark phải, viewBox 0 0 760 200) và `explore/logo-compare.svg` (3 dòng xếp chồng, nền `COLORS.background`, mỗi dòng có nhãn A/B/C và bản thu nhỏ 32px của icon bên cạnh để thử độ đọc ở cỡ nhỏ), rồi render `explore/logo-compare.png` rộng 1600.

- [ ] **Step 2: Chạy và xem**

Run: `node explore/logo-sketches.mjs` — Expected: 4 SVG + 1 PNG. Mở `explore/logo-compare.png` bằng Read để tự đánh giá; sửa hình học nếu sừng bị cắt, chữ đè nhau, hoặc icon 32px không đọc ra trâu.

- [ ] **Step 3: 📸 Nhắc người dùng chụp màn hình** cửa sổ Claude Code đang hiển thị ảnh so sánh → lưu `06-process/screenshots/01-logo-3-huong.png`.

- [ ] **Step 4: CỔNG DUYỆT** — hỏi người dùng chọn A/B/C (kèm gợi ý chỉnh). Không qua bước này khi chưa có câu trả lời.

- [ ] **Step 5: Ghi quyết định + commit**

Tạo `06-process/PROCESS.md` với mục đầu: "## Bước 1 — Chọn hướng logo" ghi hướng chọn, lý do, prompt chính đã dùng.
```bash
git add explore/ 06-process/ && git commit -m "feat: logo exploration A/B/C, direction chosen"
```

---

### Task 5: Bộ logo hoàn chỉnh

**Files:**
- Create: `src/logo.mjs`, `01-logo/svg/*.svg`, `01-logo/png/*.png`, `01-logo/README.md`

**Interfaces:**
- Consumes: hàm icon của hướng đã chọn (chép từ `explore/logo-sketches.mjs` sang `src/logo.mjs` thành `icon(colors)`), `textPath`, `renderSizes`.
- Produces: `buildLogos() → string[]` (danh sách file đã ghi). Tên file cố định:
  `logo-ngang`, `logo-doc`, `logo-ngang-mono-nau`, `logo-ngang-mono-trang`, `logo-ngang-nen-toi`, `logo-doc-nen-toi`, `icon`, `icon-avatar` (icon trên nền vuông `COLORS.background`, bo `ROUNDED.lg`).
  Mỗi tên có `01-logo/svg/<tên>.svg` và `01-logo/png/<tên>-{512,1024,2048}.png`.

- [ ] **Step 1: Viết `src/logo.mjs`**

```js
import fs from 'node:fs';
import { COLORS } from './tokens.mjs';
import { textPath } from './textpath.mjs';
import { renderSizes } from './render.mjs';

// ponytail: icon() chép nguyên từ hướng logo đã chọn ở Task 4; khung 0..200.
export const icon = (c) => /* dán hàm icon của hướng đã chọn, thay COLORS.x bằng c.x */ '';

const WM = { family: 'Bricolage Grotesque', weight: 800, size: 64 };
function wordmark(c, x, y, anchor = 'start') {
  const head = textPath('Đi làm với ', { ...WM, x: 0, y: 0 });
  const ai = textPath('AI', { ...WM, x: 0, y: 0 });
  const total = head.width + ai.width;
  const x0 = anchor === 'middle' ? x - total / 2 : x;
  return textPath('Đi làm với ', { ...WM, x: x0, y, fill: c.text }).svg +
         textPath('AI', { ...WM, x: x0 + head.width, y, fill: c.accent }).svg;
}

const PALETTES = {
  full: { ...COLORS, accent: COLORS.primary },
  'mono-nau': Object.fromEntries(Object.keys(COLORS).map((k) => [k, COLORS.text])),
  'mono-trang': Object.fromEntries(Object.keys(COLORS).map((k) => [k, '#FFFFFF'])),
  'nen-toi': { ...COLORS, text: COLORS.background, accent: COLORS['primary-soft'] },
};
for (const p of ['mono-nau', 'mono-trang']) PALETTES[p].accent = PALETTES[p].text;

const svg = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
  (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') + body + '</svg>';

const ngang = (c, bg) => svg(760, 200, `<g>${icon(c)}</g>${wordmark(c, 230, 124)}`, bg);
const doc = (c, bg) => svg(480, 330, `<g transform="translate(140,0)">${icon(c)}</g>${wordmark(c, 240, 300, 'middle')}`, bg);

export function buildLogos() {
  const out = [];
  const variants = {
    'logo-ngang': ngang(PALETTES.full),
    'logo-doc': doc(PALETTES.full),
    'logo-ngang-mono-nau': ngang(PALETTES['mono-nau']),
    'logo-ngang-mono-trang': ngang(PALETTES['mono-trang']),
    'logo-ngang-nen-toi': ngang(PALETTES['nen-toi'], COLORS['dark-bg']),
    'logo-doc-nen-toi': doc(PALETTES['nen-toi'], COLORS['dark-bg']),
    icon: svg(200, 200, icon(PALETTES.full)),
    'icon-avatar': svg(240, 240, `<rect width="240" height="240" rx="24" fill="${COLORS.background}"/><g transform="translate(20,20)">${icon(PALETTES.full)}</g>`),
  };
  fs.mkdirSync('01-logo/svg', { recursive: true });
  for (const [name, s] of Object.entries(variants)) {
    const f = `01-logo/svg/${name}.svg`;
    fs.writeFileSync(f, s);
    out.push(f, ...renderSizes(f, `01-logo/png/${name}`));
  }
  return out;
}

if (process.argv[1].endsWith('logo.mjs')) console.log(buildLogos().length, 'files');
```

Thay dòng `export const icon = …` bằng hàm icon thật của hướng đã chọn (bắt buộc — dòng giữ chỗ `''` không được commit).

- [ ] **Step 2: Chạy**

Run: `node src/logo.mjs` — Expected: `32 files` (8 SVG + 24 PNG). Nếu wordmark tràn khung: chỉnh `viewBox` ngang theo `head.width + ai.width + 230 + 30`.

- [ ] **Step 3: Kiểm tra bằng mắt + máy**

Run: `grep -L "<text" 01-logo/svg/*.svg | wc -l` — Expected: `8` (không còn thẻ `<text>`, mọi chữ đã là path).
Mở `01-logo/png/logo-ngang-1024.png`, `logo-doc-1024.png`, `logo-ngang-nen-toi-1024.png` bằng Read; sửa nếu lệch tâm/đè nhau.

- [ ] **Step 4: `01-logo/README.md`** — liệt kê biến thể + quy tắc: vùng an toàn = chiều cao chữ "A"; ngang tối thiểu 120px, icon tối thiểu 24px; không kéo méo, không đổi màu ngoài bảng, không đặt nền rối, không xoay; khi nào dùng bản nào (nền sáng → full; nền tối → nen-toi; in 1 màu → mono).

- [ ] **Step 5: Commit**

```bash
git add src/logo.mjs 01-logo/ && git commit -m "feat: full logo set (horizontal, vertical, mono, dark, icon)"
```

---

### Task 6: Nghé — dáng gốc + character sheet (CỔNG DUYỆT)

**Files:**
- Create: `src/mascot.mjs`, `03-mascot/svg/nghe-nghe.svg`, `03-mascot/character-sheet.svg`, `03-mascot/png/nghe-nghe-{512,1024,2048}.png`

**Interfaces:**
- Consumes: `COLORS`, `textPath`, `renderSizes`, `renderPng`.
- Produces:
  - `part.horns()`, `part.head({eyes='open'|'happy'|'sleepy'|'confused', mouth='smile'|'open'|'o'})`, `part.body()`, `part.badge()`, `part.armUp(side)`, `part.armDown(side)`, `part.legs()` → chuỗi SVG trong khung 512×512.
  - `pose(name) → svgString` với `name ∈ POSES`.
  - `POSES = ['nghe-nghe','dang-chay','xong-roi-sep','y-sep-la','ca-phe-sang','chao-member-moi']`.

- [ ] **Step 1: Viết bộ phận trong `src/mascot.mjs`** theo quy cách khoá (khung 512, viền `stroke="${COLORS.text}" stroke-width="6" stroke-linejoin="round"`):
  - Đầu: ellipse tâm (256,200) rx 150 ry 130, `COLORS.buffalo`; vệt sáng trán ellipse mờ (`opacity .18` trắng).
  - Sừng: 2 path cubic đối xứng qua x=256, gốc tại (150,110)/(362,110), cong ra rồi vào, đầu nhọn tròn, `COLORS.horn`.
  - Tai: 2 ellipse nghiêng ±25° ở hai bên đầu, trong tai `COLORS.cheek`.
  - Mắt `open`: circle r 16 `COLORS.text` tại (200,195)/(312,195) + đốm sáng r 5 trắng lệch (−5,−5). `happy`: path cung ∩. `sleepy`: đường ngang hơi cong. `confused`: một mắt open, một mắt nhỏ hơn r 11.
  - Má: ellipse 26×14 `COLORS.cheek` opacity .8 dưới mắt.
  - Mũi: ellipse tâm (256,262) rx 70 ry 44 `COLORS.nose`; 2 lỗ mũi ellipse 9×14 `COLORS.text` tại (232,262)/(280,262).
  - Miệng `smile`: path cung nhỏ dưới mũi; `open`: path hình chữ D tô `COLORS.text`, lưỡi `COLORS.cheek`; `o`: ellipse nhỏ.
  - Thân: rect bo tròn (176,318) 160×130 rx 60 `COLORS.buffalo`, bụng ellipse sáng hơn (`#A99A8F`).
  - Thẻ nhân viên: dây `path` chữ V từ cổ màu `COLORS.primary` nét 8; thẻ rect 64×80 rx 10 `COLORS.primary` tại (224,350), dòng chữ `textPath('Nghé', {Bricolage 800, 16, fill: COLORS.background, anchor:'middle'})` và `textPath('Nhân sự AI', {Be Vietnam Pro 600, 9, …})`.
  - Chân: 2 rect bo tròn ngắn + móng `COLORS.text`.
  - `pose('nghe-nghe')` = horns + ears + head(open, open) + body + badge + armUp('right') + armDown('left') + legs, trong `<svg viewBox="0 0 512 512">` không có nền.

- [ ] **Step 2: Character sheet** — `03-mascot/character-sheet.svg` 1600×1000 nền `COLORS.background`: Nghé chính lớn bên trái; bên phải là bảng màu mascot (swatch + HEX), 4 biểu cảm đầu (open/happy/sleepy/confused), nhãn đặc điểm khoá, câu "Nói là Nghé nghe!" (Bricolage 800). Render `03-mascot/character-sheet.png` rộng 1600 và `renderSizes('03-mascot/svg/nghe-nghe.svg','03-mascot/png/nghe-nghe')`.

- [ ] **Step 3: Tự đánh giá** — Read `03-mascot/character-sheet.png`. Kiểm: đọc ra trâu (sừng + mũi to), đáng yêu ở cỡ 128px, viền đều, không có phần bị cắt khung. Sửa đến khi đạt.

- [ ] **Step 4: Kiểm tra trùng nhân vật** — WebSearch: "mascot trâu", "linh vật trâu vàng SEA Games 22", "chibi buffalo mascot", "nghé mascot". So 4 đặc điểm (dáng, màu, đạo cụ, tên) với 5 kết quả gần nhất. Trùng ≥ 2 → chỉnh thiết kế (đổi màu thân/đạo cụ/dáng), giữ tên. Ghi kết quả + link vào `06-process/PROCESS.md` mục "Kiểm tra trùng nhân vật".

- [ ] **Step 5: 📸 Nhắc người dùng chụp** character sheet → `06-process/screenshots/02-character-sheet.png`.

- [ ] **Step 6: CỔNG DUYỆT** — hỏi người dùng duyệt Nghé (dáng, màu, biểu cảm). Sửa theo góp ý, lặp đến khi được "duyệt".

- [ ] **Step 7: Commit**

```bash
git add src/mascot.mjs 03-mascot/ 06-process/ && git commit -m "feat: Nghe mascot base pose and character sheet"
```

---

### Task 7: 6 tư thế sticker

**Files:**
- Modify: `src/mascot.mjs` (thêm 5 pose)
- Create: `03-mascot/svg/<pose>.svg`, `03-mascot/png/<pose>-{512,1024}.png`, `03-mascot/stickers-sheet.png`

**Interfaces:**
- Consumes: `part.*`, `pose()` (Task 6).
- Produces: `buildMascot() → string[]` ghi mọi pose + stickers sheet + character sheet (dời code vẽ character sheet của Task 6 vào hàm này để `npm run build` dựng lại được).

- [ ] **Step 1: Thêm pose** (chỉ thay tay/biểu cảm/đạo cụ, giữ nguyên đầu-sừng-mũi-thẻ):
  - `dang-chay`: eyes open, mouth o; laptop (rect `COLORS.surface` viền nâu, màn hình `COLORS.text`, vòng loading cung `COLORS.primary-soft`) trước bụng; hai tay chạm bàn phím.
  - `xong-roi-sep`: eyes happy, mouth open; tay phải giơ ngón cái; 3 tia lấp lánh 4 cánh `COLORS.primary-soft`.
  - `y-sep-la`: eyes confused, mouth o; đầu nghiêng `rotate(-8 256 200)`; dấu "?" (Bricolage 800, 90, `COLORS.primary`) góc trên phải.
  - `ca-phe-sang`: eyes sleepy, mouth smile; hai tay ôm ly cà phê sữa đá (cốc trong suốt viền nâu, lớp nâu `#6B4226` dưới + lớp sữa `#E8CFA8` trên, 3 viên đá vuông trắng, ống hút `COLORS.primary`).
  - `chao-member-moi`: eyes happy, mouth open; một tay vẫy (2 vạch chuyển động), tay kia cầm bảng rect `COLORS.background` viền nâu ghi "Chào cả nhà!" (Be Vietnam Pro 600 → path).
- [ ] **Step 2: `buildMascot()`** — ghi 6 SVG, render 512/1024 mỗi pose, tạo `stickers-sheet.svg` lưới 3×2 nền `COLORS.background` có nhãn tên sticker dưới mỗi ô, render `stickers-sheet.png` rộng 1600.
- [ ] **Step 3: Chạy + kiểm** — Run: `node -e "import('./src/mascot.mjs').then(m=>console.log(m.buildMascot().length))"` — Expected: `22` (6 SVG + 12 PNG + stickers-sheet SVG/PNG + character-sheet SVG/PNG). `nghe-nghe-2048.png` từ Task 6 vẫn được giữ: render `nghe-nghe` ở 512/1024/2048, các pose khác 512/1024 → nếu đếm ra `23` thì cũng đúng, ghi lại con số thật vào Task 13. Read `stickers-sheet.png`; 6 tư thế phải nhìn ra cùng một nhân vật.
- [ ] **Step 4: Commit**

```bash
git add src/mascot.mjs 03-mascot/ && git commit -m "feat: six Nghe sticker poses"
```

---

### Task 8: Slogan, font, brand voice (văn bản)

**Files:**
- Create: `02-slogan/slogan.md`, `04-font/fonts.md`, `05-brand-voice/brand-voice.md`

- [ ] **Step 1: `02-slogan/slogan.md`**

```markdown
# Slogan

**AI làm việc, mình làm chủ.**

Ở group này, AI là đồng nghiệp gánh phần việc lặp lại; còn mình giữ vai người giao việc, ra quyết định và làm chủ công nghệ. "Làm chủ" vừa là làm sếp, vừa là làm chủ cuộc chơi AI.

Câu cửa miệng của mascot: **"Nói là Nghé nghe!"** — Nghé là trâu con (nhân viên mới), và "Nghé" đọc gần "nghe": giao việc rõ ràng thì Nghé nghe liền.
```

- [ ] **Step 2: `04-font/fonts.md`**

```markdown
# Font chữ

| Vai trò | Font | Độ đậm | Nguồn tải | Giấy phép |
|---|---|---|---|---|
| Tiêu đề | Bricolage Grotesque | 700, 800 | https://fonts.google.com/specimen/Bricolage+Grotesque | SIL Open Font License 1.1 — dùng thương mại miễn phí |
| Nội dung | Be Vietnam Pro | 400, 500, 600 | https://fonts.google.com/specimen/Be+Vietnam+Pro | SIL Open Font License 1.1 — dùng thương mại miễn phí |

Cả hai font có bộ ký tự tiếng Việt đầy đủ (đã kiểm tự động bằng `tests/test_fonts.mjs` với các ký tự Đ ắ ằ ẳ ẵ ặ ứ ừ ử ữ ự ỹ…).

Mẫu: "Đi làm với AI — AI làm việc, mình làm chủ." (xem `board/brand-board.png`).

Thang cỡ chữ: display 56 · h1 40 · h2 32 · h3 24 · body-lg 18 · body 16 · caption 13 (px). Line-height tiêu đề 1.15, nội dung 1.6.
```

- [ ] **Step 3: `05-brand-voice/brand-voice.md`** — chép nguyên mục 6 của spec (bảng 2 lớp giọng, Nên dùng, Tránh, 4 câu mẫu) và thêm 3 câu mẫu giọng Nghé dùng cho sticker/bình luận:
  - "Nghé nghe! Việc này để Nghé lo, cả nhà đi pha cà phê đi ạ."
  - "Ơ… ý sếp là làm slide hay làm bánh ạ? Prompt rõ thêm chút là Nghé chạy liền!"
  - "Xong rồi sếp! Nghé để file ở đây, sếp duyệt giúp Nghé nha."
- [ ] **Step 4: Commit**

```bash
git add 02-slogan 04-font 05-brand-voice && git commit -m "docs: slogan, font sheet, brand voice"
```

---

### Task 9: DESIGN.md + lint

**Files:**
- Create: `DESIGN.md`

**Interfaces:**
- Consumes: giá trị cuối cùng trong `src/tokens.mjs` (sau Task 2).

- [ ] **Step 1: Viết `DESIGN.md`** — front matter YAML (giá trị lấy đúng từ `src/tokens.mjs`):

```yaml
---
version: alpha
name: Đi làm với AI
description: Hệ nhận diện ấm áp, thân thiện cho cộng đồng người đi làm cùng AI; mascot Nghé.
colors:
  primary: "#C2521C"
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
```

Thân bài: các section `##` đúng thứ tự **Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts**. Overview: ý tưởng "Nghé – nhân sự AI", slogan, tính cách hình ảnh, tỉ lệ màu 60/25/10/5. Colors: vai trò từng màu. Typography: cặp font + link + giấy phép. Layout: lưới 4px, lề 24/32, độ rộng nội dung tối đa 720px. Elevation: bóng mềm duy nhất `0 6px 0 #3A2417` kiểu sticker cho thẻ nổi, không bóng mờ. Shapes: bo góc lớn, viền nâu 2px cho thẻ, mascot viền 6px. Components: mô tả các component ở front matter. Do's and Don'ts: quy tắc logo (vùng an toàn, cỡ tối thiểu, cấm kéo méo/xoay/đổi màu), quy tắc mascot (không đổi màu thân/sừng/mũi, luôn đeo thẻ, không vẽ Nghé buồn bã/giận dữ, không để Nghé "thay thế con người"), quy tắc màu chữ.

- [ ] **Step 2: Lint**

Run: `npm run lint:design` — Expected: exit 0, không có finding mức error, không có cảnh báo `contrast-ratio`, `broken-ref`, `section-order`. Cảnh báo `orphaned-tokens` cho `buffalo`/`success` chấp nhận được (màu minh hoạ). Nếu YAML inline `{ … }` bị lỗi parse → chuyển sang dạng khối nhiều dòng.

- [ ] **Step 3: 📸 Nhắc người dùng chụp** kết quả lint pass → `06-process/screenshots/03-designmd-lint.png`.

- [ ] **Step 4: Commit**

```bash
git add DESIGN.md && git commit -m "docs: DESIGN.md design system (lint clean)"
```

---

### Task 10: Brand board + mockup + poster SVG

**Files:**
- Create: `src/board.mjs`, `board/brand-board.svg/.png`, `board/mockup-cover-group.png`, `board/mockup-the-nhan-vien.png`, `board/mockup-ly-ca-phe.png`, `board/mockup-slide-webinar.png`, `board/poster-nghe-phang.png`

**Interfaces:**
- Consumes: SVG file trong `01-logo/svg`, `03-mascot/svg` (nhúng bằng cách đọc file và bóc phần trong `<svg>…</svg>` vào `<g transform>`), `textPath`, `renderPng`, `COLORS`.
- Produces: `buildBoard() → string[]`; helper `embed(svgFile, x, y, w) → string` (đọc viewBox, scale = w / viewBoxWidth).

- [ ] **Step 1: `embed()`** trong `src/board.mjs`:

```js
import fs from 'node:fs';
export function embed(file, x, y, w) {
  const s = fs.readFileSync(file, 'utf8');
  const [, , vw] = s.match(/viewBox="([\d.\s-]+)"/)[1].trim().split(/\s+/).map(Number).slice(0, 3);
  const inner = s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return `<g transform="translate(${x},${y}) scale(${w / vw})">${inner}</g>`;
}
```

- [ ] **Step 2: Brand board** 1080×1350 (tỉ lệ 4:5 tối ưu feed FB), nền `COLORS.background`, lưới 2 cột lề 56:
  1. Hàng đầu: logo ngang lớn + slogan (Bricolage 800, 44).
  2. Nghé `nghe-nghe` cỡ 380 bên phải, 3 sticker nhỏ bên dưới.
  3. Bảng màu: 6 swatch tròn có tên + HEX (Be Vietnam Pro 600 → path).
  4. Font: "Aa" Bricolage + "Aa" Be Vietnam Pro + dòng mẫu có dấu.
  5. Brand voice: 1 câu mẫu giọng group + 1 câu giọng Nghé trong thẻ `card`.
  6. Chân trang: logo dọc nền tối nhỏ + "#BrandNayAiLam".
  Mọi chữ dùng `textPath` (không dùng `<text>`). Render PNG 2160 (×2).
- [ ] **Step 3: Mockup** (mỗi cái 1 hàm, 1 file PNG):
  - cover group 1640×856: nền `COLORS.primary`, Nghé `chao-member-moi` bên phải, wordmark nền tối + slogan bên trái (vùng an toàn giữa 1640×624 cho mobile).
  - thẻ nhân viên 1200×900: thẻ dọc `badge-nhan-vien` phóng lớn với ảnh Nghé, "Nghé · Nhân sự AI · Mã NV: AI-001", dây đeo.
  - ly cà phê 1200×900: ly giấy vẽ phẳng có icon logo + Nghé `ca-phe-sang` bên cạnh.
  - slide webinar 1920×1080: tiêu đề "Giao việc cho Agent" (display), Nghé `dang-chay`, logo góc.
- [ ] **Step 4: Poster SVG phẳng** 1080×1350: Nghé `nghe-nghe` cỡ 760 giữa, bong bóng thoại "Chào cả nhà, em là Nghé!", dưới cùng logo ngang + slogan. (Ảnh bìa dự phòng cho Task 11.)
- [ ] **Step 5: Kiểm** — Read từng PNG; sửa chồng lấn, chữ tràn, khoảng trắng lệch. Run `node -e "import('./src/board.mjs').then(m=>console.log(m.buildBoard().length))"` — Expected: `7`.
- [ ] **Step 6: 📸 Nhắc người dùng chụp** brand board → `06-process/screenshots/04-brand-board.png`.
- [ ] **Step 7: Commit**

```bash
git add src/board.mjs board/ && git commit -m "feat: brand board, mockups, flat poster"
```

---

### Task 11: Poster Nghé 3D (Gemini, ngân sách cứng)

**Files:**
- Create: `src/gemini_poster.py`, `03-mascot/nghe-3d-poster.png`, `06-process/gemini-log.md`

**Interfaces:**
- Consumes: `03-mascot/png/nghe-nghe-1024.png` (ảnh tham chiếu), env `GEMINI_API_KEY`.
- Produces: `03-mascot/nghe-3d-poster.png` nếu đạt; nếu không, Task 16 dùng `board/poster-nghe-phang.png`.

- [ ] **Step 1: Viết `src/gemini_poster.py`**

```python
"""Poster Nghé 3D qua Gemini. Ngân sách cứng: tối đa 15 lần gọi (đếm trong gemini-log.md)."""
import base64, json, os, pathlib, sys, urllib.request

MODEL = "gemini-3.1-flash-image"
LOG = pathlib.Path("06-process/gemini-log.md")
OUT_DIR = pathlib.Path("explore/gemini")
MAX_CALLS = 15

PROMPT = """Render this exact character as a soft 3D clay-style mascot poster, 4:5 vertical.
Keep EVERY locked trait identical to the reference: baby water buffalo (nghé), chibi proportions (big head ~55% of height),
warm grey-brown body #8C7B70, two short cream curved horns, big dusty-pink nose with two bean-shaped nostrils,
round black eyes with one white highlight, pink cheeks, orange employee ID badge on a lanyard reading "Nghé".
Pose: waving hello, cheerful. Background: warm cream #FFF4E4 with soft orange sunrise glow, a small iced milk coffee cup beside.
No text other than the badge. No other characters. Do not change the design."""

def calls_used() -> int:
    return LOG.read_text(encoding="utf-8").count("\n- call ") if LOG.exists() else 0

def main(note: str = "") -> None:
    n = calls_used()
    if n >= MAX_CALLS:
        sys.exit(f"Hết ngân sách: đã gọi {n}/{MAX_CALLS} lần. Dùng poster SVG phẳng.")
    ref = base64.b64encode(pathlib.Path("03-mascot/png/nghe-nghe-1024.png").read_bytes()).decode()
    body = {"contents": [{"parts": [{"text": PROMPT + ("\n" + note if note else "")},
                                    {"inline_data": {"mime_type": "image/png", "data": ref}}]}],
            "generationConfig": {"responseModalities": ["IMAGE"]}}
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
        data=json.dumps(body).encode(), method="POST",
        headers={"Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]})
    with urllib.request.urlopen(req, timeout=180) as r:
        res = json.load(r)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"poster-{n + 1:02d}.png"
    parts = res["candidates"][0]["content"]["parts"]
    img = next(p for p in parts if "inlineData" in p or "inline_data" in p)
    out.write_bytes(base64.b64decode((img.get("inlineData") or img["inline_data"])["data"]))
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(f"\n- call {n + 1}: {out} — note: {note or '(none)'}")
    print(out)

if __name__ == "__main__":
    main(" ".join(sys.argv[1:]))
```

- [ ] **Step 2: Gọi lần 1** — Run: `python -I src/gemini_poster.py` (từ thư mục dự án) — Expected: in `explore/gemini/poster-01.png`. Read ảnh, chấm theo 4 đặc điểm khoá (sừng kem, mũi hồng 2 lỗ, thẻ cam "Nghé", thân xám-nâu).
- [ ] **Step 3: Lặp có điều kiện** — sai đặc điểm nào thì gọi lại với note nêu đúng đặc điểm đó (ví dụ `python -I src/gemini_poster.py "The nose must be dusty pink with two nostrils; badge must be orange."`). Dừng khi đạt cả 4, hoặc khi script báo hết ngân sách (15 lần). Ước tính chi phí theo giá niêm yết hiện hành của model; vượt 2 USD → dừng sớm.
- [ ] **Step 4: Chốt** — đạt: copy ảnh tốt nhất sang `03-mascot/nghe-3d-poster.png`, ghi vào `gemini-log.md` lần chọn. Không đạt: ghi "Dùng poster SVG phẳng" vào log.
- [ ] **Step 5: Commit**

```bash
git add src/gemini_poster.py 06-process/gemini-log.md 03-mascot/ && git commit -m "feat: Gemini 3D poster (budgeted) with fallback log"
```

---

### Task 12: GIF "Đang chạy → Xong rồi sếp!" (≤ 15s)

**Files:**
- Create: `src/gif.py`, `board/nghe-xong-roi-sep.gif`

**Interfaces:**
- Consumes: `03-mascot/png/dang-chay-512.png`, `03-mascot/png/xong-roi-sep-512.png` (Task 7).

- [ ] **Step 1: `src/gif.py`**

```python
"""Ghép GIF ngắn: Nghé gõ laptop (nhấp nhô) rồi bật 'Xong rồi sếp!'. Tổng < 15 giây."""
import sys
from PIL import Image

BG = (255, 244, 228, 255)  # COLORS.background

def frame(path: str, dy: int) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    canvas = Image.new("RGBA", (512, 540), BG)
    canvas.alpha_composite(im, (0, 14 + dy))
    return canvas.convert("P", palette=Image.ADAPTIVE)

def main(out: str = "board/nghe-xong-roi-sep.gif") -> None:
    run = [frame("03-mascot/png/dang-chay-512.png", dy) for dy in (0, -6, 0, -6, 0, -6, 0, -6)]
    done = [frame("03-mascot/png/xong-roi-sep-512.png", dy) for dy in (-14, 0)]
    frames = run + done
    durations = [180] * len(run) + [200, 1800]
    assert sum(durations) <= 15000
    frames[0].save(out, save_all=True, append_images=frames[1:], duration=durations, loop=0, disposal=2)
    print(out, sum(durations), "ms")

if __name__ == "__main__":
    main(*sys.argv[1:])
```

- [ ] **Step 2: Chạy** — Run: `python -I src/gif.py` — Expected: `board/nghe-xong-roi-sep.gif 3440 ms`. Mở GIF trong Browser pane (`file:///D:/Claude/Challenge/BrandNayAiLam/board/nghe-xong-roi-sep.gif`) để xem chuyển động.
- [ ] **Step 3: Commit**

```bash
git add src/gif.py board/nghe-xong-roi-sep.gif && git commit -m "feat: short Nghe GIF"
```

---

### Task 13: Build 1 lệnh + tài liệu quy trình + README

**Files:**
- Create: `src/build.mjs`, `06-process/prompts.md`, `README.md`
- Modify: `06-process/PROCESS.md`

**Interfaces:**
- Consumes: `buildLogos` (Task 5), `buildMascot` (Task 7), `buildBoard` (Task 10).

- [ ] **Step 1: `src/build.mjs`**

```js
import { execFileSync } from 'node:child_process';
import { buildLogos } from './logo.mjs';
import { buildMascot } from './mascot.mjs';
import { buildBoard } from './board.mjs';

const files = [...buildLogos(), ...buildMascot(), ...buildBoard()];
execFileSync('python', ['-I', 'src/gif.py'], { stdio: 'inherit' });
console.log(`build xong: ${files.length} file + GIF`);
```

- [ ] **Step 2: Kiểm tra tái tạo trên thư mục sạch**

```bash
rm -rf "$TEMP/nghe-clean" && git clone -q . "$TEMP/nghe-clean" && cd "$TEMP/nghe-clean" && npm install --silent && npm run fonts && npm test && npm run build
```
Expected: test PASS, dòng `build xong: N file + GIF` với N = 32 (logo) + số của Task 7 (22–23) + 7 (board: brand-board.svg + 6 PNG). Sau đó `git status --porcelain` trong thư mục sạch phải rỗng hoặc chỉ khác byte PNG — không thiếu/thừa file so với repo.

- [ ] **Step 3: `06-process/prompts.md`** — "Bộ prompt làm brand cho chính bạn bằng Agent": 8 prompt chính đã dùng thực tế, viết lại dạng điền chỗ trống `[tên cộng đồng]`, `[con vật/nhân vật]`… theo thứ tự: research đề bài → chốt concept qua phỏng vấn → phác 3 logo → bộ logo → mascot + character sheet → sticker → DESIGN.md + lint → brand board. Mỗi prompt kèm 1 dòng "mẹo" (vd: "bắt Agent chuyển chữ thành path để SVG không lỗi font").
- [ ] **Step 4: `06-process/PROCESS.md`** — hoàn chỉnh: Agent dùng (Claude Code), từng bước (Agent làm gì / mình quyết gì / prompt), danh sách ảnh chụp trong `screenshots/`, link brief + spec + plan, thời gian thực tế mỗi ngày.
- [ ] **Step 5: `README.md`** (trang chính GitHub Pages, đọc tốt trên điện thoại): ảnh poster đầu trang, slogan, mục lục 6 hạng mục trỏ tới thư mục, ảnh brand board, bảng màu, font, link `06-process/prompts.md` ("Copy về làm brand cho chính bạn"), tác giả, giấy phép ("Bản quyền thiết kế thuộc tác giả; group Đi làm với AI được dùng theo thể lệ minigame. Font: SIL OFL.").
- [ ] **Step 6: Commit**

```bash
git add src/build.mjs 06-process README.md && git commit -m "docs: one-command build, process log, reusable prompts, README"
```

---

### Task 14: Kiểm tra luật + giám khảo (CỔNG DUYỆT)

**Files:**
- Create: `src/check_submission.py`, `06-process/review.md`

- [ ] **Step 1: `src/check_submission.py`**

```python
"""Kiểm tra bài dự thi theo các lý do bị loại trong thể lệ. Exit 1 nếu có lỗi chặn."""
import pathlib, re, sys
from PIL import Image

ROOT = pathlib.Path(".")
errors: list[str] = []

def need(path: str) -> pathlib.Path:
    p = ROOT / path
    if not p.exists():
        errors.append(f"Thiếu: {path}")
    return p

def transparent_png(path: str) -> None:
    p = need(path)
    if p.exists():
        im = Image.open(p)
        if im.mode != "RGBA" or im.getpixel((0, 0))[3] != 0:
            errors.append(f"PNG không trong suốt ở góc: {path}")

for name in ("logo-ngang", "logo-doc"):
    svg = need(f"01-logo/svg/{name}.svg")
    if svg.exists() and "<text" in svg.read_text(encoding="utf-8"):
        errors.append(f"SVG còn thẻ <text> (chưa chuyển path): {svg}")
    transparent_png(f"01-logo/png/{name}-1024.png")

slogan = need("02-slogan/slogan.md")
if slogan.exists() and "AI làm việc, mình làm chủ." not in slogan.read_text(encoding="utf-8"):
    errors.append("Slogan sai/thiếu trong 02-slogan/slogan.md")

transparent_png("03-mascot/png/nghe-nghe-1024.png")

fonts = need("04-font/fonts.md")
if fonts.exists():
    t = fonts.read_text(encoding="utf-8")
    for f in ("Bricolage Grotesque", "Be Vietnam Pro", "fonts.google.com", "Open Font License"):
        if f not in t:
            errors.append(f"04-font/fonts.md thiếu '{f}'")

voice = need("05-brand-voice/brand-voice.md")
if voice.exists() and len(re.findall(r"^\s*[-*] \*\*", voice.read_text(encoding="utf-8"), re.M)) < 3:
    errors.append("Brand voice cần ≥ 3 câu mẫu có nhãn (dạng '- **Nhãn:** câu')")

design = need("DESIGN.md")
if design.exists():
    t = design.read_text(encoding="utf-8")
    for key in ("colors:", "typography:", "spacing:", "rounded:", "## Do's and Don'ts"):
        if key not in t:
            errors.append(f"DESIGN.md thiếu '{key}'")

shots = list((ROOT / "06-process/screenshots").glob("*.png")) if (ROOT / "06-process/screenshots").exists() else []
if len(shots) < 2:
    errors.append(f"Cần ≥ 2 ảnh chụp quá trình, đang có {len(shots)}")
need("06-process/PROCESS.md")
need("board/brand-board.png")

if errors:
    print("CHẶN ĐĂNG:\n- " + "\n- ".join(errors))
    sys.exit(1)
print("OK: đủ 6 hạng mục + bằng chứng.")
```

- [ ] **Step 2: Chạy** — Run: `python -I src/check_submission.py` — Expected: `OK: đủ 6 hạng mục + bằng chứng.` Có lỗi → sửa rồi chạy lại. (Trước khi người dùng nộp ảnh chụp, lỗi "Cần ≥ 2 ảnh" là đúng — nhắc người dùng.)
- [ ] **Step 3: Giám khảo subagent** — dispatch subagent `general-purpose` với prompt: "Bạn là giám khảo khó tính của minigame BRAND NÀY AI LÀM. Đọc thể lệ tóm tắt ở RESEARCH.md mục 1, rồi đọc toàn bộ repo D:/Claude/Challenge/BrandNayAiLam (xem ảnh PNG bằng Read). Trả về 2 danh sách: (A) LỖI LUẬT có thể khiến bài bị loại — thiếu hạng mục, file không mở được, nhân vật giống thương hiệu khác, font sai điều kiện, nội dung vi phạm; (B) GÓP Ý thẩm mỹ và khả năng được share, tối đa 7 ý, xếp theo tác động. Không sửa file." Ghi kết quả vào `06-process/review.md`. Danh sách (A) không rỗng → sửa và chạy vòng 2 (tối đa 2 vòng). (B) chỉ trình người dùng.
- [ ] **Step 4: CỔNG DUYỆT CUỐI** — trình người dùng: brand board, logo ngang/dọc, Nghé + 6 sticker, poster bìa (3D hoặc phẳng), slogan, góp ý (B). Nhắc: **sau khi đăng không sửa được logo/slogan/mascot**. Chỉ đi tiếp khi người dùng nói rõ "duyệt". Nếu 21:00 28/10 chưa duyệt → báo dời đăng sang 29–30/10.
- [ ] **Step 5: Commit**

```bash
git add src/check_submission.py 06-process/review.md && git commit -m "chore: submission rule checker and judge review"
```

---

### Task 15: Công khai — GitHub + Pages + gói Drive (CỔNG DUYỆT)

**Files:**
- Create: `dist/brand-nay-ai-lam.zip` (không commit; thêm `dist/` vào `.gitignore`)

- [ ] **Step 1: Hỏi người dùng đồng ý** tạo repo **public** `DKayden/brand-nay-ai-lam` và bật GitHub Pages. Không chạy bước 2 khi chưa có "đồng ý".
- [ ] **Step 2: Tạo repo + push**

```bash
gh repo create DKayden/brand-nay-ai-lam --public --source=. --remote=origin --push --description "Bộ nhận diện 'Nghé' cho group Đi làm với AI — #BrandNayAiLam, làm bằng Claude Code"
gh api -X POST repos/DKayden/brand-nay-ai-lam/pages -f "source[branch]=main" -f "source[path]=/"
```
Expected: URL repo; Pages trả 201. Chờ build Pages, rồi kiểm `curl -s -o /dev/null -w "%{http_code}" https://dkayden.github.io/brand-nay-ai-lam/` → `200`, và mở link repo ở chế độ chưa đăng nhập (Browser pane) để chắc chắn ai có link cũng xem được.
- [ ] **Step 3: Gói Drive** — Run (PowerShell): `Compress-Archive -Path 01-logo,02-slogan,03-mascot,04-font,05-brand-voice,06-process,board,DESIGN.md,README.md -DestinationPath dist/brand-nay-ai-lam.zip -Force`. Nhờ người dùng tự tải zip lên một thư mục Drive (giải nén trên Drive) và đặt "Bất kỳ ai có link đều xem được", gửi lại link. (Không upload qua MCP — tránh chép base64.)
- [ ] **Step 4: Ghi link** vào `README.md` (mục "Bản sao Google Drive") → commit + push.

```bash
git add README.md .gitignore && git commit -m "docs: add Drive mirror link" && git push
```

---

### Task 16: Bài đăng + kế hoạch sau đăng

**Files:**
- Create: `post.md`

- [ ] **Step 1: Soạn `post.md`** đúng mẫu BTC, rồi đến phần mở rộng:

```markdown
#BrandNayAiLam - Nghé: nhân sự AI mới của Đi làm với AI

Slogan: AI làm việc, mình làm chủ.
AI Agent đã dùng: Claude Code

Ý tưởng: 📣 Thông báo nhân sự: group mình chính thức chào đón Nghé — một chú trâu con vừa nhận thẻ "Nhân sự AI". Người Việt hay gọi đi làm là "đi cày", và trâu là bạn cày giỏi nhất; còn "Nghé" thì đọc gần "nghe": giao việc rõ ràng là Nghé nghe liền. Bộ nhận diện ấm như ly cà phê sữa đá buổi sáng: cam đất, kem, nâu cà phê. Thông điệp: AI gánh việc lặp lại, mình giữ quyền làm chủ.

Cách mình làm: Mình không biết vẽ, nên mình làm "sếp" giao việc cho Claude Code. Agent đọc thể lệ, phỏng vấn mình để chốt concept, phác 3 hướng logo cho mình chọn, rồi tự vẽ Nghé bằng code SVG, sinh 6 sticker, viết DESIGN.md và tự kiểm tra bằng công cụ lint của Google. Mình chỉ duyệt và chỉnh. Toàn bộ prompt mình để trong repo, ai cũng copy về làm brand cho cộng đồng của mình được.

Link file đầy đủ: [link GitHub Pages] · Bản Drive: [link Drive]

Ngày đầu đi làm, cả nhà sẽ giao việc gì cho Nghé? Comment một việc, Nghé nghe hết! 🐃
Thấy bộ prompt có ích thì cả nhà cứ share về tường để lưu nha.
```
Thay 2 link thật. Kiểm: không có câu nào gắn quà với hành động share/comment.

- [ ] **Step 2: Danh sách ảnh đính kèm theo thứ tự** (ghi cuối `post.md`): 1 poster bìa (`03-mascot/nghe-3d-poster.png` hoặc `board/poster-nghe-phang.png`) · 2 `board/brand-board.png` · 3 `01-logo/png/logo-ngang-2048.png` · 4 `01-logo/png/logo-doc-2048.png` · 5 `03-mascot/stickers-sheet.png` · 6 `03-mascot/png/y-sep-la-1024.png` (meme) · 7–8 hai ảnh trong `06-process/screenshots/`. GIF `board/nghe-xong-roi-sep.gif` để bình luận đầu tiên.
- [ ] **Step 3: Người dùng tự đăng** vào group (Agent không đăng thay). Ghi giờ đăng và giờ được duyệt vào `06-process/PROCESS.md`.
- [ ] **Step 4: Sau đăng** (ghi trong `post.md` mục "Kế hoạch sau đăng"):
  - Trả lời mọi bình luận bằng sticker Nghé + 1 câu giọng Nghé (mẫu ở brand-voice.md).
  - Ngày duyệt: share lên tường cá nhân kèm 2–3 câu hậu trường + link repo; nhắn riêng < 10 người thân mời share tự nguyện.
  - **Mốc kiểm ngày thứ 3 sau duyệt:** điểm = reaction + 2×bình luận hợp lệ + 3×share. Dưới 100 → bổ sung trong chính bài: bình luận GIF, ảnh meme "Ơ… ý sếp là?" mới, ảnh hậu trường. Không đăng bài riêng, không xin bình chọn dưới bài người khác.
  - Không sửa logo/slogan/mascot trong bài (chỉ chính tả). Repo không xoá/đổi tên đến hết 10/11/2026.
- [ ] **Step 5: Commit**

```bash
git add post.md 06-process/PROCESS.md && git commit -m "docs: contest post and post-launch plan" && git push
```
