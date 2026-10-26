'use strict';
window.makeHeart = function (canvas) {
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let progress = 0, frame = 0, start = 0, duration = 6500;
  function paint() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.scale(ratio, ratio); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, width, height);
    const scale = Math.min(width / 560, height / 520);
    ctx.translate(width / 2, height / 2 - 25 * scale);
    ctx.strokeStyle = '#ff304a'; ctx.lineWidth = Math.max(1.2, 2.8 * scale); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (let i = 1; i < 16; i++) {
      const steps = Math.max(0, Math.min(100, progress * 1500 - (i - 1) * 100));
      if (steps < 1) continue;
      ctx.beginPath();
      for (let j = 0; j < steps; j++) {
        const p = Heart.heart(j / 15);
        const x = p.x * i * scale, y = -p.y * i * scale;
        if (!j) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  function tick(now) {
    if (!start) start = now;
    progress = Math.min((now - start) / duration, 1); paint();
    if (progress < 1) frame = requestAnimationFrame(tick);
  }
  new ResizeObserver(paint).observe(canvas);
  return { play(ms = 6500) { cancelAnimationFrame(frame); start = 0; duration = ms; progress = reduced.matches ? 1 : 0; paint(); if (!reduced.matches) frame = requestAnimationFrame(tick); }, still(amount = 1) { cancelAnimationFrame(frame); progress = amount; paint(); } };
};
