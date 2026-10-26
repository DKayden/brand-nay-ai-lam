// Mascot Nghé — nghé (trâu con) Việt, "nhân sự AI" của group. Chibi tròn mềm, viền navy đều.
// Mọi bộ phận vẽ trong khung 512×512, nét viền 6px màu COLORS.text.
// Chạy: node src/mascot.mjs → 03-mascot/svg/*.svg, 03-mascot/png/*, 03-mascot/character-sheet.{svg,png}
import fs from 'node:fs';
import path from 'node:path';
import { COLORS } from './tokens.mjs';
import { textPath } from './textpath.mjs';
import { renderSizes, renderPng } from './render.mjs';
import { icon, PALETTES, INK_BOX } from './logo.mjs';

const INK = COLORS.text;
const SW = 6;
const LINE = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"`;
export const MASCOT_COLORS = {
  buffalo: COLORS.buffalo, // thân
  belly: '#A99A8F', // bụng, mõm dưới sáng hơn thân
  horn: COLORS.horn,
  nose: COLORS.nose,
  cheek: COLORS.cheek,
  ink: INK,
  badge: COLORS['primary-soft'], // thẻ xanh pastel, chữ navy (7.75)
  strap: COLORS.primary,
};
const C = MASCOT_COLORS;

// Hình học chính (khung 512). Đầu to ~55% chiều cao nhân vật, thân bé.
const HEAD = { cx: 256, cy: 196, rx: 150, ry: 124 };
const EYE = { dx: 64, y: 180, r: 23 };
const MUZZLE = { cx: 256, top: 226, bottom: 302, half: 92 };
const BODY = { x: 186, y: 300, w: 140, h: 146, rx: 62 };
const CARD = { cx: 256, top: 350, w: 76, h: 86, rx: 13 };
// Vùng chữ "Nghé · Nhân sự AI" trên thẻ (khung 512): đạo cụ không được che vùng này.
export const BADGE_TEXT_BOX = { x1: CARD.cx - 34, y1: CARD.top + 28, x2: CARD.cx + 34, y2: CARD.top + 74 };

const mirror = (svg) => `<g transform="translate(512 0) scale(-1 1)">${svg}</g>`;

// Sừng trâu nước của Nghé (logo A2 từ 26/10 không còn sừng; hình học sừng giữ nguyên tại đây), phóng k lần:
// thân dày quét ngang ra ngoài rồi vút lên thành lưỡi liềm, chóp quặp vào.
const hornLeft = (rx, ry, kx, ky = kx) => {
  const p = (dx, dy) => `${rx + dx * kx} ${ry + dy * ky}`;
  return `M ${p(0, -2)}`
    + ` C ${p(-28, -2)} ${p(-48, -12)} ${p(-40, -48)}`
    + ` C ${p(-60, -32)} ${p(-66, 14)} ${p(-34, 28)}`
    + ` C ${p(-22, 30)} ${p(-10, 30)} ${p(4, 30)} Z`;
};

function horns() {
  const one = `<path d="${hornLeft(160, 108, 1.75, 1.2)}" fill="${C.horn}" ${LINE}/>`;
  return `<g class="horns">${one}${mirror(one)}</g>`;
}

// Tai cụp ngang hai bên (trâu: tai to, chĩa ngang, đầu tai hơi rủ).
function ears() {
  const one = `<g transform="translate(112 170) rotate(-22)">`
    + `<ellipse cx="-30" cy="0" rx="44" ry="23" fill="${C.buffalo}" ${LINE}/>`
    + `<ellipse cx="-34" cy="2" rx="27" ry="11" fill="${C.cheek}"/></g>`;
  return `<g class="ears">${one}${mirror(one)}</g>`;
}

const EYES = {
  open: (x, y) => `<circle cx="${x}" cy="${y}" r="${EYE.r}" fill="${INK}"/>`
    + `<circle cx="${x - 7}" cy="${y - 8}" r="7.5" fill="#fff"/>`
    + `<circle cx="${x + 7}" cy="${y + 8}" r="3" fill="#fff"/>`,
  small: (x, y) => `<circle cx="${x}" cy="${y}" r="14" fill="${INK}"/>`
    + `<circle cx="${x - 5}" cy="${y - 5}" r="5" fill="#fff"/>`,
  happy: (x, y) => `<path d="M ${x - 19} ${y + 6} Q ${x} ${y - 22} ${x + 19} ${y + 6}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`,
  // chăm chú nhìn xuống màn hình: mắt hạ thấp, đốm sáng dời xuống dưới
  focus: (x, y) => `<circle cx="${x}" cy="${y + 6}" r="${EYE.r}" fill="${INK}"/>`
    + `<circle cx="${x - 6}" cy="${y + 13}" r="7" fill="#fff"/>`
    + `<circle cx="${x + 8}" cy="${y + 2}" r="2.5" fill="#fff"/>`,
  sleepy: (x, y) => `<path d="M ${x - 19} ${y + 2} Q ${x} ${y + 14} ${x + 19} ${y + 2}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`,
};
function eyes(kind) {
  const L = HEAD.cx - EYE.dx, R = HEAD.cx + EYE.dx, y = EYE.y;
  if (kind === 'confused') return EYES.open(L, y) + EYES.small(R, y + 2);
  const f = EYES[kind];
  if (!f) throw new Error(`eyes không hỗ trợ: ${kind}`);
  return f(L, y) + f(R, y);
}

