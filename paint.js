/* ─────────────────────────────────────────────
   paint.js — 一片用来画山的工具
   全部图形由代码生成，没有一张贴图。
   ───────────────────────────────────────────── */
window.P = (function () {
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const rad = (d) => (d * Math.PI) / 180;

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash2(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return s - Math.floor(s);
  }
  function noise2(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = smooth(xf), v = smooth(yf);
    const a = hash2(xi, yi), b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }
  function fbm(x, y, oct = 4, lac = 2.02, gain = 0.5) {
    let v = 0, amp = 0.5, f = 1, norm = 0;
    for (let i = 0; i < oct; i++) {
      v += amp * noise2(x * f, y * f);
      norm += amp; f *= lac; amp *= gain;
    }
    return v / norm;
  }
  function ridge1(x, seed, oct = 4) {
    let v = 0, amp = 0.55, f = 1, norm = 0;
    for (let i = 0; i < oct; i++) {
      const n = noise2(x * f + seed * 7.3, seed * 3.1);
      v += amp * (1 - Math.abs(n * 2 - 1));
      norm += amp; f *= 2.07; amp *= 0.5;
    }
    return v / norm;
  }

  /* ── colour ─────────────────────────────── */
  function hex2rgb(h) {
    h = String(h).trim();
    if (h.charAt(0) === '#') {
      let v = h.slice(1);
      if (v.length === 3) v = v.split('').map((c) => c + c).join('');
      return [parseInt(v.slice(0, 2), 16) || 0, parseInt(v.slice(2, 4), 16) || 0, parseInt(v.slice(4, 6), 16) || 0];
    }
    const m = h.match(/-?\d+(\.\d+)?/g);
    if (m && m.length >= 3) return [Number(m[0]), Number(m[1]), Number(m[2])];
    return [0, 0, 0];
  }
  function rgba(h, a = 1) {
    const [r, g, b] = hex2rgb(h);
    return `rgba(${r},${g},${b},${a})`;
  }
  function mix(h1, h2, t) {
    const a = hex2rgb(h1), b = hex2rgb(h2);
    return `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;
  }

  /* ── sky ────────────────────────────────── */
  function sky(ctx, w, h, stops) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    stops.forEach(([p, c]) => g.addColorStop(p, c));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  function glow(ctx, x, y, r, color, a = 1) {
    if (r <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, a));
    g.addColorStop(0.35, rgba(color, a * 0.5));
    g.addColorStop(0.7, rgba(color, a * 0.14));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  function sunDisc(ctx, x, y, r, core = '#fff6e2', halo = '#e9c48b', a = 1) {
    glow(ctx, x, y, r * 7.5, halo, 0.16 * a);
    glow(ctx, x, y, r * 3.2, halo, 0.3 * a);
    glow(ctx, x, y, r * 1.7, core, 0.5 * a);
    const g = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r);
    g.addColorStop(0, 'rgba(255,252,242,' + a + ')');
    g.addColorStop(0.72, rgba(core, a));
    g.addColorStop(1, rgba(halo, a * 0.92));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }

  /* ── mountains ──────────────────────────── */
  function ridgePoints(w, o) {
    const step = o.step || 5;
    const pts = [];
    const seed = o.seed || 1;
    const scale = o.scale || 0.0032;
    const rough = o.rough || 1;
    for (let x = -20; x <= w + 20; x += step) {
      let n = ridge1(x * scale, seed, o.oct || 4);
      if (o.karst) n = Math.pow(n, 1.65) * 1.25 + 0.06 * Math.sin(x * 0.004 + seed);
      n = Math.pow(clamp(n, 0, 1), rough);
      pts.push([x, o.base - n * o.amp - (o.lift || 0)]);
    }
    return pts;
  }
  function mountains(ctx, o) {
    const w = o.w, h = o.h;
    const pts = ridgePoints(w, o);
    ctx.save();
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    const g = ctx.createLinearGradient(0, o.base - o.amp, 0, (o.floor || o.base + h * 0.3));
    g.addColorStop(0, o.top);
    g.addColorStop(0.55, mix(o.top, o.bottom, 0.55));
    g.addColorStop(1, o.bottom);
    ctx.beginPath();
    ctx.moveTo(-20, h + 40);
    pts.forEach((p) => ctx.lineTo(p[0], p[1]));
    ctx.lineTo(w + 20, h + 40);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();

    // 山体上缘的薄光
    if (o.rim) {
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.strokeStyle = o.rim;
      ctx.lineWidth = o.rimW || 1.1;
      ctx.stroke();
    }
    // 雾：越往下越白
    const hz = ctx.createLinearGradient(0, o.base - o.amp * 0.9, 0, o.base + h * 0.16);
    const hazeC = o.hazeColor || '#e6dcca';
    hz.addColorStop(0, rgba(hazeC, 0));
    hz.addColorStop(0.55, rgba(hazeC, (o.haze == null ? 0.12 : o.haze) * 0.55));
    hz.addColorStop(1, rgba(hazeC, o.haze == null ? 0.12 : o.haze));
    ctx.fillStyle = hz;
    ctx.fill();
    ctx.restore();
  }

  function mistBand(ctx, o) {
    const { w, y, height = 120, seed = 1, color = '#e8dfd0', alpha = 0.5, count = 26 } = o;
    const rnd = mulberry32(seed * 977 + 13);
    ctx.save();
    for (let i = 0; i < count; i++) {
      const x = rnd() * (w + 400) - 200;
      const yy = y + (rnd() - 0.5) * height;
      const rx = 90 + rnd() * 260;
      const ry = height * (0.12 + rnd() * 0.3);
      const a = alpha * (0.25 + rnd() * 0.75);
      const g = ctx.createRadialGradient(x, yy, 0, x, yy, rx);
      g.addColorStop(0, rgba(color, a));
      g.addColorStop(0.55, rgba(color, a * 0.45));
      g.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = g;
      ctx.save();
      ctx.translate(x, yy); ctx.scale(1, ry / rx); ctx.translate(-x, -yy);
      ctx.beginPath(); ctx.arc(x, yy, rx, 0, TAU); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  /* ── architecture ───────────────────────── */
  // 起翘的屋檐
  function roofPath(ctx, cx, y, halfW, rise, tipLift = 0.16) {
    const tipY = y - rise * tipLift;
    ctx.beginPath();
    ctx.moveTo(cx - halfW, tipY);
    ctx.quadraticCurveTo(cx - halfW * 0.5, y + rise * 0.07, cx, y + rise * 0.02);
    ctx.quadraticCurveTo(cx + halfW * 0.5, y + rise * 0.07, cx + halfW, tipY);
    ctx.quadraticCurveTo(cx + halfW * 0.74, y - rise * 0.5, cx + halfW * 0.4, y - rise * 0.85);
    ctx.quadraticCurveTo(cx + halfW * 0.16, y - rise * 1.02, cx, y - rise);
    ctx.quadraticCurveTo(cx - halfW * 0.16, y - rise * 1.02, cx - halfW * 0.4, y - rise * 0.85);
    ctx.quadraticCurveTo(cx - halfW * 0.74, y - rise * 0.5, cx - halfW, tipY);
    ctx.closePath();
  }
  function roof(ctx, cx, y, halfW, rise, o) {
    roofPath(ctx, cx, y, halfW, rise, o.tipLift);
    const g = ctx.createLinearGradient(cx - halfW, y - rise, cx + halfW, y);
    g.addColorStop(0, o.lit);
    g.addColorStop(0.45, o.mid);
    g.addColorStop(1, o.dark);
    ctx.fillStyle = g;
    ctx.fill();
    // 瓦垄
    if (o.tiles !== false) {
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = rgba(o.tileColor || '#2b2620', o.tileAlpha || 0.22);
      ctx.lineWidth = 1;
      for (let i = -halfW; i <= halfW; i += Math.max(4, halfW / 22)) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 1.02, y - rise * 0.98);
        ctx.lineTo(cx + i * 1.3, y + rise * 0.1);
        ctx.stroke();
      }
      ctx.restore();
    }
    // 檐口阴影线
    ctx.beginPath();
    ctx.moveTo(cx - halfW, y - rise * 0.16);
    ctx.quadraticCurveTo(cx, y + rise * 0.16, cx + halfW, y - rise * 0.16);
    ctx.strokeStyle = rgba(o.shadow || '#1b1712', 0.5);
    ctx.lineWidth = 1.6;
    ctx.stroke();
    // 正脊
    ctx.beginPath();
    ctx.moveTo(cx, y - rise);
    ctx.lineTo(cx, y - rise * 1.06);
    ctx.strokeStyle = rgba(o.ridge || '#f0e4cd', 0.35);
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 石台：一层的正面
  function terrace(ctx, cx, yTop, w, hFace, o) {
    const x0 = cx - w / 2;
    const g = ctx.createLinearGradient(x0, yTop, x0 + w, yTop);
    g.addColorStop(0, o.lit);
    g.addColorStop(0.42, o.mid);
    g.addColorStop(1, o.dark);
    ctx.fillStyle = g;
    ctx.fillRect(x0, yTop, w, hFace);
    // 顶面
    ctx.fillStyle = rgba(o.top || '#e3d6bf', 0.85);
    ctx.fillRect(x0, yTop - 3, w, 3);
    // 石缝
    ctx.save();
    ctx.beginPath(); ctx.rect(x0, yTop, w, hFace); ctx.clip();
    ctx.strokeStyle = rgba(o.seam || '#2a241c', 0.28);
    ctx.lineWidth = 1;
    const bw = w / 9;
    for (let i = 1; i < 9; i++) {
      ctx.beginPath(); ctx.moveTo(x0 + i * bw, yTop); ctx.lineTo(x0 + i * bw, yTop + hFace); ctx.stroke();
    }
    for (let j = 1; j < Math.max(2, hFace / 16); j++) {
      ctx.beginPath(); ctx.moveTo(x0, yTop + j * 16); ctx.lineTo(x0 + w, yTop + j * 16); ctx.stroke();
    }
    ctx.restore();
  }

  function baulk(ctx, cx, yTop, w, o, posts = 8) {
    ctx.save();
    ctx.strokeStyle = rgba(o.color || '#efe3cb', o.alpha || 0.5);
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cx - w / 2, yTop); ctx.lineTo(cx + w / 2, yTop); ctx.stroke();
    if (posts) {
      const step = w / (posts - 1);
      for (let i = 0; i < posts; i++) {
        const x = cx - w / 2 + i * step;
        ctx.beginPath(); ctx.moveTo(x, yTop - 9); ctx.lineTo(x, yTop); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, yTop - 10, 1.3, 0, TAU); ctx.fillStyle = rgba(o.color || '#efe3cb', (o.alpha || 0.5) * 0.9); ctx.fill();
      }
    }
    ctx.restore();
  }

  // 檐下斗拱 / 椽头
  function bracketRow(ctx, cx, y, w, o) {
    const n = Math.max(6, Math.round(w / 13));
    const step = w / n;
    ctx.save();
    ctx.fillStyle = rgba(o.color || '#221d17', o.alpha || 0.7);
    for (let i = 0; i < n; i++) {
      const x = cx - w / 2 + step * (i + 0.5);
      ctx.fillRect(x - step * 0.16, y, step * 0.32, o.h || 7);
    }
    ctx.restore();
  }

  /* ── figures ────────────────────────────── */
  function figure(ctx, x, y, h, color, o = {}) {
    const u = h / 100;
    const lean = o.lean || 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(lean);
    ctx.fillStyle = color;
    if (o.shadow) {
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.beginPath(); ctx.ellipse(0, 0, 22 * u, 4.5 * u, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    // 长袍
    ctx.beginPath();
    ctx.moveTo(-7.5 * u, -74 * u);
    ctx.quadraticCurveTo(-13 * u, -52 * u, -17 * u, -14 * u);
    ctx.quadraticCurveTo(-18 * u, -3 * u, -11 * u, -2 * u);
    ctx.lineTo(11 * u, -2 * u);
    ctx.quadraticCurveTo(18 * u, -3 * u, 17 * u, -14 * u);
    ctx.quadraticCurveTo(13 * u, -52 * u, 7.5 * u, -74 * u);
    ctx.closePath();
    ctx.fill();
    // 袍摆下缘的飘带
    ctx.beginPath();
    ctx.moveTo(-16 * u, -12 * u);
    ctx.quadraticCurveTo(-26 * u, -8 * u, -22 * u, -1 * u);
    ctx.quadraticCurveTo(-18 * u, -5 * u, -14 * u, -5 * u);
    ctx.closePath();
    ctx.fill();
    // 肩与袖
    ctx.beginPath();
    ctx.moveTo(-8 * u, -74 * u);
    ctx.quadraticCurveTo(-13 * u, -70 * u, -12 * u, -58 * u);
    ctx.quadraticCurveTo(-10 * u, -50 * u, -7 * u, -52 * u);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(8 * u, -74 * u);
    ctx.quadraticCurveTo(13 * u, -70 * u, 12 * u, -58 * u);
    ctx.quadraticCurveTo(10 * u, -50 * u, 7 * u, -52 * u);
    ctx.closePath();
    ctx.fill();
    // 手
    ctx.beginPath(); ctx.arc(-11.5 * u, -50 * u, 2.6 * u, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(11.5 * u, -50 * u, 2.6 * u, 0, TAU); ctx.fill();
    // 颈
    ctx.fillRect(-2.4 * u, -80 * u, 4.8 * u, 6 * u);
    // 头
    ctx.beginPath(); ctx.ellipse(0, -85 * u, 6.2 * u, 7 * u, 0, 0, TAU); ctx.fill();
    // 发髻 / 冠
    if (o.hat === 'straw') {
      ctx.beginPath();
      ctx.moveTo(-13 * u, -88 * u);
      ctx.quadraticCurveTo(0, -101 * u, 13 * u, -88 * u);
      ctx.quadraticCurveTo(0, -84 * u, -13 * u, -88 * u);
      ctx.closePath();
      ctx.fill();
    } else if (o.hat === 'crown') {
      ctx.fillRect(-4.5 * u, -96 * u, 9 * u, 5 * u);
      ctx.beginPath(); ctx.ellipse(0, -93 * u, 6.5 * u, 2.4 * u, 0, 0, TAU); ctx.fill();
    } else {
      ctx.beginPath(); ctx.ellipse(0, -93 * u, 3.2 * u, 2.6 * u, 0, 0, TAU); ctx.fill();
    }
    // 须 / 长髯
    if (o.beard) {
      ctx.beginPath();
      ctx.moveTo(-2.6 * u, -82 * u);
      ctx.quadraticCurveTo(0, -70 * u, 2.6 * u, -82 * u);
      ctx.closePath();
      ctx.fill();
    }
    // 杖
    if (o.staff) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 * u;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-13 * u, -50 * u);
      ctx.lineTo(-15 * u, 1 * u);
      ctx.stroke();
    }
    // 旗
    if (o.flag) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8 * u;
      ctx.beginPath(); ctx.moveTo(9 * u, -52 * u); ctx.lineTo(11 * u, -104 * u); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(11 * u, -104 * u);
      ctx.quadraticCurveTo(26 * u, -100 * u, 24 * u, -90 * u);
      ctx.quadraticCurveTo(18 * u, -94 * u, 11 * u, -92 * u);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function archer(ctx, x, y, h, color, pull = 0, angle = 0) {
    const u = h / 100;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    // 双腿（前弓后箭）
    ctx.beginPath();
    ctx.moveTo(-1 * u, -40 * u);
    ctx.quadraticCurveTo(-9 * u, -22 * u, -14 * u, -1 * u);
    ctx.lineTo(-6 * u, -1 * u);
    ctx.quadraticCurveTo(1 * u, -20 * u, 4 * u, -38 * u);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(3 * u, -40 * u);
    ctx.quadraticCurveTo(10 * u, -22 * u, 16 * u, -1 * u);
    ctx.lineTo(9 * u, -1 * u);
    ctx.quadraticCurveTo(4 * u, -20 * u, 1 * u, -38 * u);
    ctx.closePath();
    ctx.fill();
    // 袍裙
    ctx.beginPath();
    ctx.moveTo(-7 * u, -66 * u);
    ctx.quadraticCurveTo(-13 * u, -50 * u, -11 * u, -34 * u);
    ctx.lineTo(10 * u, -34 * u);
    ctx.quadraticCurveTo(12 * u, -50 * u, 7 * u, -66 * u);
    ctx.closePath();
    ctx.fill();
    // 上身
    ctx.beginPath();
    ctx.moveTo(-7 * u, -66 * u);
    ctx.quadraticCurveTo(-9 * u, -76 * u, -4 * u, -78 * u);
    ctx.lineTo(5 * u, -78 * u);
    ctx.quadraticCurveTo(9 * u, -76 * u, 7 * u, -66 * u);
    ctx.closePath();
    ctx.fill();
    // 颈 + 头 + 髻
    ctx.fillRect(-2 * u, -82 * u, 4 * u, 5 * u);
    ctx.beginPath(); ctx.arc(0, -86 * u, 5.6 * u, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-1 * u, -92 * u, 3.4 * u, 2.6 * u, 0, 0, TAU); ctx.fill();
    // 背后的箭囊
    ctx.save();
    ctx.rotate(-0.22);
    ctx.fillRect(-11 * u, -78 * u, 5 * u, 16 * u);
    ctx.restore();
    // 弓
    const bx = 13 * u, by = -70 * u;
    const bend = 9 * u - pull * 4 * u;
    ctx.lineWidth = 2.4 * u;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(bx - 3 * u, by - 22 * u);
    ctx.quadraticCurveTo(bx + bend, by, bx - 3 * u, by + 22 * u);
    ctx.stroke();
    // 弦
    const pullX = bx - 3 * u - pull * 17 * u;
    ctx.lineWidth = 0.9 * u;
    ctx.strokeStyle = rgba('#f0e6d2', 0.72);
    ctx.beginPath();
    ctx.moveTo(bx - 3 * u, by - 22 * u);
    ctx.lineTo(pullX, by);
    ctx.lineTo(bx - 3 * u, by + 22 * u);
    ctx.stroke();
    // 持弓前臂
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.4 * u;
    ctx.beginPath();
    ctx.moveTo(6 * u, -74 * u);
    ctx.lineTo(bx - 1 * u, by + 2 * u);
    ctx.stroke();
    // 拉弦臂
    ctx.lineWidth = 3.2 * u;
    ctx.beginPath();
    ctx.moveTo(-5 * u, -74 * u);
    ctx.quadraticCurveTo(-2 * u, by - 4 * u, pullX + 1 * u, by);
    ctx.stroke();
    ctx.restore();
  }

  function bird(ctx, x, y, s, flap = 0, color = '#1b1813') {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, s * 0.13);
    ctx.lineCap = 'round';
    const f = Math.sin(flap) * s * 0.55;
    ctx.beginPath();
    ctx.moveTo(-s, -f * 0.2);
    ctx.quadraticCurveTo(-s * 0.45, -s * 0.5 - f * 0.4, 0, 0);
    ctx.quadraticCurveTo(s * 0.45, -s * 0.5 - f * 0.4, s, -f * 0.2);
    ctx.stroke();
    ctx.restore();
  }

  /* ── misc ───────────────────────────────── */
  function stones(ctx, w, h, o) {
    const rnd = mulberry32((o.seed || 3) * 131);
    ctx.save();
    for (let i = 0; i < (o.count || 16); i++) {
      const x = rnd() * w, y = o.y + rnd() * o.spread;
      const r = (0.5 + rnd() * 2.4) * (o.scale || 1);
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.5, r * 0.7, rnd() * 3, 0, TAU);
      ctx.fillStyle = rgba(o.color || '#5c5449', (o.alpha || 0.4) * (0.4 + rnd() * 0.6));
      ctx.fill();
    }
    ctx.restore();
  }
  function particles(ctx, list) {
    for (const p of list) {
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function groundGradient(ctx, w, h, y0) {
    const g = ctx.createLinearGradient(0, y0, 0, h);
    g.addColorStop(0, 'rgba(30,26,20,0)');
    g.addColorStop(1, 'rgba(18,16,12,.55)');
    ctx.fillStyle = g;
    ctx.fillRect(0, y0, w, h - y0);
  }

  return {
    TAU, clamp, lerp, smooth, rad, mulberry32, hash2, noise2, fbm, ridge1,
    rgba, mix, hex2rgb, sky, glow, sunDisc, ridgePoints, mountains, mistBand,
    roofPath, roof, terrace, baulk, bracketRow, figure, archer, bird, stones,
    particles, groundGradient,
  };
})();