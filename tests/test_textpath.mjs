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
