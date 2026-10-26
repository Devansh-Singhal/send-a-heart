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
  drawing.still(.16);
  $('reveal').addEventListener('click', () => {
    $('reveal').hidden = true; $('message').hidden = false; $('replay').hidden = false;
    drawing.play(); $('replay').focus({ preventScroll: true });
  });
  $('replay').addEventListener('click', () => drawing.play());
})();