// Mõm trâu: bản rộng, chữ nhật bo mềm (rộng ≈ 2× cao), không tròn như mõm heo.
function muzzle() {
  const { cx, top, bottom, half } = MUZZLE;
  const L = cx - half, R = cx + half, mid = top + 30;
  const d = `M ${L} ${mid} C ${L} ${top + 4} ${cx - 50} ${top} ${cx} ${top}`
    + ` C ${cx + 50} ${top} ${R} ${top + 4} ${R} ${mid}`
    + ` C ${R} ${bottom - 18} ${cx + 52} ${bottom} ${cx} ${bottom}`
    + ` C ${cx - 52} ${bottom} ${L} ${bottom - 18} ${L} ${mid} Z`;
  // lỗ mũi hạt đậu: nghiêng, đặt xa nhau gần mép trên mõm
  const bean = (x, y, a) => `<path transform="translate(${x} ${y}) rotate(${a}) scale(1.5)" d="M -5 -11 C 3 -13 8 -5 6 3 C 4 11 -4 13 -7 7 C -9 2 -3 0 -4 -4 C -5 -7 -9 -9 -5 -11 Z" fill="${INK}"/>`;
  return `<path d="${d}" fill="${C.nose}" ${LINE}/>`
    + `<ellipse cx="${cx}" cy="${top + 14}" rx="44" ry="6" fill="#fff" opacity=".22"/>`
    + bean(cx - 42, top + 28, 160) + bean(cx + 42, top + 28, 20);
}

const MOUTHS = {
  smile: (x, y) => `<path d="M ${x - 14} ${y} Q ${x} ${y + 12} ${x + 14} ${y}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
  open: (x, y) => `<path d="M ${x - 17} ${y - 2} L ${x + 17} ${y - 2} Q ${x + 17} ${y + 22} ${x} ${y + 22} Q ${x - 17} ${y + 22} ${x - 17} ${y - 2} Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`
    + `<path d="M ${x - 10} ${y + 17} Q ${x} ${y + 7} ${x + 10} ${y + 17} Q ${x} ${y + 23} ${x - 10} ${y + 17} Z" fill="${C.cheek}"/>`,
  o: (x, y) => `<ellipse cx="${x}" cy="${y + 7}" rx="8" ry="10" fill="${INK}"/>`,
};

function head({ eyes: e = 'open', mouth = 'smile' } = {}) {
  const { cx, cy, rx, ry } = HEAD;
  const m = MOUTHS[mouth];
  if (!m) throw new Error(`mouth không hỗ trợ: ${mouth}`);
  return '<g class="head">'
    + `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.buffalo}" ${LINE}/>`
    // xoáy lông trán: 3 lọn nhỏ (nghé có lông tơ)
    + `<path d="M 232 80 Q 238 58 252 70 Q 258 50 270 66 Q 284 58 282 80" fill="${C.buffalo}" ${LINE}/>`
    + `<ellipse cx="${cx}" cy="${cy}" rx="${rx - 3}" ry="${ry - 3}" fill="${C.buffalo}"/>`
    + `<ellipse cx="236" cy="112" rx="72" ry="28" transform="rotate(-8 236 112)" fill="#fff" opacity=".18"/>`
    + `<ellipse cx="${cx - 104}" cy="226" rx="24" ry="13" fill="${C.cheek}" opacity=".85"/>`
    + `<ellipse cx="${cx + 104}" cy="226" rx="24" ry="13" fill="${C.cheek}" opacity=".85"/>`
    + eyes(e)
    + muzzle()
    + m(cx, MUZZLE.top + 50)
    + '</g>';
}

function body() {
  const { x, y, w, h, rx } = BODY;
  return '<g class="body">'
    + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${C.buffalo}" ${LINE}/>`
    + `<ellipse cx="256" cy="${y + h - 46}" rx="48" ry="36" fill="${C.belly}"/>`
    + '</g>';
}

