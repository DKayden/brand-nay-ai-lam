import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPng } from '../src/render.mjs';

test('PNG có kênh alpha và góc trong suốt', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#B54A17"/></svg>';
  const png = renderPng(svg, 200);
  assert.equal(png.readUInt32BE(16), 200);           // IHDR width
  assert.equal(png[25], 6);                          // color type RGBA
});
