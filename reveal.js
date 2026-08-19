/* ==========================================================================
   reveal.js — 深色區塊的遮罩揭露

   深色區塊進場時上緣是一道弧，捲動時慢慢攤平成直線。
   純 CSS clip-path，不需要圖片、不需要 React、不需要任何套件。

   不跑的情況（區塊就是一般的直邊，什麼都不會少）：
   - 使用者開了「減少動態」
   - 瀏覽器不支援 clip-path 的 ellipse()
   ========================================================================== */

(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!CSS.supports('clip-path', 'ellipse(100% 100% at 50% 100%)')) return;

  const targets = [...document.querySelectorAll('.section--dark')];
  if (!targets.length) return;

  targets.forEach(el => el.classList.add('is-revealing'));

  const RX_START = 70;    // 剛進場：上緣是明顯的弧
  const RX_END   = 260;   // 完全進場：弧攤平成直線

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    for (const el of targets) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      // 0 = 上緣剛碰到視窗底部，1 = 上緣已經捲到視窗上緣
      const p = Math.min(1, Math.max(0, (vh - r.top) / vh));
      el.style.setProperty('--reveal-rx', (RX_START + (RX_END - RX_START) * p) + '%');
    }
  };

  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  update();
})();