// Thẻ nhân viên — thân xanh pastel viền navy như thẻ trong logo A2; dây xanh đậm viền navy, kẹp navy, khe navy, chữ navy.
function badge() {
  const { cx, top, w, h, rx } = CARD;
  const x = cx - w / 2;
  const strapD = `M ${cx - 34} ${top - 52} L ${cx} ${top - 4} L ${cx + 34} ${top - 52}`;
  const strap = (color, width) => `<path d="${strapD}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const name = textPath('Nghé', { family: 'Bricolage Grotesque', weight: 800, size: 22, x: cx, y: top + 50, fill: INK, anchor: 'middle' }).svg;
  const role = textPath('Nhân sự AI', { family: 'Be Vietnam Pro', weight: 600, size: 11, x: cx, y: top + 70, fill: INK, anchor: 'middle' }).svg;
  return '<g class="badge">'
    + strap(INK, 8 + SW * 2) + strap(C.strap, 8)
    + `<rect x="${x}" y="${top}" width="${w}" height="${h}" rx="${rx}" fill="${C.badge}" ${LINE}/>`
    + `<rect x="${cx - 16}" y="${top + 9}" width="32" height="8" rx="4" fill="${INK}"/>`
    + `<rect x="${cx - 7}" y="${top - 12}" width="14" height="26" rx="5" fill="${INK}"/>`
    + name + role
    + '</g>';
}

// Tay = ống bo tròn hơi cong (qua điểm điều khiển qx,qy), đầu là móng guốc navy chẻ đôi.
// hoof: độ sâu móng theo tỉ lệ bề dày tay (0.37 ≈ chỏm mỏng, 0.5 = nửa đầu tròn).
export function limb(x1, y1, qx, qy, x2, y2, w = 38, hoof = 0.37) {
  const len = Math.hypot(x2 - qx, y2 - qy), ux = (x2 - qx) / len, uy = (y2 - qy) / len; // tiếp tuyến cuối
  const nx = -uy, ny = ux, r = w / 2, depth = Math.round(w * hoof);
  const f = (v) => +v.toFixed(1);
  const pt = (along, side) => `${f(x2 + ux * along + nx * side)} ${f(y2 + uy * along + ny * side)}`;
  const seg = (color, width) => `<path d="M ${f(x1)} ${f(y1)} Q ${f(qx)} ${f(qy)} ${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" fill="none"/>`;
  const d = r - depth, half = Math.sqrt(r * r - d * d);
  const cap = `<path d="M ${pt(d, half)} A ${r} ${r} 0 0 0 ${pt(d, -half)} Z" fill="${INK}"/>`;
  const cleft = `<path d="M ${pt(d - 1, 0)} L ${pt(r - 3, 0)}" stroke="${C.buffalo}" stroke-width="3" stroke-linecap="round"/>`;
  return seg(INK, w + SW * 2) + seg(C.buffalo, w) + cap + cleft;
}

// side luôn là phía NGƯỜI XEM: 'left' = nửa trái ảnh (x < 256), 'right' = nửa phải (x > 256).
export const sideX = (side, x) => (side === 'right' ? 512 - x : x);
const sidePt = (side, [x, y]) => [sideX(side, x), y];

// Tay tham số. Toạ độ viết cho phía 'left' rồi tự lật sang 'right'.
//  - angle (độ): 0 = buông thẳng xuống, 90 = giơ ngang ra ngoài, 180 = giơ thẳng lên; >180 vắt vào trong.
//  - length: dài từ vai tới đầu móng; bend: độ cong theo tỉ lệ độ dài (+ khuỷu võng xuống khi giơ, − cong ngược).
//  - hoặc to: [x,y] (đầu tay) + ctrl: [x,y] tuỳ chọn — cho tay cầm đồ vật ở vị trí cụ thể.
//  - from: vai (mặc định [204,352]); w: độ dày; hoof: độ sâu móng (xem limb).
export function arm(side = 'left', { angle = 20, length = 72, bend = 0.2, from = [204, 352], to, ctrl, w = 38, hoof } = {}) {
  const [x1, y1] = from;
  let x2, y2;
  if (to) [x2, y2] = to;
  else {
    const a = (angle * Math.PI) / 180;
    x2 = x1 - Math.sin(a) * length;
    y2 = y1 + Math.cos(a) * length;
  }
  let q = ctrl;
  if (!q) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const nx = dy / L, ny = -dx / L; // pháp tuyến: tay giơ lên → võng xuống; tay buông → ép vào thân
    q = [(x1 + x2) / 2 + nx * bend * L, (y1 + y2) / 2 + ny * bend * L];
  }
  const [a1, b1] = sidePt(side, [x1, y1]), [qa, qb] = sidePt(side, q), [a2, b2] = sidePt(side, [x2, y2]);
  return `<g class="arm-${side}">${limb(a1, b1, qa, qb, a2, b2, w, hoof)}</g>`;
}
// Hai tư thế tay dùng sẵn.
export const ARM = {
  raised: { from: [200, 352], to: [112, 282], ctrl: [150, 340] }, // giơ "Dạ!"
  down: { from: [206, 340], to: [160, 420], ctrl: [170, 362] }, // buông cạnh thân, cùng dày + móng với tay giơ
};
function armDown(side = 'left') { return arm(side, ARM.down); }
function armUp(side = 'right') { return arm(side, ARM.raised); }

// Chân. stance: 'stand' (đứng chụm) | 'wide' (dạng rộng) | 'step' (nhấc chân phải người xem).
const STANCES = {
  stand: [[204, 408], [264, 408]],
  wide: [[190, 408], [278, 408]],
  step: [[204, 408], [270, 398]],
};
export function legs({ stance = 'stand' } = {}) {
  const st = STANCES[stance];
  if (!st) throw new Error(`stance không hỗ trợ: ${stance}`);
  const leg = ([x, y]) => `<rect x="${x}" y="${y}" width="44" height="66" rx="20" fill="${C.buffalo}" ${LINE}/>`
    + `<path d="M ${x + 3} ${y + 48} L ${x + 41} ${y + 48} L ${x + 41} ${y + 50} Q ${x + 41} ${y + 63} ${x + 28} ${y + 63} L ${x + 16} ${y + 63} Q ${x + 3} ${y + 63} ${x + 3} ${y + 50} Z" fill="${INK}"/>`
    + `<path d="M ${x + 22} ${y + 53} L ${x + 22} ${y + 63}" stroke="${C.buffalo}" stroke-width="3" stroke-linecap="round"/>`;
  return `<g class="legs">${st.map(leg).join('')}</g>`;
}

export const part = { horns, ears, head, body, badge, arm, armUp, armDown, legs };

export const POSES = ['nghe-nghe', 'dang-chay', 'xong-roi-sep', 'y-sep-la', 'ca-phe-sang', 'chao-member-moi'];

export const wrap = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">${inner}</svg>
`;

// Vạch hào hứng (3 nét) — mặc định toả lên-phải từ (x,y); flip=true toả lên-trái.
export const sparks = (x, y, flip = false) => [[8, -32, 16, -52], [22, -22, 40, -36], [28, -4, 50, -6]]
  .map(([a, b, c, d]) => {
    const k = flip ? -1 : 1;
    return `<path d="M ${x + k * a} ${y + b} L ${x + k * c} ${y + d}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  }).join('');

export { mirror };

// Ghép một tư thế — thứ tự lớp cố định ở đây, Task 7 chỉ khai báo bộ phận:
//   sừng+tai (theo đầu) → chân → tay sau thân → thân → thẻ → under → tay trước thân → đầu → extras
// head: { eyes, mouth, transform } — transform (vd "rotate(-10 256 200)") áp cho cả sừng, tai, đầu.
// armL / armR: tuỳ chọn của arm() (+ front: true để vẽ trước thân), chuỗi SVG có sẵn, hoặc false để bỏ.
// legs: tuỳ chọn của legs() ({ stance }) hoặc chuỗi SVG. under: đạo cụ nằm sau tay trước (cốc, laptop).
// extras: vẽ trên cùng (vạch hào hứng, dấu "?", biển cầm tay...).
export function compose({ head: h = {}, armL = ARM.down, armR = ARM.down, legs: lg = {}, extras = '', under = '' } = {}) {
  const { transform, ...face } = h;
  const tg = (svg) => (transform ? `<g transform="${transform}">${svg}</g>` : svg);
  const back = [], front = [];
  for (const [side, a] of [['left', armL], ['right', armR]]) {
    if (a === false || a == null) continue;
    if (typeof a === 'string') { back.push(a); continue; }
    const { front: isFront, ...opts } = a;
    (isFront ? front : back).push(arm(side, opts));
  }
  return wrap(
    tg(horns() + ears())
    + (typeof lg === 'string' ? lg : legs(lg))
    + back.join('')
    + body() + badge()
    + under
    + front.join('')
    + tg(head(face))
    + extras,
  );
}

// ---------- Đạo cụ cho sticker (khung 512, viền navy như thân) ----------
const SOFT = COLORS['primary-soft'];

// Laptop nhìn từ phía sau: nắp trắng quay ra người xem, hơi ngả (hình thang), giữa nắp là icon thương hiệu
// (logo A2: thẻ dấu nhắc lệnh thắt cà vạt); dưới nắp là mép thân máy mỏng, rộng hơn nắp để hai móng tì lên.
export function laptopBack(cx = 256, top = 444, w = 196, h = 46) {
  const bot = top + h, hb = w / 2, ht = hb - 4, r = 10; // nắp: đỉnh hẹp hơn đáy chút xíu (ngả về phía Nghé)
  const lid = `M ${cx - ht + r} ${top} L ${cx + ht - r} ${top} Q ${cx + ht} ${top} ${cx + ht + 0.4} ${top + r}`
    + ` L ${cx + hb} ${bot} L ${cx - hb} ${bot} L ${cx - ht - 0.4} ${top + r} Q ${cx - ht} ${top} ${cx - ht + r} ${top} Z`;
  const k = 0.19; // icon khung 200×220 → mực cao ~38px, nằm gọn trong nắp 46px; canh tâm mực vào tâm nắp
  const mx = (INK_BOX.x1 + INK_BOX.x2) / 2, my = (INK_BOX.y1 + INK_BOX.y2) / 2;
  const logo = `<g transform="translate(${+(cx - mx * k).toFixed(2)} ${+(top + h / 2 - my * k).toFixed(2)})">${icon(PALETTES.full, { size: 200 * k })}</g>`;
  const dw = hb + 44, dh = 11; // mép thân máy thò ra hai bên nắp: chỗ tì móng
  return '<g class="laptop">'
    + `<rect x="${cx - dw}" y="${bot - 2}" width="${dw * 2}" height="${dh}" rx="5" fill="${COLORS.surface}" ${LINE}/>`
    + `<path d="${lid}" fill="${COLORS.background}" ${LINE}/>` // trắng xanh: nổi trên ô surface của stickers sheet
    + `<path d="M ${cx - ht + 6} ${top + 7} L ${cx + ht - 6} ${top + 7}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>`
    + logo
    + '</g>';
}

// Bong bóng "đang gõ..." (3 chấm, chấm giữa đậm) — đuôi chỉ xuống trái.
export function typingBubble(x, y, w = 84, h = 44) {
  const dots = [-20, 0, 20].map((dx, i) => `<circle cx="${x + dx}" cy="${y}" r="6.5" fill="${i === 1 ? COLORS.primary : SOFT}"/>`).join('');
  const l = x - w / 2, t = y - h / 2;
  return '<g class="typing">'
    + `<path d="M ${l + 22} ${t + h - 2} L ${l + 8} ${t + h + 16} L ${l + 38} ${t + h - 2} Z" fill="#fff" ${LINE}/>`
    + `<rect x="${l}" y="${t}" width="${w}" height="${h}" rx="${h / 2}" fill="#fff" ${LINE}/>`
    + `<path d="M ${l + 20} ${t + h - 3} L ${l + 38} ${t + h - 3}" stroke="#fff" stroke-width="8"/>`
    + dots + '</g>';
}

// Cà phê sữa đá: cốc trong viền navy, cà phê dưới + sữa trên, 3 viên đá, ống hút xanh đậm.
export const straw = (x1, y1, x2, y2) => [[INK, 12 + SW * 2], [COLORS.primary, 12]]
  .map(([c, w]) => `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`).join('');

// withStraw=false: không vẽ ống hút (tư thế tự vẽ ống hút lên trên đầu để chạm miệng).
// tw/bw: nửa rộng miệng / đáy cốc; cube: cạnh viên đá.
export function icedCoffee(cx = 256, top = 336, h = 104, withStraw = true, { tw = 54, bw = 42, cube = 26 } = {}) {
  const q = tw / 54; // vị trí đá theo tỉ lệ cốc
  const at = (y) => tw - ((tw - bw) * (y - top)) / h; // nửa rộng tại độ cao y
  const band = (y1, y2, fill) => `<path d="M ${cx - at(y1) + 3} ${y1} L ${cx + at(y1) - 3} ${y1} L ${cx + at(y2) - 3} ${y2 - 4} Q ${cx} ${y2 + 2} ${cx - at(y2) + 3} ${y2 - 4} Z" fill="${fill}"/>`;
  const b = top + h;
  const glass = `M ${cx - tw} ${top} L ${cx + tw} ${top} L ${cx + bw} ${b - 8} Q ${cx + bw - 2} ${b} ${cx + bw - 12} ${b} L ${cx - bw + 12} ${b} Q ${cx - bw + 2} ${b} ${cx - bw} ${b - 8} Z`;
  const ice = (x, y, a) => `<rect x="${x - cube / 2}" y="${y - cube / 2}" width="${cube}" height="${cube}" rx="5" transform="rotate(${a} ${x} ${y})" fill="#fff" fill-opacity=".85" stroke="${INK}" stroke-width="3"/>`;
  return '<g class="iced-coffee">'
    + (withStraw ? straw(cx + 14, top + 50, cx + 4, top - 62) : '')
    + `<path d="${glass}" fill="#fff" fill-opacity=".55"/>`
    + band(top + 14, top + 62, '#E8CFA8')
    + band(top + 60, b, '#6B4226')
    + ice(cx - 22 * q, top + 32 * q, -12) + ice(cx + 20 * q, top + 28 * q, 14) + ice(cx - 2 * q, top + 54 * q, 6)
    + `<path d="M ${cx - tw + 12} ${top + 16} L ${cx - bw + 10} ${b - 14}" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`
    + `<path d="${glass}" fill="none" ${LINE}/>`
    + '</g>';
}

// Ngôi sao lấp lánh 4 cánh.
export const sparkle = (x, y, r) => {
  const k = r * 0.2;
  return `<path d="M ${x} ${y - r} Q ${x + k} ${y - k} ${x + r} ${y} Q ${x + k} ${y + k} ${x} ${y + r} Q ${x - k} ${y + k} ${x - r} ${y} Q ${x - k} ${y - k} ${x} ${y - r} Z" fill="${SOFT}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
};

// Nắm tay giơ ngón cái tại (x,y): nắm tròn màu thân + ngón cái dựng đứng, đầu là móng navy.
export function thumbsUp(x, y) {
  return '<g class="thumbs-up">'
    + `<rect x="${x - 9}" y="${y - 58}" width="26" height="50" rx="13" fill="${C.buffalo}" ${LINE}/>`
    + `<path d="M ${x - 6} ${y - 44} A 13 13 0 0 1 ${x + 14} ${y - 44} Z" fill="${INK}"/>`
    + `<rect x="${x - 28}" y="${y - 22}" width="60" height="50" rx="22" fill="${C.buffalo}" ${LINE}/>`
    + `<path d="M ${x - 22} ${y - 2} L ${x + 4} ${y - 2} M ${x - 22} ${y + 12} L ${x + 4} ${y + 12}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`
    + '</g>';
}

// Chữ đậm có viền navy (đọc rõ trên nền sáng lẫn tối khi dán vào bình luận).
const outlinedText = (s, opts, stroke = 10) => {
  const { d } = textPath(s, opts);
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${stroke}" stroke-linejoin="round"/>`
    + `<path d="${d}" fill="${opts.fill}"/>`;
};
export const questionMark = (x, y, size = 90) =>
  outlinedText('?', { family: 'Bricolage Grotesque', weight: 800, size, x, y, fill: COLORS.primary, anchor: 'middle' });

// Giọt mồ hôi.
export const sweatDrop = (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M 0 -22 C 6 -10 14 0 14 9 C 14 18 7 23 0 23 C -7 23 -14 18 -14 9 C -14 0 -6 -10 0 -22 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;

// Vạch chuyển động (vẫy tay): cung nhỏ đồng tâm quanh (x,y).
// dir = 1: vạch ở phía phải (x lớn), -1: phía trái.
const waveLines = (x, y, dir = 1) => [36, 54]
  .map((r) => {
    const p = (deg) => {
      const a = (deg * Math.PI) / 180;
      return `${(x + dir * Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`;
    };
    return `<path d="M ${p(-30)} A ${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${p(40)}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  }).join('');

// "z Z" buồn ngủ.
const zzz = (x, y) => outlinedText('z', { family: 'Bricolage Grotesque', weight: 800, size: 38, x, y, fill: SOFT }, 8)
  + outlinedText('Z', { family: 'Bricolage Grotesque', weight: 800, size: 52, x: x + 30, y: y - 14, fill: SOFT }, 8);

// Bảng cầm tay ghi chữ.
// textX: tâm chữ (mặc định = cx) — dồn chữ sang phải để chừa chỗ cho móng bám mép trái bảng.
export function sign(text, cx = 256, top = 432, w = 300, h = 62, textX = cx) {
  const x = cx - w / 2;
  return `<g class="sign" transform="rotate(-3 ${cx} ${top + h / 2})">`
    + `<rect x="${x}" y="${top}" width="${w}" height="${h}" rx="14" fill="${COLORS.background}" ${LINE}/>`
    + textPath(text, { family: 'Be Vietnam Pro', weight: 600, size: 38, x: textX, y: top + h / 2 + 14, fill: INK, anchor: 'middle' }).svg
    + '</g>';
}

// Bảng "Chào cả nhà!": rộng sang trái 75..425, chữ dồn phải; móng tay trái bám mép trái bảng, ngoài vùng chữ.
export const CHAO_SIGN = { text: 'Chào cả nhà!', cx: 250, top: 430, w: 350, h: 54, textX: 285, hoof: [115, 432] };

const BUILDERS = {
  'nghe-nghe': () => compose({
    head: { eyes: 'open', mouth: 'open' },
    armL: ARM.down,
    armR: ARM.raised,
    extras: sparks(sideX('right', 108), 276),
  }),
  // Đang chạy: ngồi sau laptop (thấy nắp + icon), chăm chú nhìn màn hình, hai móng tì mép máy, bong bóng "đang gõ...".
  // Cả nhân vật nhích lên 24px để nắp laptop nằm trọn dưới thẻ mà vẫn chừa lề đáy.
  'dang-chay': () => shiftUp(compose({
    head: { eyes: 'focus', mouth: 'o' },
    // tay sau thân, nắp laptop vẽ đè lên → nắp hiện trọn; móng tì lên mép thân máy hai bên nắp
    armL: { from: [206, 348], ctrl: [176, 410], to: [146, 476] },
    armR: { from: [206, 348], ctrl: [176, 410], to: [146, 476] },
    legs: '', // ngồi sau máy: chân khuất
    under: laptopBack(256, 441, 156, 64),
  }), 24, typingBubble(64, 262, 76, 38)),
  // Xong rồi sếp: cười tít, giơ ngón cái, lấp lánh.
  'xong-roi-sep': () => compose({
    head: { eyes: 'happy', mouth: 'open' },
    armL: ARM.down,
    armR: { from: [204, 350], ctrl: [150, 364], to: [130, 324], front: true },
    extras: thumbsUp(sideX('right', 130) - 2, 318)
      + sparkle(470, 236, 28) + sparkle(54, 124, 22) + sparkle(470, 404, 17),
  }),
  // Ý sếp là...?: đầu nghiêng, mắt lệch, tay gãi má, dấu "?" to + giọt mồ hôi.
  'y-sep-la': () => compose({
    head: { eyes: 'confused', mouth: 'o', transform: 'rotate(-8 256 200)' },
    armL: false,
    armR: ARM.down,
    extras: arm('left', { from: [206, 346], ctrl: [116, 352], to: [116, 256] })
      + questionMark(456, 356, 150) + questionMark(484, 140, 54) + sweatDrop(388, 136),
  }),
  // Cà phê sáng: lim dim, hai móng ôm ly cà phê sữa đá nhỏ lệch phải (thẻ vẫn đọc được), ống hút tới miệng.
  // Ly vẽ sau tay → hai móng nằm sau thành ly, như đang ôm.
  'ca-phe-sang': () => compose({
    head: { eyes: 'sleepy', mouth: 'smile' },
    armL: { from: [194, 350], ctrl: [170, 512], to: [318, 440], front: true }, // vai lùi ra ngoài để tay không chạm mép thẻ
    armR: { from: [206, 348], ctrl: [118, 372], to: [140, 420], front: true },
    extras: icedCoffee(348, 362, 92, false, { tw: 40, bw: 31, cube: 20 })
      + straw(340, 380, 272, 284) + zzz(318, 64),
  }),
  // Chào member mới: vẫy tay cao, tay kia cầm bảng "Chào cả nhà!".
  'chao-member-moi': () => compose({
    head: { eyes: 'happy', mouth: 'open' },
    armL: { from: [206, 346], ctrl: [150, 380], to: CHAO_SIGN.hoof, front: true },
    armR: { from: [200, 350], ctrl: [136, 326], to: [86, 240] },
    under: sign(CHAO_SIGN.text, CHAO_SIGN.cx, CHAO_SIGN.top, CHAO_SIGN.w, CHAO_SIGN.h, CHAO_SIGN.textX), // đáy bảng (cả khi nghiêng) cách mép khung ≥ 16px
    extras: waveLines(sideX('right', 86), 240),
  }),
};

// Nhích cả tư thế lên dy px (giữ khung 512); top: vẽ thêm trên cùng, không nhích.
const shiftUp = (svg, dy, top = '') => svg.replace(/^(<svg[^>]*>)([\s\S]*)(<\/svg>\n?)$/, (_, a, inner, z) => `${a}<g transform="translate(0 -${dy})">${inner}</g>${top}${z}`);

export function pose(name) {
  if (!POSES.includes(name)) throw new Error(`Không có tư thế: ${name}`);
  return BUILDERS[name]();
}

// ---------- Stickers sheet 1600 × 1160: lưới 3×2 ----------
export const STICKER_LABELS = {
  'nghe-nghe': 'Nghé nghe!',
  'dang-chay': 'Đang chạy...',
  'xong-roi-sep': 'Xong rồi sếp!',
  'y-sep-la': 'Ý sếp là...?',
  'ca-phe-sang': 'Cà phê sáng',
  'chao-member-moi': 'Chào member mới',
};

// ---------- Character sheet 1600×1000 ----------
const H800 = { family: 'Bricolage Grotesque', weight: 800 };
const B500 = { family: 'Be Vietnam Pro', weight: 500 };
const B600 = { family: 'Be Vietnam Pro', weight: 600 };
const T = (s, o) => textPath(s, o).svg;
const place = (inner, x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">${inner}</g>`;

export function characterSheet() {
  const W = 1600, H = 1000, bg = COLORS.background;
  let b = `<rect width="${W}" height="${H}" fill="${bg}"/>`;
  // Trái: Nghé chính trên ô surface
  b += `<rect x="40" y="40" width="720" height="920" rx="24" fill="${COLORS.surface}"/>`;
  b += `<ellipse cx="400" cy="772" rx="160" ry="20" fill="${INK}" opacity=".10"/>`;
  b += place(pose('nghe-nghe').replace(/^<svg[^>]*>|<\/svg>\n?$/g, ''), 400 - 256 * 1.36, 120, 1.36);
  b += T('Dáng gốc: "Nghé nghe!"', { ...B600, size: 18, x: 400, y: 916, fill: COLORS['text-muted'], anchor: 'middle' });

  // Phải: tên + câu cửa miệng
  const X = 820;
  b += T('Nghé', { ...H800, size: 64, x: X, y: 120, fill: INK });
  b += T('Nhân sự AI của group "Đi làm với AI" · chăm, hơi ngáo', { ...B500, size: 18, x: X, y: 156, fill: COLORS['text-muted'] });
  b += T('Nói là Nghé nghe!', { ...H800, size: 40, x: X, y: 220, fill: COLORS.primary });

  // 4 biểu cảm
  b += T('BIỂU CẢM', { ...B600, size: 14, x: X, y: 280, fill: COLORS['text-muted'] });
  const faces = [['open', 'smile', 'Mở (open)'], ['happy', 'open', 'Vui (happy)'], ['sleepy', 'smile', 'Buồn ngủ (sleepy)'], ['confused', 'o', 'Ngơ (confused)']];
  faces.forEach(([e, m, label], i) => {
    const cx = X + 90 + i * 186, k = 0.36;
    b += `<rect x="${cx - 86}" y="296" width="172" height="150" rx="14" fill="${COLORS.surface}"/>`;
    b += place(horns() + ears() + head({ eyes: e, mouth: m }), cx - 256 * k, 300, k);
    b += T(label, { ...B600, size: 15, x: cx, y: 474, fill: INK, anchor: 'middle' });
  });

  // Bảng màu
  b += T('BẢNG MÀU MASCOT', { ...B600, size: 14, x: X, y: 530, fill: COLORS['text-muted'] });
  const sw = [['Thân', C.buffalo], ['Bụng', C.belly], ['Sừng', C.horn], ['Mõm', C.nose],
    ['Má / tai', C.cheek], ['Viền', INK], ['Thẻ', C.badge], ['Dây thẻ', C.strap]];
  sw.forEach(([name, hex], i) => {
    const x = X + (i % 4) * 186, y = 560 + Math.floor(i / 4) * 84;
    b += `<circle cx="${x + 26}" cy="${y + 26}" r="24" fill="${hex}" stroke="${INK}" stroke-width="3"/>`;
    b += T(name, { ...B600, size: 16, x: x + 62, y: y + 22, fill: INK });
    b += T(hex.toUpperCase(), { ...B500, size: 14, x: x + 62, y: y + 42, fill: COLORS['text-muted'] });
  });

  // Đặc điểm khoá
  b += T('ĐẶC ĐIỂM KHOÁ (giữ ở mọi tư thế)', { ...B600, size: 14, x: X, y: 762, fill: COLORS['text-muted'] });
  [
    '2 sừng kem lưỡi liềm quét ngang',
    'Mõm rộng xám-hồng (trâu nước), 2 lỗ mũi hạt đậu · má hồng',
    'Mắt tròn đen, đốm sáng · tai cụp ngang · xoáy lông trán',
    'Thân xám #8C7B70, viền navy #1F3A5F dày 6px (khung 512)',
    'Thẻ nhân viên xanh pastel, chữ navy "Nghé · Nhân sự AI"',
  ].forEach((s, i) => {
    const y = 798 + i * 34;
    b += `<circle cx="${X + 6}" cy="${y - 6}" r="5" fill="${COLORS.primary}"/>`;
    b += T(s, { ...B500, size: 18, x: X + 22, y, fill: INK });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${b}</svg>\n`;
}

export function stickersSheet() {
  const W = 1600, H = 1160, cw = 500, ch = 540, gx = 25, top = 40, k = 0.86;
  let b = `<rect width="${W}" height="${H}" fill="${COLORS.background}"/>`;
  POSES.forEach((name, i) => {
    const x = gx + (i % 3) * (cw + gx), y = top + Math.floor(i / 3) * (ch + gx), cx = x + cw / 2;
    b += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="24" fill="${COLORS.surface}"/>`;
    b += place(pose(name).replace(/^<svg[^>]*>|<\/svg>\n?$/g, ''), cx - 256 * k, y + 14, k);
    b += T(STICKER_LABELS[name], { ...H800, size: 30, x: cx, y: y + ch - 28, fill: INK, anchor: 'middle' });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${b}</svg>\n`;
}

// Ghi 6 SVG + PNG (nghe-nghe 512/1024/2048, các pose khác 512/1024) + stickers sheet + character sheet.
export function buildMascot(dir = '03-mascot') {
  fs.mkdirSync(`${dir}/svg`, { recursive: true });
  const out = [];
  for (const name of POSES) {
    const f = `${dir}/svg/${name}.svg`;
    fs.writeFileSync(f, pose(name));
    out.push(f, ...renderSizes(f, `${dir}/png/${name}`, name === 'nghe-nghe' ? [512, 1024, 2048] : [512, 1024]));
  }
  for (const [file, svg] of [['stickers-sheet', stickersSheet()], ['character-sheet', characterSheet()]]) {
    fs.writeFileSync(`${dir}/${file}.svg`, svg);
    fs.writeFileSync(`${dir}/${file}.png`, renderPng(svg, 1600));
    out.push(`${dir}/${file}.svg`, `${dir}/${file}.png`);
  }
  return out;
}

if (path.basename(process.argv[1] ?? '') === 'mascot.mjs') {
  for (const f of buildMascot()) console.log('+', f);
}
