import test from 'node:test';
import assert from 'node:assert/strict';
import { COLORS, contrast } from '../src/tokens.mjs';

test('contrast đúng công thức WCAG', () => {
  assert.equal(contrast('#000000', '#FFFFFF').toFixed(1), '21.0');
});

const PAIRS = [
  ['text', 'background'], ['text', 'surface'], ['text-muted', 'background'],
  ['primary', 'background'], ['background', 'primary'], ['background', 'dark-bg'],
  ['primary-soft', 'dark-bg'], ['text', 'primary-soft'], ['primary', 'surface'],
  ['primary', 'primary-soft'],
];
for (const [fg, bg] of PAIRS) {
  test(`${fg} trên ${bg} ≥ 4.5`, () => {
    assert.ok(contrast(COLORS[fg], COLORS[bg]) >= 4.5,
      `${fg}/${bg} = ${contrast(COLORS[fg], COLORS[bg]).toFixed(2)}`);
  });
}
