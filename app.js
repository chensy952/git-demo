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
     id: 'dayu', num: '05', name: '大禹治水', en: 'Great Yu Controls the Flood',
     keywords: '责 任 · 疏 导 · 家 国',
     premise: '父亲堵了九年。他决定换一个方向：让水走。',
     x: 21, y: 72,
   },
   {
     id: 'jingwei', num: '06', name: '精卫填海', en: 'Jingwei Fills the Sea',
     keywords: '执 念 · 徒 劳 · 不 屈',
     premise: '一只小鸟，想把整片海填平。',
     x: 31, y: 91,
   }
];

/* ── 舞台与画布 ───────────────────────────── */
const stage = document.querySelector('.stage');
const canvas = document.querySelector('#scene');
const veilEl = document.querySelector('#veil');
const flashEl = document.querySelector('#flash');
const bgCanvas = document.querySelector('#bgCanvas');
const stageVignette = document.querySelector('.stage__vignette');
const stageGrain = document.querySelector('.stage__grain');
const stageFlash = document.querySelector('.stage__flash');

/* ── 元素引用 ──────────────────────────────── */
const labelsEl = document.querySelector('#labels');
const indexList = document.querySelector('#indexList');
const plate = document.querySelector('#plate');
const plateTitle = document.querySelector('#plateTitle');
const plateQuestion = document.querySelector('#plateQuestion');
const platePremise = document.querySelector('#platePremise');
const plateNote = document.querySelector('#plateNote');
const ritual = document.querySelector('#ritual');
const ritualHint = document.querySelector('#ritualHint');
const ritualStatus = document.querySelector('#ritualStatus');
const mythBack = document.querySelector('#mythBack');
const soundBtn = document.querySelector('#sound');
const soundLabel = document.querySelector('#sound').querySelector('.bar__sound-label');

/* ── 状态变量 ──────────────────────────────── */
let current = 'home';
let down = false;
let par = { x: 0, y: 0 };
let parT = { x: 0, y: 0 };
let SCENES = {};

/* ── 辅助函数 ──────────────────────────────── */
function $(sel) { return document.querySelector(sel); }
function pos(e) {
  const r = canvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
function scene() { return SCENES[current]; }

/* ── 声音 ──────────────────────────────────── */
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

    const len = ac.sampleRate * 4;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const v = (-Math.random() * 2 + Math.random() * 2) / 2;
      data[i] = last + (v - last) * (i / len);
      last = data[i];
    }

    // 五十五与八十二点四一Hz 的风 drone
    const tone1 = ac.createBufferSource();
    tone1.buffer = buf;
    tone1.connect(ac.destination);
    tone1.start(0);

    const freqNode = ac.createGain();
    freqNode.gain.value = 0.5;
    freqNode.connect(ac.destination);
  },
  toggle() {
    const on = !this.on;
    this.on = on;
    if (this.ac) {
      if (on) this.ac.resume();
      else this.ac.suspend();
    }
    const btn = document.querySelector('#sound');
    if (btn) {
      btn.setAttribute('aria-pressed', String(on));
      btn.classList.toggle('is-on', on);
      const lbl = btn.querySelector('.bar__sound-label');
      if (lbl) lbl.textContent = on ? '声音 · 开' : '声音 · 关';
    }
    return on;
  },
  tone(freq, dur, type, vol, glide) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    if (vol !== undefined) gain.gain.value = vol;
    if (glide) osc.glide = glide;
    osc.start(0);
    gain.gain.value = 0;
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + dur);
    osc.stop(ac.currentTime + dur);
  },
  noise(dur, type, freq, q, vol) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    const bufLen = ac.sampleRate * dur;
    const data = ac.createBuffer(1, bufLen, ac.sampleRate);
    const ch = data.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      ch[i] = (Math.random() * 2 - 1) * (vol || 0.1);
    }
    const n = ac.createBufferSource();
    n.buffer = data;
    const g = ac.createGain();
    g.gain.value = vol || 0.1;
    n.connect(g);
    g.connect(ac.destination);
    n.start(0);
  },
  chime() {
    this.tone(523.25, 0.2, 'sine', 0.3);
    this.tone(659.25, 0.2, 'sine', 0.3);
  },
  wind() { this.noise(0.5, 'brown', 5, 0.001, 0.1); },
  splash() { this.tone(1000, 0.1, 'sine', 0.2); },
  thud() { this.tone(200, 0.1, 'sine', 0.3); },
  bell() { this.tone(880, 0.15, 'sine', 0.3); },
  whoosh() { this.noise(0.3, 'white', 10, 0.01, 0.1); }
};

