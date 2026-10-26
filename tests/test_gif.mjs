import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('src/gif.py ghi ra file GIF hợp lệ', () => {
  const out = join(tmpdir(), `nghe-test-${process.pid}.gif`);
  try {
    execFileSync('python', ['-I', 'src/gif.py', out], { cwd: process.cwd(), stdio: 'pipe' });
    const buf = readFileSync(out);
    assert.ok(buf.length > 0);
    assert.equal(buf.subarray(0, 6).toString('ascii'), 'GIF89a');
  } finally {
    rmSync(out, { force: true });
  }
});
