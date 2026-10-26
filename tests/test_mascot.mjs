import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { part, pose, POSES, characterSheet, stickersSheet, buildMascot, compose, arm, legs, ARM, limb, mirror, wrap, sparks, sideX, BADGE_TEXT_BOX, CHAO_SIGN } from '../src/mascot.mjs';
import { measure } from '../src/textpath.mjs';
import { COLORS } from '../src/tokens.mjs';

test('POSES đúng 6 tên theo kế hoạch', () => {
  assert.deepEqual(POSES, ['nghe-nghe', 'dang-chay', 'xong-roi-sep', 'y-sep-la', 'ca-phe-sang', 'chao-member-moi']);
});

test('nghe-nghe: khung 512, không nền, không <text>, đủ đặc điểm khoá', () => {
  const s = pose('nghe-nghe');
  assert.match(s, /viewBox="0 0 512 512"/);
  assert.doesNotMatch(s, /<text/);
  assert.doesNotMatch(s, /<rect width="512" height="512"/);
  assert.ok(s.includes(`stroke="${COLORS.text}" stroke-width="6"`), 'viền 6px nâu');
  for (const c of [COLORS.horn, COLORS.nose, COLORS.cheek, COLORS.buffalo, COLORS.primary]) {
    assert.ok(s.includes(`fill="${c}"`), c);
  }
});

test('part.head hỗ trợ đủ mắt và miệng, mỗi biểu cảm ra hình khác nhau, báo lỗi giá trị lạ', () => {
  const seen = new Set();
  for (const eyes of ['open', 'happy', 'sleepy', 'confused']) {
    for (const mouth of ['smile', 'open', 'o']) {
      const s = part.head({ eyes, mouth });
      assert.match(s, /<ellipse/);
      seen.add(s);
    }
  }
  assert.equal(seen.size, 12, '4 mắt × 3 miệng phải ra 12 SVG khác nhau');
  assert.throws(() => part.head({ eyes: 'wink' }));
  assert.throws(() => part.head({ mouth: 'grin' }));
});

test('armUp/armDown đối xứng theo side', () => {
  assert.notEqual(part.armUp('left'), part.armUp('right'));
  assert.notEqual(part.armDown('left'), part.armDown('right'));
});

test('tên tư thế lạ báo lỗi', () => {
  assert.throws(() => pose('khong-co'), /Không có tư thế/);
});

test('mọi tư thế: svg khung 512, không <text>, giữ đủ đặc điểm khoá, khác nhau', () => {
  const seen = new Set();
  for (const name of POSES) {
    const s = pose(name);
    assert.match(s, /^<svg[^>]*viewBox="0 0 512 512"/, name);
    assert.doesNotMatch(s, /<text/, name);
    for (const cls of ['horns', 'ears', 'head', 'body', 'badge']) assert.ok(s.includes(`class="${cls}"`), `${name}: ${cls}`);
    for (const c of [COLORS.horn, COLORS.nose, COLORS.buffalo, COLORS.primary]) assert.ok(s.includes(`fill="${c}"`), `${name}: ${c}`);
    seen.add(s);
  }
  assert.equal(seen.size, POSES.length);
});

test('đạo cụ theo brief từng tư thế', () => {
  const lap = pose('dang-chay');
  assert.ok(lap.includes('class="laptop"') && lap.includes(`fill="${COLORS.surface}"`), 'laptop nắp kem');
  assert.ok(lap.indexOf('class="laptop"') < lap.indexOf(`fill="${COLORS.horn}"`, lap.indexOf('class="laptop"')), 'icon thẻ mọc sừng trên nắp');
  assert.match(lap, /class="typing"/, 'bong bóng đang gõ');
  assert.match(pose('xong-roi-sep'), /class="thumbs-up"/);
  assert.equal((pose('xong-roi-sep').match(new RegExp(`fill="${COLORS['primary-soft']}" stroke`, 'g')) || []).length, 3, '3 tia lấp lánh');
  assert.match(pose('y-sep-la'), /rotate\(-8 256 200\)/);
  const cafe = pose('ca-phe-sang');
  for (const c of ['#6B4226', '#E8CFA8']) assert.ok(cafe.includes(`fill="${c}"`), c);
  assert.equal((cafe.match(/<rect[^>]*fill="#fff"[^>]*stroke/g) || []).length, 3, '3 viên đá');
  assert.ok(cafe.includes(`stroke="${COLORS.primary}"`), 'ống hút');
  assert.match(pose('chao-member-moi'), /class="sign"/);
});

test('nghe-nghe giữ nguyên bản đã duyệt', () => {
  assert.equal(pose('nghe-nghe'), fs.readFileSync(new URL('../03-mascot/svg/nghe-nghe.svg', import.meta.url), 'utf8'));
});

// Thẻ "Nghé · Nhân sự AI" là đặc điểm khoá: render từng tư thế và so vùng chữ trên thẻ
// với bản nghe-nghe (thẻ không bị che). Tư thế nhích cả nhân vật (dang-chay) thì dời vùng so theo.
test('mọi tư thế: không đạo cụ/tay nào che vùng chữ trên thẻ', () => {
  const rgba = (svg) => new Resvg(svg, { fitTo: { mode: 'width', value: 512 } }).render().pixels;
  const ref = rgba(pose('nghe-nghe'));
  const { x1, y1, x2, y2 } = BADGE_TEXT_BOX;
  for (const name of POSES) {
    const s = pose(name);
    const dy = -(Number(/^<svg[^>]*><g transform="translate\(0 (-?\d+)\)">/.exec(s)?.[1]) || 0);
    const px = rgba(s);
    let diff = 0;
    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        const a = (y * 512 + x) * 4, b = ((y - dy) * 512 + x) * 4;
        if (Math.max(...[0, 1, 2, 3].map((k) => Math.abs(ref[a + k] - px[b + k]))) > 8) diff++;
      }
    }
    assert.equal(diff, 0, `${name}: ${diff} điểm ảnh trong vùng chữ thẻ khác bản gốc (bị che)`);
  }
});

