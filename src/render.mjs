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
