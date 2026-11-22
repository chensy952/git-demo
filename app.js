/* ─────────────────────────────────────────────
   app.js — 门、光、声音
   ───────────────────────────────────────────── */
(function () {
  'use strict';

  const MYTHS = [
    {
      id: 'yugong', num: '01', name: '愚公移山', en: 'The Mountain Movers',
      keywords: '坚 持 · 世 代 · 意 义',
      premise: '他决定，从第一筐土开始。',
      x: 12, y: 80,
    },
    {
      id: 'houyi', num: '02', name: '后羿射日', en: 'Ten Suns',
      keywords: '行 动 · 代 价 · 孤 勇',
      premise: '天上多出九个太阳。他把它们一一指了下来。',
      x: 85, y: 42,
    },
    {
      id: 'kuafu', num: '03', name: '夸父逐日', en: 'Chasing the Sun',
      keywords: '渴 望 · 极 限 · 坠 落',
      premise: '他跑得比风还快，却始终追不上那团光。',
      x: 92, y: 68,
    },
    {
      id: 'nuwa', num: '04', name: '女娲补天', en: 'Mending the Sky',
      keywords: '创 造 · 修 补 · 承 担',
      premise: '天裂了一道缝，她手里只有五块石头。',
      x: 64, y: 17,
    },
    {
      id: 'dayu', num: '05', name: '大禹治水', en: 'The Great Flood',
      keywords: '责 任 · 疏 导 · 家 国',
      premise: '父亲堵了九年。他决定换一个方向：让水走。',
      x: 21, y: 72,
    },
    {
      id: 'jingwei', num: '06', name: '精卫填海', en: 'Filling the Sea',
      keywords: '执 念 · 徒 劳 · 不 屈',
      premise: '一只小鸟，想把整片海填平。',
      x: 31, y: 91,
    },
  ];
  const BY_ID = Object.fromEntries(MYTHS.map((m) => [m.id, m]));
  const $ = (s, r = document) => r.querySelector(s);

  /* ── 舞台 ─────────────────────────────────── */
  const canvas = $('#scene');
  const ctx = canvas.getContext('2d');
  const bgCanvas = document.createElement('canvas');
  const bgx = bgCanvas.getContext('2d');
  let W = 1, H = 1, DPR = 1;
  let current = 'home';
  let t = 0, lastT = performance.now();
  const par = { x: 0, y: 0 };
  const parT = { x: 0, y: 0 };
  let hudAt = 0;

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    bgCanvas.width = Math.round(W * DPR);
    bgCanvas.height = Math.round(H * DPR);
    bgx.setTransform(DPR, 0, 0, DPR, 0, 0);
    paintBG();
  }

  function paintBG() {
    const sc = SCENES[current];
    if (!sc || !sc.paintStatic) return;
    bgx.setTransform(1, 0, 0, 1, 0, 0);
    bgx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgx.setTransform(DPR, 0, 0, DPR, 0, 0);
    sc.paintStatic(bgx, W, H);
  }

  function frame(now) {
    const dt = Math.min(0.06, Math.max(0.001, (now - lastT) / 1000));
    lastT = now;
    t += dt;
    par.x += (parT.x - par.x) * 0.055;
    par.y += (parT.y - par.y) * 0.055;

    const sc = SCENES[current];
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const ox = -8 + par.x * 10;
    const oy = -8 + par.y * 8;
    ctx.drawImage(bgCanvas, ox, oy, W + 16, H + 16);
    if (sc && sc.paintDynamic) sc.paintDynamic(ctx, W, H, t, par, sc.S || (sc.S = {}));
    if (sc && sc.tick) sc.tick(sc.S, dt, W, H, t);

    if (now - hudAt > 110) { hudAt = now; updateHud(); }
    requestAnimationFrame(frame);
  }

  /* ── 门与文字 ─────────────────────────────── */
  const labelsEl = $('#labels');
  const indexList = $('#indexList');
  const plate = $('#plate');
  const plateIndex = $('#plateIndex');
  const plateTitle = $('#plateTitle');
  const plateQuestion = $('#plateQuestion');
  const platePremise = $('#platePremise');
  const plateNote = $('#plateNote');
  const ritual = $('#ritual');
  const ritualHint = $('#ritualHint');
  const ritualStatus = $('#ritualStatus');
  const mythBack = $('#mythBack');
  const veilEl = $('#veil');
  const flashEl = $('#flash');
  const toastEl = $('#toast');
  const indexEl = $('#index');
  const aboutEl = $('#about');

  function buildDoors() {
    MYTHS.forEach((m) => {
      const b = document.createElement('button');
      b.className = 'sanctum__label';
      b.style.left = m.x + '%';
      b.style.top = m.y + '%';
      b.dataset.myth = m.id;
      b.setAttribute('aria-label', `${m.name}，入内`);
      b.innerHTML =
        `<span class="sanctum__ring">${m.num}</span>` +
        `<span class="sanctum__name">${m.name}</span>` +
        `<span class="sanctum__meta">` +
        `<span class="sanctum__q">${m.keywords}</span>` +
        `<span class="sanctum__premise">${m.premise}</span>` +
        `</span>`;
      labelsEl.appendChild(b);

      const li = document.createElement('li');
      li.innerHTML =
        `<button class="index__row" data-myth="${m.id}">` +
        `<span class="index__num">${m.num}</span>` +
        `<span class="index__name">${m.name}<span class="index__en">${m.en}</span></span>` +
        `<span class="index__body"><span class="index__q">${m.keywords}</span>` +
        `<span class="index__p">${m.premise}</span></span>` +
        `<span class="index__arrow">→</span>` +
        `</button>`;
      indexList.appendChild(li);
    });
  }

  function fillPlate(id) {
    const m = BY_ID[id];
    if (!m) return;
    plateIndex.textContent = m.num;
    plateTitle.textContent = m.name;
    plateQuestion.textContent = m.keywords;
    platePremise.textContent = m.premise;
    plateNote.textContent = '';
    plateNote.classList.remove('is-on');
  }

  let noteFired = '';
  function updateHud() {
    if (current === 'home') return;
    const sc = SCENES[current];
    if (!sc) return;
    const S = sc.S || {};
    if (sc.status) {
      const st = sc.status(S) || {};
      if (st.hint && ritualHint.textContent !== st.hint) ritualHint.textContent = st.hint;
      if (st.status && ritualStatus.textContent !== st.status) ritualStatus.textContent = st.status;
    }
    if (sc.note) {
      const n = sc.note(S);
      if (n && noteFired !== current + ':' + n) {
        noteFired = current + ':' + n;
        plateNote.textContent = n;
        plateNote.classList.add('is-on');
        toast(n);
        Audio2.bell();
      }
    }
  }

  /* ── 进入 / 退出 ──────────────────────────── */
  let veilTimer = null;
  function enter(id) {
    if (!SCENES[id]) return;
    closeIndex();
    closeAbout();
    if (id === 'home' && current === 'home') return;
    veilEl.classList.add('is-on');
    if (veilTimer) clearTimeout(veilTimer);
    veilTimer = setTimeout(() => {
      current = id;
      const sc = SCENES[id];
      sc.S = sc.S || {};
      if (sc.reset) sc.reset();
      noteFired = '';
      document.body.classList.toggle('is-myth', id !== 'home');
      document.body.classList.toggle('is-home', id === 'home');
      const isMyth = id !== 'home';
      plate.classList.toggle('is-on', isMyth);
      ritual.hidden = !isMyth;
      mythBack.hidden = !isMyth;
      if (id === 'home') { par.x = 0; par.y = 0; parT.x = 0; parT.y = 0; }
      if (isMyth) {
        fillPlate(id);
        Audio2.chime();
      }
      paintBG();
      syncNav(isMyth ? 'myth' : 'home');
      setTimeout(() => veilEl.classList.remove('is-on'), 60);
    }, 300);
  }

  function syncNav(state) {
    document.querySelectorAll('.bar__link').forEach((b) => {
      const nav = b.dataset.nav;
      b.classList.toggle('is-active', (nav === 'home' && state === 'home') || (nav === 'myths' && state === 'myths') || (nav === 'about' && state === 'about'));
    });
  }

  /* ── 关于 / 六门 ──────────────────────────── */
  function openAbout() {
    aboutEl.classList.add('is-open');
    aboutEl.setAttribute('aria-hidden', 'false');
    Audio2.tick();
  }
  function closeAbout() {
    aboutEl.classList.remove('is-open');
    aboutEl.setAttribute('aria-hidden', 'true');
  }
  function openIndex() {
    indexEl.classList.add('is-open');
    indexEl.setAttribute('aria-hidden', 'false');
    Audio2.tick();
  }
  function closeIndex() {
    indexEl.classList.remove('is-open');
    indexEl.setAttribute('aria-hidden', 'true');
  }

  /* ── 声音 ─────────────────────────────────── */
  const Audio2 = {
    on: false, ac: null, master: null, built: false,
    build() {
      if (this.built) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ac = new AC();
      this.ac = ac;
      const master = ac.createGain();
      master.gain.value = 0;
      master.connect(ac.destination);
      this.master = master;

      // 风：循环棕噪
      const len = ac.sampleRate * 4;
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const data = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      }
      const src = ac.createBufferSource();
      src.buffer = buf; src.loop = true;
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 340; lp.Q.value = 0.6;
      const g = ac.createGain(); g.gain.value = 0.16;
      src.connect(lp); lp.connect(g); g.connect(master);
      src.start();

      // 低音持续
      [55, 82.41].forEach((f, i) => {
        const o = ac.createOscillator();
        o.type = 'sine'; o.frequency.value = f;
        const og = ac.createGain(); og.gain.value = i ? 0.05 : 0.09;
        const lfo = ac.createOscillator(); lfo.frequency.value = 0.05 + i * 0.03;
        const lg = ac.createGain(); lg.gain.value = i ? 0.03 : 0.05;
        lfo.connect(lg); lg.connect(og.gain);
        o.connect(og); og.connect(master);
        o.start(); lfo.start();
      });
      this.built = true;
    },
    toggle() {
      this.build();
      if (!this.ac) return false;
      if (this.ac.state === 'suspended') this.ac.resume();
      this.on = !this.on;
      const g = this.master.gain;
      g.cancelScheduledValues(this.ac.currentTime);
      g.setTargetAtTime(this.on ? 0.7 : 0, this.ac.currentTime, 0.35);
      return this.on;
    },
    tone(freq, dur, type, vol, glide) {
      if (!this.on || !this.ac) return;
      const ac = this.ac, now = ac.currentTime;
      const o = ac.createOscillator();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, now);
      if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * glide), now + dur);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(vol || 0.12, now + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.connect(g); g.connect(this.master);
      o.start(now); o.stop(now + dur + 0.05);
    },
    noise(dur, type, freq, q, vol) {
      if (!this.on || !this.ac) return;
      const ac = this.ac, now = ac.currentTime;
      const len = Math.max(1, Math.floor(ac.sampleRate * dur));
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = ac.createBufferSource(); src.buffer = buf;
      const f = ac.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq || 800; f.Q.value = q || 1;
      const g = ac.createGain();
      g.gain.setValueAtTime(vol || 0.1, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      src.connect(f); f.connect(g); g.connect(this.master);
      src.start(now);
    },
    tick() { this.tone(660, 0.07, 'sine', 0.05); },
    chime() { this.tone(523.25, 1.1, 'sine', 0.1); this.tone(783.99, 1.4, 'sine', 0.05); },
    bell() { this.tone(392, 2.4, 'sine', 0.11); this.tone(587.33, 2.0, 'sine', 0.05); this.tone(880, 1.6, 'sine', 0.03); },
    pluck() { this.noise(0.16, 'highpass', 1600, 0.8, 0.09); this.tone(196, 0.28, 'triangle', 0.09, 0.4); },
    seal() { this.tone(880, 0.5, 'sine', 0.1); this.tone(1320, 0.9, 'sine', 0.05); },
    splash() { this.noise(0.45, 'lowpass', 700, 0.7, 0.13); },
    thud() { this.noise(0.22, 'lowpass', 180, 0.9, 0.16); },
    whoosh() { this.noise(0.35, 'bandpass', 900, 0.5, 0.1); },
  };

  /* ── 反馈 ─────────────────────────────────── */
  function flash(x, y, strength) {
    flashEl.style.setProperty('--fx', (x / W * 100).toFixed(1) + '%');
    flashEl.style.setProperty('--fy', (y / H * 100).toFixed(1) + '%');
    flashEl.style.opacity = strength || 0.6;
    setTimeout(() => { flashEl.style.opacity = 0; }, 90);
  }

  function feedback(kind, x, y) {
    switch (kind) {
      case 'shoot': Audio2.pluck(); flash(x, y, 0.35); break;
      case 'aim': Audio2.tick(); break;
      case 'seal': Audio2.seal(); flash(x, y, 0.75); break;
      case 'throw': Audio2.splash(); break;
      case 'basket': Audio2.thud(); flash(x, y, 0.25); break;
      case 'run': Audio2.whoosh(); break;
      case 'dig': Audio2.noise(0.5, 'lowpass', 420, 0.7, 0.1); break;
      default: break;
    }
  }

  let toastTimer = null;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('is-on');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 5200);
  }

  /* ── 指针 ─────────────────────────────────── */
  let down = false;
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function scene() { return SCENES[current]; }

  canvas.addEventListener('pointerdown', (e) => {
    const sc = scene();
    if (!sc || current === 'home') return;
    const p = pos(e);
    down = true;
    sc.S = sc.S || {};
    if (sc.onDown) {
      const k = sc.onDown(p.x, p.y, sc.S, W, H);
      if (k) feedback(k, p.x, p.y);
    }
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    const sc = scene();
    const p = pos(e);
    parT.x = (p.x / W) * 2 - 1;
    parT.y = (p.y / H) * 2 - 1;
    if (!sc || current === 'home' || !down) return;
    if (sc.onMove) sc.onMove(p.x, p.y, sc.S, W, H);
  });
  window.addEventListener('pointerup', (e) => {
    if (!down) return;
    down = false;
    const sc = scene();
    if (!sc || current === 'home') return;
    const p = pos(e);
    if (sc.onUp) {
      const k = sc.onUp(p.x, p.y, sc.S, W, H);
      if (k) feedback(k, p.x, p.y);
    }
  });

  /* ── 键 ───────────────────────────────────── */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (aboutEl.classList.contains('is-open')) return closeAbout();
      if (indexEl.classList.contains('is-open')) return closeIndex();
      if (current !== 'home') return enter('home');
    }
    if ((e.key === 'r' || e.key === 'R') && current !== 'home') {
      const sc = SCENES[current];
      if (sc.reset) sc.reset();
      noteFired = '';
      plateNote.classList.remove('is-on');
      toast('重 新 开 始');
    }
  });

  /* ── 点击代理 ─────────────────────────────── */
  document.addEventListener('click', (e) => {
    const mythBtn = e.target.closest('[data-myth]');
    if (mythBtn) { enter(mythBtn.dataset.myth); return; }
    const nav = e.target.closest('[data-nav]');
    if (nav) {
      const v = nav.dataset.nav;
      if (v === 'home') enter('home');
      else if (v === 'myths') { openIndex(); syncNav('myths'); }
      else if (v === 'about') { openAbout(); syncNav('about'); }
      return;
    }
    const act = e.target.closest('[data-action]');
    if (act) {
      const v = act.dataset.action;
      if (v === 'home') enter('home');
      else if (v === 'closeAbout') { closeAbout(); syncNav(current === 'home' ? 'home' : 'myth'); }
      else if (v === 'closeIndex') { closeIndex(); syncNav(current === 'home' ? 'home' : 'myth'); }
    }
  });

  /* 标签悬停：让别的标签淡一点 */
  labelsEl.addEventListener('pointerover', (e) => {
    const l = e.target.closest('.sanctum__label');
    if (!l) return;
    [...labelsEl.children].forEach((c) => c.classList.toggle('is-active', c === l));
  });
  labelsEl.addEventListener('pointerleave', () => {
    [...labelsEl.children].forEach((c) => c.classList.remove('is-active'));
  });

  /* ── 声音按钮 ─────────────────────────────── */
  const soundBtn = $('#sound');
  soundBtn.addEventListener('click', () => {
    const on = Audio2.toggle();
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.classList.toggle('is-on', on);
    $('#sound').querySelector('.bar__sound-label').textContent = on ? '声 音 · 开' : '声 音 · 关';
  });

  /* ── 启动 ─────────────────────────────────── */
  const bootEl = $('#boot');
  const bootBar = $('#bootBar');
  const bootStatus = $('#bootStatus');

  function boot() {
    buildDoors();
    resize();
    window.addEventListener('resize', () => { resize(); }, { passive: true });
    requestAnimationFrame((n) => { lastT = n; frame(n); });

    let p = 0;
    const words = ['正 在 起 风', '堆 起 山 脊', '铺 开 水 面', '点 亮 火 盆', '开 门'];
    const timer = setInterval(() => {
      p = Math.min(100, p + 7 + Math.random() * 11);
      bootBar.style.width = p + '%';
      bootStatus.textContent = words[Math.min(words.length - 1, Math.floor(p / 22))];
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          bootEl.classList.add('is-done');
          setTimeout(() => {
            if (!Audio2.on && !sessionStorage.getItem('sh_sound_hint')) {
              sessionStorage.setItem('sh_sound_hint', '1');
              toast('声 音 关 闭 · 右 上 可 开');
            }
          }, 900);
        }, 420);
      }
    }, 120);
  }

  boot();
})();