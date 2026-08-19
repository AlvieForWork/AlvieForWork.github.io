/* ==========================================================================
   physics.js — hero 服務標籤的掉落堆疊
   Matter.js 只負責算物理，膠囊本身是真的 HTML（吃 token、選得起來、讀得到）

   不跑物理的三種情況（標籤就維持 CSS 那排靜態的樣子）：
   - 使用者開了「減少動態」
   - Matter.js 沒載進來（CDN 掛掉）
   - 找不到 hero 或標籤
   ========================================================================== */

(() => {
  const hero = document.querySelector('.hero');
  const pit  = document.getElementById('heroTags');
  if (!hero || !pit) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof Matter === 'undefined') return;

  const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

  const pills = [...pit.querySelectorAll('.pill')];

  // 切成絕對定位之前先量尺寸，量完才知道膠囊該做多大
  const sizes = pills.map(el => {
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height };
  });
  pit.classList.add('is-physics');

  const engine = Engine.create();
  engine.gravity.y = 1;

  const PLAY_MAX = 980;   // 場地比畫面窄，膠囊才會疊起來而不是排成一排
  const bodies = [];
  let walls = [];

  const field = () => {
    const w = pit.clientWidth, h = pit.clientHeight;
    const fw = Math.min(w, PLAY_MAX);
    const left = (w - fw) / 2;
    return { w, h, fw, left, right: left + fw };
  };

  function buildWalls() {
    Composite.remove(engine.world, walls);
    const { w, h, left, right } = field();
    const t = 200;   // 牆做厚一點，快速拖曳時才不會穿過去
    walls = [
      Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, { isStatic: true }),   // 地板
      Bodies.rectangle(left - t / 2, h / 2, t, h * 4, { isStatic: true }),    // 左牆
      Bodies.rectangle(right + t / 2, h / 2, t, h * 4, { isStatic: true }),   // 右牆
    ];
    Composite.add(engine.world, walls);
  }

  function drop() {
    Composite.remove(engine.world, bodies);
    bodies.length = 0;
    const { w, fw, left } = field();
    const count = w < 700 ? 6 : pills.length;   // 窄螢幕少放幾顆，手機才不會卡

    pills.forEach((el, i) => {
      if (i >= count) { el.style.display = 'none'; return; }
      el.style.display = '';
      const { w: pw, h: ph } = sizes[i];
      const body = Bodies.rectangle(
        left + 40 + Math.random() * Math.max(1, fw - 80),
        -120 - i * 90,                        // 從畫面上方依序落下，不要一次全倒
        pw, ph,
        {
          chamfer: { radius: ph / 2 },        // 這一行讓方塊變成膠囊
          restitution: 0.25,                  // 彈一下就好
          friction: 0.35,
          frictionAir: 0.02,
          angle: (Math.random() - 0.5) * 0.6,
        }
      );
      body.plugin = { el, w: pw, h: ph };
      bodies.push(body);
    });
    Composite.add(engine.world, bodies);
  }

  buildWalls();
  drop();

  // 只有滑鼠裝置能拖。手機上 Matter 會 preventDefault 掉 touch 事件，
  // 那會讓 CTA 按鈕按不下去 —— 寧可不能拖，也不能擋住主要按鈕
  if (matchMedia('(pointer: fine)').matches) {
    const mouse = Mouse.create(hero);
    Composite.add(engine.world, MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    }));
    mouse.element.removeEventListener('wheel', mouse.mousewheel);  // 不要吃掉頁面捲動
  }

  Events.on(engine, 'afterUpdate', () => {
    for (const b of bodies) {
      const { el, w, h } = b.plugin;
      el.style.transform =
        `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`;
    }
  });

  Runner.run(Runner.create(), engine);

  let t;
  addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => { buildWalls(); drop(); }, 200);
  });
})();
