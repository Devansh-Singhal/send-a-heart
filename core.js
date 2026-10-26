(function (root) {
  'use strict';
  const clean = (value, max) => Array.from(String(value || '').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim()).slice(0, max).join('');
  function readGift(params) {
    return { to: clean(params.get('t') || params.get('to'), 40), from: clean(params.get('f') || params.get('from'), 40), note: clean(params.get('n') || params.get('note'), 140) };
  }
  function linkFor(origin, gift) {
    const params = new URLSearchParams({ t: clean(gift.to, 40) });
    if (clean(gift.from, 40)) params.set('f', clean(gift.from, 40));
    if (clean(gift.note, 140)) params.set('n', clean(gift.note, 140));
    return origin + '/f?' + params;
  }
  function heart(n) {
    return { x: 15 * Math.sin(n) ** 3, y: 12 * Math.cos(n) - 5 * Math.cos(2 * n) - 2 * Math.cos(3 * n) - Math.cos(4 * n) };
  }
  const api = { clean, readGift, linkFor, heart };
  if (typeof module !== 'undefined') module.exports = api;
  else root.Heart = api;
})(typeof window !== 'undefined' ? window : globalThis);
