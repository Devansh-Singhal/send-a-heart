(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const gift = Heart.readGift(new URLSearchParams(location.search));
  $('recipient').textContent = gift.to ? 'For ' + gift.to + '.' : 'For you.';
  $('sender').textContent = gift.from ? gift.from + ' made this for you.' : 'Someone made this for you.';
  $('note').textContent = gift.note || 'A thousand little ways to say you matter.';
  $('signature').textContent = gift.from ? 'With love, ' + gift.from : 'Made just for you.';
  document.title = gift.to ? 'A heart for ' + gift.to : 'A heart for you';
  const drawing = makeHeart($('heart'));
  const bgm = $('bgm');
  const sound = $('sound');
  let started = false, resumeOnReturn = false;
  bgm.volume = .85;
  drawing.still(0);
  function soundState(blocked = false) {
    sound.textContent = blocked ? 'Turn sound on' : bgm.muted ? 'Sound off' : 'Sound on';
    sound.setAttribute('aria-label', blocked || bgm.muted ? 'Turn sound on' : 'Mute sound');
    sound.setAttribute('aria-pressed', String(!blocked && !bgm.muted));
  }
  function startMusic(restart) {
    if (restart) bgm.currentTime = 0;
    bgm.play().then(() => soundState()).catch(() => soundState(true));
  }
  function replay() {
    startMusic(true);
    drawing.play();
  }
  $('reveal').addEventListener('click', () => {
    if (started) return;
    started = true;
    $('reveal').hidden = true; $('message').hidden = false; $('replay').hidden = false;
    sound.hidden = false;
    replay(); $('replay').focus({ preventScroll: true });
  });
  $('replay').addEventListener('click', replay);
  sound.addEventListener('click', () => {
    if (bgm.paused) { bgm.muted = false; startMusic(false); }
    else { bgm.muted = !bgm.muted; soundState(); }
  });
  bgm.addEventListener('ended', () => { if (!document.hidden) replay(); });
  bgm.addEventListener('error', () => soundState(true));
  function onHide() {
    if (!bgm.paused) { resumeOnReturn = true; bgm.pause(); }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) onHide();
    else if (resumeOnReturn) { resumeOnReturn = false; if (!bgm.muted) startMusic(false); }
  });
  window.addEventListener('pagehide', onHide);
})();
