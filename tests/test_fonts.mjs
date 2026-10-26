import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import opentype from 'opentype.js';
import { FONT_FILES } from '../src/fonts.mjs';

const VI = 'ĐđẮẰẲẴẶắằẳẵặỨỪỬỮỰứừửữựỹỷỳ';

test('đủ 5 file font và có glyph tiếng Việt', () => {
  assert.equal(FONT_FILES.length, 5);
  for (const f of FONT_FILES) {
    assert.ok(fs.existsSync(f), `thiếu ${f}`);
    const b = fs.readFileSync(f);
    const font = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
    for (const ch of VI) {
      assert.notEqual(font.charToGlyphIndex(ch), 0, `${f} thiếu glyph ${ch}`);
    }
  }
});
