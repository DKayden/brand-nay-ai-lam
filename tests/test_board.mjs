import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildBoard, embed, brandBoard, mockupJobs, socialJobs } from '../src/board.mjs';

const pngSize = (f) => {
  const b = fs.readFileSync(f);
  assert.equal(b.toString('ascii', 12, 16), 'IHDR', f);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};

test('buildBoard ghi đủ 13 tệp, đúng kích thước, không có <text>', () => {
  const out = buildBoard();
  assert.equal(out.length, 13);
  for (const f of out) assert.ok(fs.existsSync(f), f);
  assert.ok(!fs.readFileSync('board/brand-board.svg', 'utf8').includes('<text'));
  const expect = {
    'board/brand-board.png': [2160, 2700],
    'board/mockup-cover-group.png': [1640, 856],
    'board/mockup-the-nhan-vien.png': [1200, 900],
    'board/mockup-ly-ca-phe.png': [1200, 900],
    'board/mockup-slide-webinar.png': [1920, 1080],
    'board/poster-nghe-phang.png': [1080, 1350],
    'board/poster-nghe-xanh.png': [1080, 1350],
    'board/carousel-01.png': [1080, 1080],
    'board/carousel-02.png': [1080, 1080],
    'board/carousel-03.png': [1080, 1080],
    'board/carousel-04.png': [1080, 1080],
    'board/carousel-05.png': [1080, 1080],
  };
  for (const [f, wh] of Object.entries(expect)) assert.deepEqual(pngSize(f), wh, f);
});

test('embed đổi tên id mỗi lần nhúng, không đụng nhau', () => {
  const a = embed('01-logo/svg/logo-ngang-mono-navy.svg', 0, 0, 100);
  const b = embed('01-logo/svg/logo-ngang-mono-navy.svg', 0, 0, 100);
  const idA = a.match(/id="([^"]+)"/)[1], idB = b.match(/id="([^"]+)"/)[1];
  assert.notEqual(idA, idB);
  assert.ok(a.includes(`url(#${idA})`) && !a.includes('url(#the-smile)'));
});

test('mọi SVG nguồn của mockup đều không có <text>', () => {
  const all = [['brand-board', brandBoard()], ...mockupJobs()];
  assert.equal(all.length, 6);
  for (const [name, svg] of all) assert.ok(!svg.includes('<text'), name);
});

test('poster xanh + carousel: 6 ảnh, SVG không có <text>, chữ chỉ là path', () => {
  const jobs = socialJobs();
  assert.deepEqual(jobs.map(([n]) => n),
    ['poster-nghe-xanh', 'carousel-01', 'carousel-02', 'carousel-03', 'carousel-04', 'carousel-05']);
  for (const [name, svg] of jobs) {
    assert.ok(!svg.includes('<text'), name);
    assert.ok(svg.includes('<path d="M'), name);
  }
});
