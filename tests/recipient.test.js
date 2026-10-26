const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function recipient({ playFails = false } = {}) {
  const nodes = new Map();
  const events = {};
  const draws = [];
  const music = { plays: 0, pauses: 0, paused: true, muted: false, currentTime: 0,
    play() { this.plays++; if (playFails) return Promise.reject(new Error('Playback blocked')); this.paused = false; return Promise.resolve(); },
    pause() { this.pauses++; this.paused = true; },
    addEventListener(name, fn) { this[name] = fn; }
  };
  function element(id) {
    if (id === 'bgm') return music;
    if (!nodes.has(id)) nodes.set(id, { hidden: id === 'experience', textContent: '', attributes: {}, classList: { add() {} },
      addEventListener(name, fn) { this[name] = fn; },
      setAttribute(name, value) { this.attributes[name] = value; }, focus() {}
    });
    return nodes.get(id);
  }
  const document = { title: '', hidden: false, getElementById: element,
    addEventListener(name, fn) { events[name] = fn; }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../receive.js'), 'utf8'), {
    document, location: { search: '?t=Recipient&f=Devansh&n=For+you' }, URLSearchParams, setTimeout: fn => fn(),
    Heart: require('../core'), makeHeart: () => ({ still: value => draws.push(['still', value]), play: () => draws.push(['play']) }),
    window: { addEventListener(name, fn) { events[name] = fn; } }
  });
  return { element, music, draws, document, events };
}

test('recipient waits with a blank drawing and silent audio until opened', () => {
  const page = recipient();
  assert.equal(page.element('gate-name').textContent, 'Recipient');
  assert.equal(page.element('experience').hidden, true);
  assert.deepEqual(page.draws, [['still', 0]]);
  assert.equal(page.music.plays, 0);
  page.element('reveal').click();
  assert.deepEqual(page.draws, [['still', 0], ['play']]);
  assert.equal(page.music.plays, 1);
  assert.equal(page.element('message').hidden, false);
  assert.equal(page.element('experience').hidden, false);
});

test('replay restarts sound, mute is reversible, and background pauses sound', async () => {
  const page = recipient();
  page.element('reveal').click();
  await Promise.resolve();
  page.music.currentTime = 5;
  page.element('replay').click();
  assert.equal(page.music.currentTime, 0);
  assert.equal(page.music.plays, 2);
  page.element('sound').click();
  assert.equal(page.music.muted, true);
  page.element('sound').click();
  assert.equal(page.music.muted, false);
  page.document.hidden = true;
  page.events.visibilitychange();
  assert.equal(page.music.paused, true);
  page.document.hidden = false;
  page.events.visibilitychange();
  assert.equal(page.music.paused, false);
});

test('audio ending starts the next drawing cycle', () => {
  const page = recipient();
  page.element('reveal').click();
  page.music.currentTime = 12;
  assert.equal(typeof page.music.ended, 'function');
  page.music.ended();
  assert.equal(page.music.currentTime, 0);
  assert.equal(page.draws.filter(item => item[0] === 'play').length, 2);
});

test('blocked audio leaves the drawing usable and offers a sound retry', async () => {
  const page = recipient({ playFails: true });
  page.element('reveal').click();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(page.element('message').hidden, false);
  assert.equal(page.draws.filter(item => item[0] === 'play').length, 1);
  assert.equal(page.element('sound').textContent, 'Turn sound on');
});
