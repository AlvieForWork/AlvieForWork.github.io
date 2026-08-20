/* ==========================================================================
   reveal.js — 捲動相關的動態

   三件事：
   1. 深色區塊的遮罩揭露（上緣的弧隨捲動攤平）
   2. 案例的進場（淡入＋上移，圖片與文字錯開）
   3. 案例圖片的視差

   全部原生實作，沒有任何外部套件。沒用 GSAP／Lenis 的理由見設計規格。

   關掉動效或瀏覽器不支援時，一律回到「什麼都沒有但內容完整」的狀態 ——
   進場的隱藏狀態綁在 .js-reveal 上，就是為了這個。
   ========================================================================== */

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 深色區塊的遮罩揭露 ---------- */
  (() => {
    if (reduce) return;
    if (!CSS.supports('clip-path', 'ellipse(100% 100% at 50% 100%)')) return;

    const targets = [...document.querySelectorAll('.section--dark')];
    if (!targets.length) return;
    targets.forEach(el => el.classList.add('is-revealing'));

    const RX_START = 70, RX_END = 260;
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const p = Math.min(1, Math.max(0, (vh - r.top) / vh));
        el.style.setProperty('--reveal-rx', (RX_START + (RX_END - RX_START) * p) + '%');
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    update();
  })();

  /* ---------- 2. 案例進場 ---------- */
  (() => {
    const items = [...document.querySelectorAll('[data-reveal]')];
    if (!items.length) return;
    // 關掉動效、或瀏覽器沒有 IntersectionObserver 時就不隱藏任何東西
    if (reduce || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('js-reveal');

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);          // 只播一次，往回捲不要重來
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    items.forEach(el => io.observe(el));
  })();

  /* ---------- 3. 圖片視差 ---------- */
  (() => {
    if (reduce) return;
    if (innerWidth < 720) return;        // 手機不跑，省效能
    const media = [...document.querySelectorAll('[data-parallax]')];
    if (!media.length) return;

    const AMOUNT = 40;                   // 上下各 40px，再多就會看出圖在滑動
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      for (const el of media) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        // 元素中心在視窗中央時是 0，往上往下各推到 ±1
        const p = ((vh / 2) - (r.top + r.height / 2)) / vh;
        el.style.setProperty('--py', (p * AMOUNT).toFixed(1) + 'px');
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    update();
  })();
})();
