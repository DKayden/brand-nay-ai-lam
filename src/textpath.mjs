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
