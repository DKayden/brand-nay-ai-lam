import test from 'node:test';
import assert from 'node:assert/strict';
import { Resvg } from '@resvg/resvg-js';
import { icon, variants, PALETTES, CHEVRON, ngangBaseline } from '../src/logo.mjs';
import { COLORS } from '../src/tokens.mjs';

const colorsIn = (svg) => new Set([...svg.matchAll(/(?:fill|stroke)="([^"]+)"/g)].map((m) => m[1]));
const PALETTE_HEX = new Set([...Object.values(COLORS), '#FFFFFF', 'none']);

test('đủ 8 biến thể, mọi chữ là path (không <text>)', () => {
  const v = variants();
  assert.deepEqual(Object.keys(v).sort(), [
    'icon', 'icon-avatar', 'logo-doc', 'logo-doc-nen-toi', 'logo-ngang',
    'logo-ngang-mono-navy', 'logo-ngang-mono-trang', 'logo-ngang-nen-toi',
  ]);
  for (const [name, s] of Object.entries(v)) assert.ok(!s.includes('<text'), name);
});

test('mọi màu nhìn thấy đều thuộc palette (mask đen/trắng không tính)', () => {
  for (const [name, s] of Object.entries(variants())) {
    for (const c of colorsIn(s.replace(/<mask[\s\S]*?<\/mask>/g, ''))) assert.ok(PALETTE_HEX.has(c), `${name}: ${c}`);
  }
});

test('icon chỉ lấy màu từ palette truyền vào', () => {
  const p = { outline: '#000001', collar: '#000002', tie: '#000003', tag: '#000004', prompt: '#000005' };
  for (const c of colorsIn(icon(p))) assert.ok(c === 'none' || Object.values(p).includes(c), c);
});

test('biểu tượng A2: có dấu nhắc lệnh, không sừng, không màu sừng, không chữ AI trong icon', () => {
  const v = variants();
  for (const name of ['icon', 'icon-avatar']) {
    assert.ok(v[name].includes(`d="${CHEVRON}"`), `${name}: dấu nhắc ">"`);
    assert.ok(!v[name].includes(`fill="${COLORS.horn}"`), `${name}: không màu sừng`);
    assert.doesNotMatch(v[name], / C /, `${name}: không đường cong bezier kiểu sừng`);
    // icon không có chữ: chỉ có path hình học ngắn (chữ textPath có path dài nhiều lệnh)
    for (const [, d] of v[name].matchAll(/<path d="([^"]+)"/g)) assert.ok(d.length < 60, `${name}: path lạ ${d.slice(0, 40)}`);
  }
  for (const [name, s] of Object.entries(v)) {
    assert.ok(s.includes(`d="${CHEVRON}"`), `${name}: dấu nhắc lệnh`);
    assert.ok(!s.includes(`fill="${COLORS.horn}"`), `${name}: không sừng`);
  }
});

test('bản mono đục thủng bằng mask, chỉ một màu mực nhìn thấy', () => {
  for (const [name, ink] of [['logo-ngang-mono-navy', COLORS.text], ['logo-ngang-mono-trang', '#FFFFFF']]) {
    const s = variants()[name];
    assert.match(s, /<mask /);
    assert.match(s, /mask="url\(#/);
    const visible = [...colorsIn(s.replace(/<mask[\s\S]*?<\/mask>/g, ''))].filter((c) => c !== 'none');
    assert.deepEqual(visible, [ink], name);
    // id mask không trùng trong một tài liệu
    const ids = [...s.matchAll(/<mask id="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${name}: id mask trùng`);
  }
});

test('nền tối: chữ dẫn trắng, "AI" navy trên viên thuốc pastel', () => {
  const s = variants()['logo-ngang-nen-toi'];
  assert.equal(PALETTES['nen-toi'].pill, COLORS['primary-soft']);
  assert.equal(PALETTES['nen-toi'].accent, COLORS.text);
  assert.ok(s.includes(`fill="${COLORS['primary-soft']}"`));
  assert.ok(s.includes(`fill="${COLORS['dark-bg']}"`));
  assert.ok(s.includes(`fill="${COLORS.background}"`));
});

// Render từng biến thể (nền trong suốt) và kiểm mép ngoài 2px không có mực → không bị cắt.
test('lockup và icon không bị cắt mép (mực cách mép ≥ 2px)', () => {
  for (const [name, s] of Object.entries(variants())) {
    if (name.includes('nen-toi') || name === 'icon-avatar') continue; // có nền phủ kín
    const img = new Resvg(s).render();
    const { width: w, height: h, pixels } = img;
    const alpha = (x, y) => pixels[(y * w + x) * 4 + 3];
    let edge = 0;
    for (let x = 0; x < w; x++) for (const y of [0, 1, h - 2, h - 1]) if (alpha(x, y) > 0) edge++;
    for (let y = 0; y < h; y++) for (const x of [0, 1, w - 2, w - 1]) if (alpha(x, y) > 0) edge++;
    assert.equal(edge, 0, `${name}: ${edge} điểm mực sát mép`);
  }
});

test('chân chữ wordmark bản ngang nằm trong khung và cao hơn đáy cà vạt', () => {
  const s = variants()['logo-ngang'];
  const vh = Number(s.match(/viewBox="0 0 [\d.]+ ([\d.]+)"/)[1]);
  const b = ngangBaseline();
  assert.ok(b > 0 && b < vh - 40, `baseline ${b} / ${vh}`);
});
