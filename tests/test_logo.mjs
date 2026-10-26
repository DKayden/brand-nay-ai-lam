import test from 'node:test';
import assert from 'node:assert/strict';
import { icon, variants, PALETTES } from '../src/logo.mjs';
import { COLORS } from '../src/tokens.mjs';

const colorsIn = (svg) => new Set([...svg.matchAll(/(?:fill|stroke)="([^"]+)"/g)].map((m) => m[1]));

test('đủ 8 biến thể, mọi chữ là path', () => {
  const v = variants();
  assert.deepEqual(Object.keys(v).sort(), [
    'icon', 'icon-avatar', 'logo-doc', 'logo-doc-nen-toi', 'logo-ngang',
    'logo-ngang-mono-nau', 'logo-ngang-mono-trang', 'logo-ngang-nen-toi',
  ]);
  for (const [name, s] of Object.entries(v)) assert.ok(!s.includes('<text'), name);
});

test('icon chỉ lấy màu từ palette truyền vào', () => {
  const p = { outline: '#000001', card: '#000002', face: '#000003', horn: '#000004', strap: '#000005', clip: '#000006' };
  for (const face of ['ai', 'smile']) {
    const used = colorsIn(icon(p, { face }));
    for (const c of used) assert.ok(c === 'none' || Object.values(p).includes(c), `${face}: ${c}`);
  }
});

test('bản mono đục thủng mặt thẻ bằng mask, chỉ một màu mực', () => {
  const s = variants()['logo-ngang-mono-nau'];
  assert.match(s, /<mask /);
  assert.match(s, /mask="url\(#/);
  const visible = colorsIn(s.replace(/<mask[\s\S]*?<\/mask>/g, ''));
  assert.deepEqual([...visible].filter((c) => c !== 'none'), [COLORS.text]);
});

test('nền tối: "AI" dùng primary-soft, chữ dẫn màu kem', () => {
  const s = variants()['logo-ngang-nen-toi'];
  assert.equal(PALETTES['nen-toi'].accent, COLORS['primary-soft']);
  assert.ok(s.includes(`fill="${COLORS['primary-soft']}"`));
  assert.ok(s.includes(`fill="${COLORS['dark-bg']}"`));
});

test('lockup dùng mặt cười, icon đứng riêng dùng chữ AI', () => {
  const v = variants();
  assert.match(v['logo-ngang'], /<circle /);
  assert.match(v['logo-doc'], /<circle /);
  assert.doesNotMatch(v.icon, /<circle /);
  assert.doesNotMatch(v['icon-avatar'], /<circle /);
});
