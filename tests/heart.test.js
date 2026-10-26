const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const corePath = path.join(__dirname, '../core.js');

test('personal links round-trip Unicode, punctuation and literal HTML as text', () => {
  assert.ok(fs.existsSync(corePath), 'shared link helpers must exist');
  const core = require(corePath);
  const data = { to: 'प्रेम & <3', from: 'D + S', note: 'You? Always. #1 ❤️' };
  const link = core.linkFor('https://example.com', data);
  assert.equal(new URL(link).pathname, '/f');
  assert.deepEqual(core.readGift(new URL(link).searchParams), data);
});
test('names and notes are normalized and bounded', () => {
  assert.ok(fs.existsSync(corePath), 'shared link helpers must exist');
  const core = require(corePath);
  assert.equal(core.clean('  A\n B\u0000 ', 40), 'A B');
  assert.equal(core.clean('x'.repeat(60), 40).length, 40);
  assert.equal(core.readGift(new URLSearchParams('n=' + 'x'.repeat(200))).note.length, 140);
  assert.equal(core.readGift(new URLSearchParams('t=+++')).to, '');
});
test('heart follows the original Turtle equation', () => {
  assert.ok(fs.existsSync(corePath), 'shared geometry must exist');
  const { heart } = require(corePath);
  assert.deepEqual(heart(0), { x: 0, y: 4 });
  assert.ok(Math.abs(heart(Math.PI / 2).x - 15) < 1e-10);
  assert.ok(Math.abs(heart(Math.PI).y + 16) < 1e-10);
});
test('recipient preview escapes HTML and omits private notes from metadata', () => {
  const handlerPath = path.join(__dirname, '../api/for.js');
  assert.ok(fs.existsSync(handlerPath), 'recipient preview handler must exist');
  const handler = require(handlerPath);
  const headers = {};
  let html;
  handler({ url: '/f?t=%22%3E%3Cscript%3E&f=Devansh&n=private-note', headers: { host: 'example.com' } }, {
    setHeader(key, value) { headers[key] = value; }, end(value) { html = value; }
  });
  assert.match(html, /A heart for &quot;&gt;&lt;script&gt;/);
  assert.match(html, /From Devansh/);
  assert.doesNotMatch(html, /private-note/);
  assert.match(html, /https:\/\/example.com\/og.png/);
  assert.equal(headers['Content-Type'], 'text/html; charset=utf-8');
});
