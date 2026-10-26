const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = path.join(__dirname, '../analytics.js');

function analytics(search = '') {
  assert.ok(fs.existsSync(source), 'analytics integration must exist');
  const scripts = [];
  const window = {};
  vm.runInNewContext(fs.readFileSync(source, 'utf8'), { window, location: { search }, URLSearchParams,
    document: { createElement: () => ({}), head: { appendChild: script => scripts.push(script) } }
  });
  return { window, scripts };
}

test('analytics strips recipient names, notes and fragments before sending', () => {
  const { window, scripts } = analytics('?t=Recipient&n=private');
  const filter = window.vaq[0][1];
  const event = { url: 'https://example.com/f?t=Recipient&n=private#secret', type: 'pageview' };
  assert.equal(filter(event).url, 'https://example.com/f');
  assert.equal(event.url, 'https://example.com/f?t=Recipient&n=private#secret');
  assert.equal(scripts[0].src, '/_vercel/insights/script.js');
});

test('live previews do not inflate analytics', () => {
  const { window, scripts } = analytics('?t=Preview&preview=1');
  assert.equal(scripts.length, 0);
  assert.equal(window.va, undefined);
});
