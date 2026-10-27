// So sánh bản gốc (trái) với v2 (phải): logo ngang, icon @32px, mascot. Chạy: node v2/src/compare.mjs
import fs from 'node:fs';
import { renderPng } from '../../src/render.mjs';
import { textPath } from '../../src/textpath.mjs';

const href = (f) => `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`;
const L = { family: 'Be Vietnam Pro', weight: 600, size: 22, fill: '#4F6B8A' };
const W = 1800, H = 1500;
let b = `<rect width="${W}" height="${H}" fill="#F7FAFD"/>`;
const col = (x, dir, tag) => {
  b += textPath(tag, { ...L, x: x + 20, y: 40 }).svg;
  b += `<image href="${href(`${dir}01-logo/png/logo-ngang-1024.png`)}" x="${x}" y="60" width="860" height="${860 * 0.355}"/>`;
  b += `<rect x="${x}" y="380" width="860" height="170" rx="16" fill="#13243B"/>`;
  b += `<image href="${href(`${dir}01-logo/png/logo-ngang-nen-toi-1024.png`)}" x="${x + 20}" y="392" width="400" height="${400 * 0.355 * 1.2}"/>`;
  b += `<image href="${href(`${dir}01-logo/png/icon-512.png`)}" x="${x + 560}" y="400" width="32" height="32"/>`;
  b += `<image href="${href(`${dir}01-logo/png/icon-512.png`)}" x="${x + 620}" y="400" width="64" height="64"/>`;
  b += textPath('icon 32 / 64px', { ...L, size: 16, x: x + 560, y: 500, fill: '#B8D8F5' }).svg;
  b += `<image href="${href(`${dir}03-mascot/png/nghe-nghe-1024.png`)}" x="${x + 130}" y="570" width="600" height="600"/>`;
  b += `<image href="${href(`${dir}03-mascot/png/dang-chay-512.png`)}" x="${x + 30}" y="1170" width="300" height="300"/>`;
  b += `<image href="${href(`${dir}03-mascot/png/xong-roi-sep-512.png`)}" x="${x + 520}" y="1170" width="300" height="300"/>`;
};
col(30, '', 'GỐC');
col(910, 'v2/', 'V2');
fs.writeFileSync('v2/so-sanh.png', renderPng(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${b}</svg>`, W));
console.log('+ v2/so-sanh.png');