/* ── 门与文字 ──────────────────────────────── */
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
  });
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
function openAbout() {
  aboutEl.classList.add('is-open');
  aboutEl.setAttribute('aria-hidden', 'false');
}
function closeAbout() {
  aboutEl.classList.remove('is-open');
  aboutEl.setAttribute('aria-hidden', 'true');
}

/* ── 进入 myth 场景 ────────────────────────── */
function enter(id) {
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
    const mb = document.getElementById('mythBack');
    if (mb) mb.hidden = !isMyth;
    if (id === 'home') {
      par.x = 0; par.y = 0; parT.x = 0; parT.y = 0;
    }
    if (isMyth) {
      fillPlate(id);
      Audio2.chime();
    }
    paintBG();
    syncNav(isMyth ? 'myth' : 'home');
    setTimeout(() => veilEl.classList.remove('is-on'), 60);
  }, 300);
}

/* ── 返回主页面 ────────────────────────────── */
function returnHome() {
  document.body.classList.remove('is-myth');
  document.body.classList.add('is-home');
  const mb = document.getElementById('mythBack');
  if (mb) mb.hidden = true;
  if (ritual) ritual.hidden = true;
  syncNav('home');
  // 触发 veil fade 与回调
  if (veilEl) veilEl.classList.add('is-on');
  veilTimer = setTimeout(() => {
    veilEl.classList.remove('is-on');
    current = 'home';
  }, 300);
}

/* ── 导航同步 ──────────────────────────────── */
function syncNav(state) {
  const navHome = $('#navHome');
  const navMyths = $('#navMyths');
  const navAbout = $('#navAbout');
  if (state === 'home') {
    navHome.classList.add('is-active');
    navMyths.classList.remove('is-active');
    navAbout.classList.remove('is-active');
  } else if (state === 'myth') {
    navHome.classList.remove('is-active');
    navMyths.classList.add('is-active');
    navAbout.classList.remove('is-active');
  } else if (state === 'about') {
    navHome.classList.remove('is-active');
    navMyths.classList.remove('is-active');
    navAbout.classList.add('is-active');
  }
}

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

/* ── 触控代理 ──────────────────────────────── */
document.addEventListener('touchend', (e) => {
  const mythBtn = e.target.closest('[data-myth]');
  if (mythBtn) { enter(mythBtn.dataset.myth); return; }
  const act = e.target.closest('[data-action="home"]');
  if (act) {
    returnHome();
    return;
  }
  const nav = e.target.closest('[data-nav]');
  if (nav) {
    const v = nav.dataset.nav;
    if (v === 'home') returnHome();
    else if (v === 'myths') { openIndex(); syncNav('myths'); }
    else if (v === 'about') { openAbout(); syncNav('about'); }
    return;
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
soundBtn.addEventListener('click', () => {
  const on = Audio2.toggle();
  soundBtn.setAttribute('aria-pressed', String(on));
  soundBtn.classList.toggle('is-on', on);
  const lbl = soundBtn.querySelector('.bar__sound-label');
  if (lbl) lbl.textContent = on ? '声音 · 开' : '声音 · 关';
});

/* ── 启动 ─────────────────────────────────── */
boot();
})();