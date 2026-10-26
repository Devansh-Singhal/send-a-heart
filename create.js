(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const drawing = makeHeart($('heart'));
  drawing.play(4800);
  let current = '', plain = false, timer;
  const gift = () => ({ to: Heart.clean($('to').value, 40), from: Heart.clean($('from').value, 40), note: Heart.clean($('note').value, 140) });
  function toast(text) { $('status').textContent = text; $('status').classList.add('on'); clearTimeout(timer); timer = setTimeout(() => $('status').classList.remove('on'), 3000); }
  ['to', 'from', 'note'].forEach(id => $(id).addEventListener('input', () => {
    const max = id === 'note' ? 140 : 40;
    $(id).value = Array.from($(id).value).slice(0, max).join('');
    $('count').textContent = Array.from($('note').value).length + ' / 140';
    $('preview-name').textContent = gift().to ? 'A heart for ' + gift().to : 'A heart for someone special';
    if (gift().to) { $('error').hidden = true; $('to').removeAttribute('aria-invalid'); }
    $('result').hidden = true;
  }));
  $('create').addEventListener('submit', event => {
    event.preventDefault();
    const data = gift();
    if (!data.to) { $('error').hidden = false; $('to').setAttribute('aria-invalid', 'true'); $('to').focus(); return; }
    current = Heart.linkFor(location.origin, data);
    $('link').value = current; $('open').href = current;
    $('whatsapp').href = 'https://wa.me/?text=' + encodeURIComponent('A little love for you, ' + data.to + '. ' + current);
    $('share').hidden = !navigator.share; $('qrbox').hidden = true; $('result').hidden = false;
    $('ready').focus(); $('result').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  });
  $('copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(current); toast('Link copied. Send a little love.'); }
    catch { $('link').focus(); $('link').select(); toast('Select Copy to copy your link.'); }
  });
  $('share').addEventListener('click', async () => {
    try { await navigator.share({ title: 'A heart for ' + gift().to, url: current }); }
    catch (error) { if (error.name !== 'AbortError') toast('Try Copy link or WhatsApp instead.'); }
  });
  function drawQR() { (plain ? window.drawPlainQR : window.drawHeartQR)($('qr'), current); $('qrstyle').textContent = plain ? 'Use a heart QR' : 'Use a plain QR'; }
  $('makeqr').addEventListener('click', () => { plain = false; drawQR(); $('qrbox').hidden = false; });
  $('qrstyle').addEventListener('click', () => { plain = !plain; drawQR(); });
  $('saveqr').addEventListener('click', () => {
    $('qr').toBlob(blob => {
      if (!blob) { toast('Could not save. Please try again.'); return; }
      const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'a-heart-for-you.png'; link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 4000);
    }, 'image/png');
  });
})();
