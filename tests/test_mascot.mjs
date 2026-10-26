import test from 'node:test';
import assert from 'node:assert/strict';
import { part, pose, POSES, characterSheet } from '../src/mascot.mjs';
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

test('part.head hỗ trợ đủ mắt và miệng, báo lỗi giá trị lạ', () => {
  for (const eyes of ['open', 'happy', 'sleepy', 'confused']) {
    for (const mouth of ['smile', 'open', 'o']) assert.match(part.head({ eyes, mouth }), /<ellipse/);
  }
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
