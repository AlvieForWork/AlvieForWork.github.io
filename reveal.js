/* ==========================================================================
   reveal.js — 捲動進場

   只做兩件事，都是原生的、0 KB 依賴：
   1. [data-reveal] 進視窗時淡入＋上移，同一區塊內錯開時間依序出現
   2. 頁面捲動後幫 header 加一條底線

   沒有用 GSAP／Lenis。GEPPY 自己也沒有任何動畫函式庫 ——
   它的動態就只有淡入，克制是這個風格的一部分。

   關掉動效或瀏覽器不支援 IntersectionObserver 時，
   完全不加 .js-reveal，內容就是靜態但完整的。
   ========================================================================== */

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 進場 ---------- */
  (() => {
    const items = [...document.querySelectorAll('[data-reveal]')];
    if (!items.length) return;
    if (reduce || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('js-reveal');

    // 同一個區塊裡的元素依序錯開，跨區塊重新計算
    const groups = new Map();
    items.forEach(el => {
      const key = el.closest('section, footer') || document.body;
      const arr = groups.get(key) || [];
      arr.push(el);
      groups.set(key, arr);
    });
    groups.forEach(arr => {
      arr.forEach((el, i) => {
        el.style.setProperty('--d', Math.min(i * 0.08, 0.48) + 's');
      });
    });

    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);        // 只播一次，往回捲不重來
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    items.forEach(el => io.observe(el));
  })();

  /* ---------- 2. header 捲動後加底線 ---------- */
  (() => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      header.classList.toggle('is-stuck', scrollY > 8);
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();
})();