test('stickers sheet: lưới 6 ô, chữ là path', () => {
  const s = stickersSheet();
  assert.match(s, /viewBox="0 0 1600 1160"/);
  assert.doesNotMatch(s, /<text/);
  assert.equal((s.match(/class="badge"/g) || []).length, 6);
});

test('buildMascot ghi 23 tệp (6 SVG, 13 PNG, 2 sheet × SVG/PNG)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nghe-'));
  try {
    const out = buildMascot(dir);
    assert.equal(out.length, 23);
    for (const f of out) assert.ok(fs.statSync(f).size > 0, f);
    assert.ok(out.includes(`${dir}/png/nghe-nghe-2048.png`));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('character sheet 1600×1000, mọi chữ là path', () => {
  const s = characterSheet();
  assert.match(s, /viewBox="0 0 1600 1000"/);
  assert.doesNotMatch(s, /<text/);
});

test('compose: nghe-nghe dựng qua compose, khung 512', () => {
  const s = pose('nghe-nghe');
  assert.equal(typeof s, 'string');
  assert.match(s, /^<svg[^>]*viewBox="0 0 512 512"/);
  const c = compose({ head: { eyes: 'happy', mouth: 'smile', transform: 'rotate(-8 256 200)' }, armL: false, armR: { angle: 150, front: true }, legs: { stance: 'wide' }, under: '<g id="u"/>', extras: '<g id="x"/>' });
  assert.match(c, /viewBox="0 0 512 512"/);
  assert.doesNotMatch(c, /<text/);
  assert.ok(c.indexOf('id="u"') < c.indexOf('class="arm-right"'), 'under nằm sau tay trước');
  assert.ok(c.indexOf('class="arm-right"') < c.indexOf('class="head"'), 'tay trước nằm dưới đầu');
  assert.ok(c.trimEnd().endsWith('<g id="x"/></svg>'), 'extras trên cùng');
  assert.equal((c.match(/rotate\(-8 256 200\)/g) || []).length, 2, 'transform áp cho sừng/tai và đầu');
  assert.doesNotMatch(c, /class="arm-left"/);
});

test('arm tham số theo angle/to, legs theo stance, helper xuất ra đủ', () => {
  assert.notEqual(arm('left', { angle: 10 }), arm('left', { angle: 120 }));
  assert.notEqual(arm('left', ARM.raised), arm('right', ARM.raised));
  assert.match(arm('right', { to: [120, 300], ctrl: [160, 330] }), /class="arm-right"/);
  assert.notEqual(legs({ stance: 'stand' }), legs({ stance: 'wide' }));
  assert.throws(() => legs({ stance: 'fly' }));
  assert.equal(sideX('right', 100), 412);
  assert.equal(sideX('left', 100), 100);
  assert.match(mirror('<g/>'), /scale\(-1 1\)/);
  assert.match(wrap(''), /viewBox="0 0 512 512"/);
  assert.match(sparks(10, 10), /<path/);
  assert.match(limb(0, 0, 10, 10, 20, 20), /<path/);
});

test('ARM.down: tay buông cùng dày với tay giơ, render được hai phía', () => {
  assert.match(arm('left', ARM.down), /class="arm-left"/);
  assert.notEqual(arm('left', ARM.down), arm('right', ARM.down));
  // Không preset nào tự đặt bề dày/móng → cả hai dùng mặc định của arm(); nét vẽ ra phải cùng bộ stroke-width.
  for (const p of [ARM.down, ARM.raised]) assert.ok(!('w' in p) && !('hoof' in p));
  const widths = (s) => [...s.matchAll(/stroke-width="([\d.]+)"/g)].map((m) => m[1]).join(',');
  assert.equal(widths(arm('left', ARM.down)), widths(arm('left', ARM.raised)));
  assert.equal(ARM.tucked, undefined);
  assert.ok(pose('nghe-nghe').includes(arm('left', ARM.down)), 'nghe-nghe dùng ARM.down cho tay trái');
});

test('chao-member-moi: móng tay trái nằm ngoài vùng chữ trên bảng, bảng cách đáy khung ≥ 16px', () => {
  const { text, textX, top, h, hoof: [hx, hy] } = CHAO_SIGN;
  const width = measure(text, { family: 'Be Vietnam Pro', weight: 600, size: 38 });
  const HOOF_R = 26; // bán kính móng + viền, dư an toàn
  const box = { x1: textX - width / 2, x2: textX + width / 2, y1: top + h / 2 + 14 - 38, y2: top + h / 2 + 14 + 10 };
  const overlaps = hx + HOOF_R > box.x1 && hx - HOOF_R < box.x2 && hy + HOOF_R > box.y1 && hy - HOOF_R < box.y2;
  assert.ok(!overlaps, 'móng không chạm bbox chữ ' + JSON.stringify(box));
  assert.ok(hx - HOOF_R >= CHAO_SIGN.cx - CHAO_SIGN.w / 2 - 40 && hx < box.x1, 'móng ở đầu trái bảng');
  assert.ok(512 - (top + h + 12) >= 16, 'đáy bảng (nghiêng) cách đáy khung ≥ 16px');
});
