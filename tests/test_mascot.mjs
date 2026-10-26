import test from 'node:test';
import assert from 'node:assert/strict';
import { part, pose, POSES, characterSheet, compose, arm, legs, ARM, limb, mirror, wrap, sparks, sideX } from '../src/mascot.mjs';
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

test('tư thế chưa làm báo "not implemented", tên lạ báo lỗi', () => {
  assert.throws(() => pose('dang-chay'), /not implemented in Task 6/);
  assert.throws(() => pose('khong-co'), /Không có tư thế/);
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
