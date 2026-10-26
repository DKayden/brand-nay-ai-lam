// Chạy src/check_submission.py và kiểm tra kết quả khớp trạng thái ảnh chụp quá trình.
// LƯU Ý CHO CONTROLLER: test này chấp nhận cả hai trạng thái (chưa có / đã có >= 2 ảnh).
// Khi người dùng đã thêm ảnh vào 06-process/screenshots/, test tự chuyển sang kỳ vọng exit 0 + "OK:".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdirSync, existsSync } from 'node:fs';

test('check_submission: chỉ lỗi ảnh chụp (hoặc OK khi đã đủ ảnh)', () => {
  const dir = '06-process/screenshots';
  const shots = existsSync(dir) ? readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f)) : [];
  const r = spawnSync('python', ['-I', 'src/check_submission.py'], { encoding: 'utf-8' });
  assert.equal(r.error, undefined);
  if (shots.length >= 2) {
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /OK:/);
  } else {
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stdout, /Cần ≥ 2 ảnh chụp quá trình hợp lệ/);
    assert.doesNotMatch(r.stdout, /Thiếu:|PNG không trong suốt|SVG còn|Slogan sai|Brand voice cần|DESIGN\.md thiếu|fonts\.md thiếu/);
    const lines = r.stdout.split('\n').filter((l) => l.startsWith('- '));
    assert.equal(lines.length, 1, r.stdout);
  }
});
