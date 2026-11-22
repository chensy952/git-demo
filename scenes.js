/* ─────────────────────────────────────────────
   scenes.js — 六道门
   每道门里的世界都是算出来的：山脊、云、火、雨。
   ───────────────────────────────────────────── */
(function () {
  const { TAU, clamp, lerp, rgba, mulberry32 } = P;
  const SCENES = {};

/* ═══════════════════════════════════════════
     山 门 · 天 坛
     ═══════════════════════════════════════════ */
  function hallRoof(g, cx, yEave, halfW, rise, ridgeHalf, o) {
    o = o || {};
    const yR = yEave - rise;
    const sag = rise * 0.075;
    const tip = rise * 0.28;
    const LX = cx - halfW, RX = cx + halfW;
    const lr = cx - ridgeHalf, rr = cx + ridgeHalf;
    const TL = [LX, yEave - tip], TR = [RX, yEave - tip];

    const front = () => {
      g.beginPath();
      g.moveTo(TL[0], TL[1]);
      g.quadraticCurveTo(cx - halfW * 0.80, yEave - rise * 0.58, lr, yR);
      g.lineTo(rr, yR);
      g.quadraticCurveTo(cx + halfW * 0.80, yEave - rise * 0.58, TR[0], TR[1]);
      g.quadraticCurveTo(cx, yEave + sag, TL[0], TL[1]);
      g.closePath();
    };

    const under = g.createLinearGradient(0, yEave - rise * 0.1, 0, yEave + rise * 0.3);
    under.addColorStop(0, 'rgba(24,20,14,.6)');
    under.addColorStop(1, 'rgba(24,20,14,0)');
    g.fillStyle = under;
    g.fillRect(LX, yEave - rise * 0.1, halfW * 2, rise * 0.4);

    front();
    const gr = g.createLinearGradient(LX, yR, RX, yEave + sag);
    gr.addColorStop(0, o.dark || '#1f211a');
    gr.addColorStop(0.30, o.mid || '#303226');
    gr.addColorStop(0.60, o.lit2 || '#434532');
    gr.addColorStop(0.87, o.lit || '#565840');
    gr.addColorStop(1, o.edge || '#343628');
    g.fillStyle = gr;
    g.fill();

    g.save();
    front();
    g.clip();

    const stepX = Math.max(4, halfW / 26);
    for (let i = -halfW * 1.05; i < halfW * 1.05; i += stepX * 2) {
      const k = Math.abs(i) / halfW;
      // 暗瓦沟
      g.strokeStyle = 'rgba(12,12,9,' + (0.44 - k * 0.10) + ')';
      g.lineWidth = stepX * 0.95;
      g.beginPath();
      g.moveTo(cx + i * 0.94, yR + rise * 0.02);
      g.lineTo(cx + i * 1.10, yEave + sag + tip);
      g.stroke();
      // 亮瓦脊
      g.strokeStyle = 'rgba(226,216,178,.10)';
      g.lineWidth = stepX * 0.34;
      g.beginPath();
      g.moveTo(cx + (i + stepX * 0.62) * 0.94, yR + rise * 0.03);
      g.lineTo(cx + (i + stepX * 0.62) * 1.10, yEave + sag + tip);
      g.stroke();
    }
    for (let k = 1; k <= 5; k++) {
      const p = k / 6;
      const hw = halfW * (1 - p * 0.82) + ridgeHalf * p * 0.6;
      const yy = yEave - p * rise * 0.90;
      g.strokeStyle = 'rgba(12,12,8,.28)';
      g.lineWidth = 1.1;
      g.beginPath();
      g.moveTo(cx - hw, yy);
      g.quadraticCurveTo(cx, yy + sag * (1 - p) * 0.9, cx + hw, yy);
      g.stroke();
    }
    const lg = g.createLinearGradient(cx + halfW * 0.1, yR, cx + halfW, yEave);
    lg.addColorStop(0, 'rgba(255,240,204,0)');
    lg.addColorStop(1, 'rgba(255,242,208,.30)');
    g.fillStyle = lg;
    g.fillRect(LX, yR - 6, halfW * 2, rise + sag + 20);
    const dg = g.createLinearGradient(LX, 0, cx - halfW * 0.2, 0);
    dg.addColorStop(0, 'rgba(12,13,9,.5)');
    dg.addColorStop(1, 'rgba(12,13,9,0)');
    g.fillStyle = dg;
    g.fillRect(LX, yR - 6, halfW, rise + sag + 20);
    g.restore();

    // 檐口
    g.beginPath();
    g.moveTo(TL[0], TL[1]);
    g.quadraticCurveTo(cx, yEave + sag, TR[0], TR[1]);
    g.lineTo(TR[0] + 1, TR[1] + rise * 0.098);
    g.quadraticCurveTo(cx, yEave + sag + rise * 0.12, TL[0] - 1, TL[1] + rise * 0.098);
    g.closePath();
    g.fillStyle = 'rgba(22,19,13,.94)';
    g.fill();

    const n = Math.max(18, Math.round(halfW * 2 / 10));
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const x = lerp(TL[0], TR[0], u);
      const yy = yEave + Math.sin(u * Math.PI) * sag + rise * 0.048;
      g.beginPath();
      g.arc(x, yy, Math.max(1.1, rise * 0.015), 0, TAU);
      g.fillStyle = 'rgba(178,156,116,.6)';
      g.fill();
      g.fillStyle = 'rgba(196,166,120,.34)';
      g.fillRect(x - 0.8, yy + rise * 0.030, 1.6, rise * 0.045);
    }

    g.beginPath();
    g.moveTo(TL[0], TL[1]);
    g.quadraticCurveTo(cx, yEave + sag, TR[0], TR[1]);
    g.strokeStyle = 'rgba(248,234,200,.36)';
    g.lineWidth = 1.2;
    g.stroke();

    const ridge = () => {
      g.beginPath();
      g.moveTo(TL[0], TL[1]);
      g.quadraticCurveTo(cx - halfW * 0.80, yEave - rise * 0.58, lr, yR);
      g.lineTo(rr, yR);
      g.quadraticCurveTo(cx + halfW * 0.80, yEave - rise * 0.58, TR[0], TR[1]);
    };
    ridge();
    g.strokeStyle = 'rgba(16,15,10,.66)';
    g.lineWidth = Math.max(2.6, rise * 0.042);
    g.stroke();
    g.save();
    g.translate(0, -2.2);
    ridge();
    g.strokeStyle = 'rgba(250,236,204,.34)';
    g.lineWidth = 1.3;
    g.stroke();
    g.restore();

    // 飞檐翘角
    if (o.wings) {
      const wy = Math.max(4, rise * 0.30);
      [-1, 1].forEach((dir) => {
        const bx = cx + dir * halfW;
        const by = yEave - tip;
        g.beginPath();
        g.moveTo(bx, by + 1);
        g.quadraticCurveTo(bx + dir * wy * 1.1, by - wy * 0.30, bx + dir * wy * 1.30, by - wy * 0.86);
        g.quadraticCurveTo(bx + dir * wy * 0.75, by - wy * 0.35, bx, by);
        g.closePath();
        g.fillStyle = 'rgba(26,24,17,.9)';
        g.fill();
      });
    }

    const s2 = Math.max(7, rise * 0.15);
    [[lr, -1], [rr, 1]].forEach(([x, dir]) => {
      g.beginPath();
      g.moveTo(x, yR + 2);
      g.quadraticCurveTo(x + dir * s2 * 0.30, yR - s2 * 0.90, x + dir * s2 * 1.0, yR - s2 * 1.02);
      g.quadraticCurveTo(x + dir * s2 * 0.72, yR - s2 * 0.40, x + dir * s2 * 0.26, yR + 2);
      g.closePath();
      g.fillStyle = 'rgba(18,17,12,.96)';
      g.fill();
    });
  }

  function drawStorey(g, cx, yBot, yTop, bw, bh, i, o) {
    o = o || {};
    const bh2 = yBot - yTop;
    const half = bw / 2;
    // 平座（挑出的楼板）
    g.fillStyle = 'rgba(58,38,26,.95)';
    g.fillRect(cx - half * 1.04, yBot - bh2 * 0.055, bw * 1.04, bh2 * 0.055);
    g.fillStyle = 'rgba(236,220,190,.35)';
    g.fillRect(cx - half * 1.04, yBot - bh2 * 0.055, bw * 1.04, 1.4);

    // 墙面
    const wall = g.createLinearGradient(cx - half, 0, cx + half, 0);
    wall.addColorStop(0, '#2f1c14');
    wall.addColorStop(0.20, '#4a2a1d');
    wall.addColorStop(0.55, '#61382a');
    wall.addColorStop(0.84, '#79462f');
    wall.addColorStop(1, '#8a5238');
    g.fillStyle = wall;
    g.fillRect(cx - half, yTop, bw, bh2);

    // 侧面向暗（体积）
    const side = g.createLinearGradient(cx + half * 0.62, 0, cx + half, 0);
    side.addColorStop(0, 'rgba(24,15,10,0)');
    side.addColorStop(1, 'rgba(24,15,10,.42)');
    g.fillStyle = side;
    g.fillRect(cx + half * 0.62, yTop, half * 0.38, bh2);

    // 檐下暗影
    const topShade = g.createLinearGradient(0, yTop, 0, yTop + bh2 * 0.34);
    topShade.addColorStop(0, 'rgba(16,12,9,.62)');
    topShade.addColorStop(1, 'rgba(16,12,9,0)');
    g.fillStyle = topShade;
    g.fillRect(cx - half, yTop, bw, bh2 * 0.34);

    // 格扇窗
    const bays = 5;
    const bayW = bw / bays;
    for (let b = 0; b < bays; b++) {
      const x0 = cx - half + b * bayW;
      const inset = bayW * 0.16;
      const wy = yTop + bh2 * 0.30;
      const wh = bh2 * 0.50;
      const dg = g.createLinearGradient(0, wy, 0, wy + wh);
      dg.addColorStop(0, '#1c120c');
      dg.addColorStop(1, '#120c08');
      g.fillStyle = dg;
      g.fillRect(x0 + inset, wy, bayW - inset * 2, wh);
      g.strokeStyle = 'rgba(210,168,112,.30)';
      g.lineWidth = 1;
      for (let k = 1; k < 4; k++) {
        const y2 = wy + (wh / 4) * k;
        g.beginPath(); g.moveTo(x0 + inset, y2); g.lineTo(x0 + bayW - inset, y2); g.stroke();
      }
      for (let k = 1; k < 2; k++) {
        const x2 = x0 + inset + (bayW - inset * 2) * 0.5;
        g.beginPath(); g.moveTo(x2, wy); g.lineTo(x2, wy + wh); g.stroke();
      }
      if (b === 2 && (i === 0 || i === 2)) {
        P.glow(g, x0 + bayW / 2, wy + wh * 0.6, bayW * 0.9, '#f0a565', 0.30);
      }
    }

    // 立柱
    for (let b = 0; b <= bays; b++) {
      const x = cx - half + bayW * b;
      const cw = Math.max(2, bw * 0.017);
      const cg = g.createLinearGradient(x - cw / 2, 0, x + cw / 2, 0);
      cg.addColorStop(0, '#3a1f16');
      cg.addColorStop(0.42, '#6d3926');
      cg.addColorStop(0.78, '#8c4d33');
      cg.addColorStop(1, '#a25d42');
      g.fillStyle = cg;
      g.fillRect(x - cw / 2, yTop, cw, bh2);
    }

    // 栏杆（下一层平座上）
    P.baulk(g, cx, yBot - bh2 * 0.055, bw * 0.94, { color: '#d9c7a4', alpha: 0.30 }, Math.max(3, Math.round(bw / 30)));

    // 额枋 + 斗拱
    const bandH = Math.max(4, bh2 * 0.13);
    g.fillStyle = '#241610';
    g.fillRect(cx - half, yTop, bw, bandH);
    P.bracketRow(g, cx, yTop + bandH, bw * 0.96, { color: '#e6cea4', alpha: 0.30 });
  }

  function drawHall(g, w, h) {
    const cx = w * 0.585;
    const base = h * 0.945;
    const tw = Math.min(w * 0.46, h * 0.74);
    const tierH = Math.max(9, h * 0.017);
    const gap = tierH * 1.40;
    const stone = { lit: '#f2e7d1', mid: '#d3c3a6', dark: '#9d8e74', seam: '#4a3f30', top: '#fbf3e0' };

    // 地面投影
    g.save();
    g.translate(cx - tw * 0.26, base - h * 0.012);
    g.scale(1, 0.14);
    const sh = g.createRadialGradient(0, 0, tw * 0.04, 0, 0, tw * 0.72);
    sh.addColorStop(0, 'rgba(48,37,24,.5)');
    sh.addColorStop(0.5, 'rgba(48,37,24,.24)');
    sh.addColorStop(1, 'rgba(48,37,24,0)');
    g.fillStyle = sh;
    g.beginPath(); g.arc(0, 0, tw * 0.72, 0, TAU); g.fill();
    g.restore();

    // 台基
    for (let i = 0; i < 3; i++) {
      const ww = tw * (1 - i * 0.055);
      const y = base - i * gap;
      P.terrace(g, cx, y - tierH, ww, tierH, stone);
      g.fillStyle = 'rgba(255,250,238,.8)';
      g.fillRect(cx - ww / 2, y - tierH - 1.6, ww, 2.1);
      g.fillStyle = 'rgba(40,31,20,.34)';
      g.fillRect(cx - ww / 2, y - tierH + 1.6, ww, 2.8);
    }
    const topY = base - 3 * gap;

    // 踏道
    const sw = tw * 0.105;
    const sg = g.createLinearGradient(cx - sw, 0, cx + sw, 0);
    sg.addColorStop(0, 'rgba(188,172,144,1)');
    sg.addColorStop(0.40, 'rgba(232,220,196,1)');
    sg.addColorStop(0.76, 'rgba(216,201,174,1)');
    sg.addColorStop(1, 'rgba(158,142,117,1)');
    g.fillStyle = sg;
    g.beginPath();
    g.moveTo(cx - sw * 0.82, topY);
    g.lineTo(cx + sw * 0.82, topY);
    g.lineTo(cx + sw, base + 2);
    g.lineTo(cx - sw, base + 2);
    g.closePath();
    g.fill();
    g.strokeStyle = 'rgba(68,54,38,.30)';
    g.lineWidth = 1;
    for (let i = 1; i < 16; i++) {
      const p = i / 16;
      const yy = lerp(topY, base + 2, p * p * 0.80 + p * 0.20);
      const hw = lerp(sw * 0.82, sw, p);
      g.beginPath(); g.moveTo(cx - hw, yy); g.lineTo(cx + hw, yy); g.stroke();
    }
    [1, -1].forEach((dir) => {
      g.strokeStyle = 'rgba(254,247,230,.62)';
      g.lineWidth = 1.7;
      g.beginPath();
      g.moveTo(cx + dir * sw * 0.82, topY);
      g.lineTo(cx + dir * sw, base + 2);
      g.stroke();
    });

    // 台基栏杆
    [[-1, cx - sw * 0.95, cx - tw * 0.445], [1, cx + sw * 0.95, cx + tw * 0.445]].forEach(([, x0, x1]) => {
      const ww = Math.abs(x1 - x0);
      P.baulk(g, (x0 + x1) / 2, topY - 1, ww, { color: '#fdf5e2', alpha: 0.55 }, Math.max(4, Math.round(ww / 38)));
    });

    // ── 楼身 ───────────────────────────────
    const N = 5;
    const baseW = tw * 0.90;
    const topW = tw * 0.34;
    const rise = tw * 0.066;
    let y = topY;
    const roofCols = [
      { dark: '#1b1d17', mid: '#2b2d22', lit2: '#3d3f30', lit: '#4e5039', edge: '#2f3128' },
      { dark: '#1d1f19', mid: '#2e3025', lit2: '#414334', lit: '#53553d', edge: '#31332a' },
      { dark: '#1f211b', mid: '#313327', lit2: '#454737', lit: '#585a40', edge: '#33352c' },
      { dark: '#21231c', mid: '#343629', lit2: '#484a39', lit: '#5b5d42', edge: '#35372d' },
      { dark: '#23251e', mid: '#373a2c', lit2: '#4c4e3c', lit: '#5f6145', edge: '#373930' },
    ];

    for (let i = 0; i < N; i++) {
      const bw = lerp(baseW, topW, i / (N - 1));
      const bodyH = tw * (0.090 - i * 0.0085);
      const bodyTop = y - bodyH;
      drawStorey(g, cx, y, bodyTop, bw, bodyH, i);
      const halfW = bw * 0.62;
      hallRoof(g, cx, bodyTop + bodyH * 0.02, halfW, rise, halfW * 0.46, Object.assign({}, roofCols[i]));
      y = bodyTop - rise * 0.92;
    }

    // 攒尖顶 + 宝顶
    const capW = topW * 0.52;
    const capH = tw * 0.105;
    const capY = y;
    g.beginPath();
    g.moveTo(cx - capW, capY);
    g.quadraticCurveTo(cx - capW * 0.45, capY - capH * 0.72, cx, capY - capH);
    g.quadraticCurveTo(cx + capW * 0.45, capY - capH * 0.72, cx + capW, capY);
    g.quadraticCurveTo(cx, capY + capH * 0.10, cx - capW, capY);
    g.closePath();
    const capG = g.createLinearGradient(cx - capW, capY - capH, cx + capW, capY);
    capG.addColorStop(0, '#23251d');
    capG.addColorStop(0.55, '#3b3d2e');
    capG.addColorStop(1, '#54563e');
    g.fillStyle = capG;
    g.fill();
    g.strokeStyle = 'rgba(22,20,14,.55)';
    g.lineWidth = 1.6;
    g.stroke();
    // 垂脊
    g.strokeStyle = 'rgba(20,18,13,.5)';
    g.lineWidth = 1.4;
    [-1, 1].forEach((d) => {
      g.beginPath();
      g.moveTo(cx + d * capW, capY);
      g.quadraticCurveTo(cx + d * capW * 0.5, capY - capH * 0.78, cx, capY - capH);
      g.stroke();
    });
    // 宝顶
    const fy = capY - capH;
    g.fillStyle = '#8a6c3e';
    g.fillRect(cx - tw * 0.006, fy - tw * 0.052, tw * 0.012, tw * 0.044);
    g.fillStyle = '#b78f52';
    g.fillRect(cx - tw * 0.012, fy - tw * 0.016, tw * 0.024, tw * 0.012);
    g.fillStyle = '#e8c78c';
    g.beginPath(); g.arc(cx, fy - tw * 0.062, tw * 0.013, 0, TAU); g.fill();
    g.fillStyle = 'rgba(255,236,198,.85)';
    g.beginPath(); g.arc(cx - tw * 0.004, fy - tw * 0.066, tw * 0.0045, 0, TAU); g.fill();
    P.glow(g, cx, fy - tw * 0.055, tw * 0.09, '#f8dca6', 0.42);

    // 台前石灯
    [[-1], [1]].forEach(([dir]) => {
      const x = cx + dir * tw * 0.40;
      const yy = topY + tierH * 0.5;
      const lw = tw * 0.022;
      const lh = tw * 0.050;
      g.fillStyle = 'rgba(70,60,44,.8)';
      g.fillRect(x - lw * 0.15, yy - lh, lw * 0.30, lh);
      g.fillRect(x - lw * 0.55, yy - lh - lw * 0.14, lw * 1.1, lw * 0.14);
      g.fillStyle = 'rgba(250,198,130,.6)';
      g.fillRect(x - lw * 0.32, yy - lh - lw * 0.32, lw * 0.64, lw * 0.18);
      P.glow(g, x, yy - lh - lw * 0.2, lw * 2.0, '#fac78c', 0.42);
    });
  }

  SCENES.home = {
    id: 'home',
    paintStatic(g, w, h) {
      const hor = h * 0.665;
      P.sky(g, w, h, [
        [0, '#8e9aa0'], [0.14, '#a3aca9'], [0.30, '#c3c1b3'],
        [0.46, '#dcd2bc'], [0.58, '#eaddc2'], [0.68, '#f0e2c6'], [0.78, '#e6d5b5'], [1, '#cdb995'],
      ]);
      // 日
      const sx = w * 0.795, sy = h * 0.185, sr = Math.min(w, h) * 0.021;
      P.glow(g, sx, sy, Math.min(w, h) * 0.34, '#f4dcae', 0.34);
      P.glow(g, sx, sy, Math.min(w, h) * 0.115, '#fbeac6', 0.55);
      P.sunDisc(g, sx, sy, sr, '#fffef6', '#f6ddac', 1);

      // 云（几笔横向的软云）
      (function clouds() {
        const rnd = mulberry32(3.3);
        for (let i = 0; i < 9; i++) {
          const x = rnd() * w, y = h * (0.12 + rnd() * 0.30);
          const rw = w * (0.10 + rnd() * 0.16), rh = h * (0.012 + rnd() * 0.02);
          const cg = g.createRadialGradient(x, y, 0, x, y, rw);
          cg.addColorStop(0, 'rgba(255,249,235,.30)');
          cg.addColorStop(1, 'rgba(255,249,235,0)');
          g.save();
          g.translate(x, y); g.scale(1, rh / rw);
          g.fillStyle = cg;
          g.beginPath(); g.arc(0, 0, rw, 0, TAU); g.fill();
          g.restore();
        }
      })();

      // 远山
      P.mountains(g, {
        w, h, base: hor + h * 0.002, amp: h * 0.115, scale: 0.0020, seed: 6.1,
        top: '#a7ada6', bottom: '#919a93', haze: 0.42, hazeColor: '#eee3cb',
        rim: 'rgba(255,251,240,.26)', karst: true, floor: h * 0.80,
      });

      // 云海（后层）
      P.mistBand(g, { w, y: hor + h * 0.005, height: h * 0.070, seed: 9, color: '#f7f0de', alpha: 0.70, count: 26 });

      // 中景孤峰，从云海里冒出来
      function peak(px, py, pw, ph2, seed, alpha, color) {
        const rnd = mulberry32(seed);
        g.beginPath();
        g.moveTo(px - pw, py);
        const n = 7;
        for (let i = 0; i <= n; i++) {
          const u = i / n;
          const x = px - pw + u * pw * 2;
          const k = 1 - Math.abs(u - 0.5) * 2;
          const hh = ph2 * (0.35 + Math.pow(k, 1.5) * 0.85 + (rnd() - 0.5) * 0.18);
          g.lineTo(x, py - hh);
        }
        g.lineTo(px + pw, py);
        g.closePath();
        g.fillStyle = color;
        g.globalAlpha = alpha;
        g.fill();
        g.globalAlpha = 1;
      }
      peak(w * 0.075, hor + h * 0.055, w * 0.075, h * 0.105, 2.2, 0.55, '#6f7364');
      peak(w * 0.305, hor + h * 0.045, w * 0.048, h * 0.070, 5.7, 0.45, '#7d8171');
      peak(w * 0.925, hor + h * 0.050, w * 0.085, h * 0.095, 8.3, 0.5, '#6b6f60');
      peak(w * 0.735, hor + h * 0.040, w * 0.040, h * 0.055, 11.1, 0.36, '#83866f');

      // 云海（前层，压住峰脚）
      P.mistBand(g, { w, y: hor + h * 0.048, height: h * 0.060, seed: 17, color: '#fbf5e7', alpha: 0.85, count: 24 });
      P.mistBand(g, { w, y: hor + h * 0.082, height: h * 0.045, seed: 23, color: '#fdf8ec', alpha: 0.6, count: 18 });

      // 广场
      const plazaTop = h * 0.735;
      const pg = g.createLinearGradient(0, plazaTop, 0, h);
      pg.addColorStop(0, '#cdbb9b');
      pg.addColorStop(0.20, '#c3af8e');
      pg.addColorStop(0.60, '#a5937a');
      pg.addColorStop(1, '#6f6550');
      g.fillStyle = pg;
      g.fillRect(0, plazaTop, w, h - plazaTop);

      P.mistBand(g, { w, y: plazaTop - h * 0.012, height: h * 0.045, seed: 41, color: '#f4ead6', alpha: 0.45, count: 16 });

      // 透视石板
      g.save();
      g.beginPath(); g.rect(0, plazaTop, w, h - plazaTop); g.clip();
      g.strokeStyle = 'rgba(64,52,36,.13)';
      g.lineWidth = 1;
      for (let i = -14; i <= 14; i++) {
        g.beginPath();
        g.moveTo(w * 0.585 + i * w * 0.028, plazaTop);
        g.lineTo(w * 0.585 + i * w * 0.150, h);
        g.stroke();
      }
      for (let i = 0; i < 12; i++) {
        const pp = i / 12;
        const yy = plazaTop + Math.pow(pp, 1.7) * (h - plazaTop);
        g.beginPath(); g.moveTo(0, yy); g.lineTo(w, yy); g.stroke();
      }
      // 广场上的斜光
      const lightBand = g.createLinearGradient(w * 0.4, plazaTop, w * 0.9, h);
      lightBand.addColorStop(0, 'rgba(255,240,206,.10)');
      lightBand.addColorStop(1, 'rgba(255,240,206,0)');
      g.fillStyle = lightBand;
      g.fillRect(0, plazaTop, w, h - plazaTop);
      g.restore();

      drawHall(g, w, h);

      // 脚下云海
      P.mistBand(g, { w, y: h * 0.935, height: h * 0.070, seed: 51, color: '#f8f1e1', alpha: 0.80, count: 26 });
      P.mistBand(g, { w, y: h * 0.975, height: h * 0.060, seed: 63, color: '#fdf7ea', alpha: 0.95, count: 22 });

      // 底部压暗
      const fg = g.createLinearGradient(0, h * 0.86, 0, h);
      fg.addColorStop(0, 'rgba(30,24,17,0)');
      fg.addColorStop(1, 'rgba(26,21,15,.42)');
      g.fillStyle = fg;
      g.fillRect(0, h * 0.86, w, h * 0.14);
    },

    paintDynamic(d, w, h, t, par, S) {
      const cx = w * 0.585;
      const tw = Math.min(w * 0.52, h * 0.80);
      const base = h * 0.928;
      const tierH = Math.max(9, h * 0.019);
      const topY = base - 3 * tierH * 1.5;

      // 石灯的余烬
      if (!S.embers) S.embers = Array.from({ length: 22 }, () => ({ a: Math.random(), l: 0.5 + Math.random() * 0.7, ph: Math.random() * TAU, side: Math.random() > 0.5 ? 1 : -1 }));
      S.embers.forEach((e) => {
        const ex = cx + e.side * tw * 0.455;
        const ey = topY + tierH * 1.1 - tw * 0.062 * 1.2;
        const p = (e.a + t * 0.05 * e.l) % 1;
        d.globalAlpha = (1 - p) * 0.55;
        d.fillStyle = '#ffcf96';
        d.beginPath();
        d.arc(ex + Math.sin(t * 1.3 + e.ph) * 5, ey - p * h * 0.10, 0.8 + (1 - p) * 1.1, 0, TAU);
        d.fill();
      });
      d.globalAlpha = 1;

      // 云影掠过广场
      for (let i = 0; i < 4; i++) {
        const x = (((t * 0.004 * (0.6 + i * 0.2) + i * 0.31) % 1.5) - 0.25) * w;
        d.globalAlpha = 0.05;
        P.glow(d, x, h * (0.78 + i * 0.045), w * 0.18, '#5c5342', 1);
      }
      d.globalAlpha = 1;

      // 尘埃
      if (!S.motes) {
        const rnd = mulberry32(7);
        S.motes = Array.from({ length: 48 }, () => ({
          x: rnd() * w, y: rnd() * h, r: 0.4 + rnd() * 1.35,
          sp: 0.05 + rnd() * 0.22, ph: rnd() * TAU,
        }));
      }
      for (const m of S.motes) {
        m.y -= m.sp * 0.45;
        m.x += Math.sin(t * 0.25 + m.ph) * 0.14;
        if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
        d.globalAlpha = 0.14 + 0.2 * Math.abs(Math.sin(t * 0.4 + m.ph));
        d.fillStyle = '#fff4dc';
        d.beginPath(); d.arc(m.x + par.x * 6, m.y + par.y * 4, m.r, 0, TAU); d.fill();
      }
      d.globalAlpha = 1;
    },
  };

  /* ═══════════════════════════════════════════
     01 愚公移山
     ═══════════════════════════════════════════ */
  SCENES.yugong = {
    id: 'yugong',
    reset() {
      this.S = { baskets: 0, gen: 0, age: 0, shift: 0, birds: null, motes: null, dust: null };
    },
    paintStatic(g, w, h) {
      P.sky(g, w, h, [[0, '#c9bfa9'], [0.25, '#ded2ba'], [0.5, '#ece2cb'], [0.68, '#f0e7d1'], [1, '#d8cbb1']]);
      P.sunDisc(g, w * 0.18, h * 0.22, Math.min(w, h) * 0.03, '#fff8e6', '#eed7a8', 0.8);
      P.mountains(g, { w, h, base: h * 0.62, amp: h * 0.20, scale: 0.0021, seed: 2.4, top: '#b3a68e', bottom: '#8f846c', haze: 0.2, karst: true });
      P.mistBand(g, { w, y: h * 0.60, height: h * 0.07, seed: 4, color: '#f4ecd9', alpha: 0.55 });

      // 两座大山（凿山：崖壁层理 · 凿出的梯级 · 碎石）
      const mx = [
        { x: w * 0.325, hgt: h * 0.545, half: w * 0.275, side: -1, ph: 0.6, seed: 11 },
        { x: w * 0.700, hgt: h * 0.455, half: w * 0.235, side: 1, ph: 2.2, seed: 29 },
      ];
      mx.forEach((m, i) => {
        const x = m.x, hgt = m.hgt, half = m.half;
        const yBase = h * 0.878;
        const rnd0 = mulberry32(m.seed);
        const bumps = [rnd0(), rnd0(), rnd0(), rnd0(), rnd0()];
        const raw = (u) => {
          const s0 = Math.sin(Math.PI * Math.pow(clamp(u, 0, 1), 0.92));
          let v = Math.pow(s0, 1.18);
          v *= 1 + 0.070 * Math.sin(u * Math.PI * 1.9 + m.ph) + 0.038 * Math.sin(u * Math.PI * 4.3 + bumps[0] * 6);
          v += 0.026 * Math.sin(u * Math.PI * 7.7 + bumps[1] * 6) * Math.sin(u * Math.PI);
          return Math.max(0, v);
        };
        let pmax = 0;
        for (let k = 0; k <= 60; k++) pmax = Math.max(pmax, raw(k / 60));
        const prof = (u) => clamp(raw(u) / (pmax || 1), 0, 1);
        const N = 56;
        const pt = (u) => [x - half + 2 * half * u, yBase - hgt * prof(u)];
        const mPath = () => {
          g.beginPath();
          g.moveTo(x - half, yBase);
          for (let k = 0; k <= N; k++) { const p = pt(k / N); g.lineTo(p[0], p[1]); }
          g.lineTo(x + half, yBase);
          g.closePath();
        };
        const grd = g.createLinearGradient(x - half, 0, x + half, 0);
        grd.addColorStop(0, i ? '#e4d6b6' : '#eddfbe');
        grd.addColorStop(0.24, i ? '#c6b797' : '#d2c3a2');
        grd.addColorStop(0.58, i ? '#8b8168' : '#94896e');
        grd.addColorStop(0.86, i ? '#4a4431' : '#544c36');
        grd.addColorStop(1, i ? '#2e2b1f' : '#363224');
        g.fillStyle = grd;
        mPath(); g.fill();

        g.save(); mPath(); g.clip();
        for (let k = 1; k <= 14; k++) {
          const q = k / 15;
          const y = yBase - hgt * (0.14 + q * 0.78);
          g.strokeStyle = 'rgba(58,52,40,' + (0.06 + 0.07 * Math.abs(Math.sin(k * 1.9))).toFixed(3) + ')';
          g.lineWidth = 0.8 + (k % 3 === 0 ? 1 : 0);
          g.beginPath();
          g.moveTo(x - half, y + Math.sin(k * 1.7) * 2.5);
          g.bezierCurveTo(x - half * 0.4, y - 4, x + half * 0.3, y + 4, x + half, y - Math.sin(k) * 2.5);
          g.stroke();
        }
        for (let k = 0; k < 10; k++) {
          const q = k / 10;
          const y = yBase - hgt * (0.05 + q * 0.42);
          const uu = 0.06 + q * 0.30;
          const uc = m.side < 0 ? uu : 1 - uu;
          const xa = x - half + 2 * half * (uc - 0.078);
          const xb = x - half + 2 * half * (uc + 0.078);
          g.fillStyle = (i ? 'rgba(236,226,200,' : 'rgba(246,236,210,') + (0.38 - k * 0.024).toFixed(3) + ')';
          g.fillRect(Math.min(xa, xb), y - hgt * 0.021, Math.abs(xb - xa), hgt * 0.021);
          g.fillStyle = 'rgba(44,39,28,.40)';
          g.fillRect(Math.min(xa, xb), y - 1.8, Math.abs(xb - xa), 1.9);
          g.fillStyle = 'rgba(40,35,25,.22)';
          g.fillRect(Math.min(xa, xb), y - hgt * 0.021, Math.abs(xb - xa) * 0.16, hgt * 0.021);
        }
        for (let k = 0; k < 140; k++) {
          const rx = x + (rnd0() - 0.5) * half * 2;
          const ry = yBase - rnd0() * hgt * 0.94;
          const rr = 0.8 + rnd0() * 2.6;
          g.fillStyle = 'rgba(' + (56 + Math.floor(rnd0() * 62)) + ',' + (52 + Math.floor(rnd0() * 50)) + ',' + (40 + Math.floor(rnd0() * 36)) + ',.26)';
          g.beginPath();
          g.ellipse(rx, ry, rr, rr * 0.62, 0, 0, TAU);
          g.fill();
        }
        g.restore();

        // 山脊受光
        g.strokeStyle = 'rgba(255,248,228,.40)';
        g.lineWidth = 1.5;
        g.beginPath();
        for (let k = 8; k <= N - 8; k++) { const p = pt(k / N); k === 8 ? g.moveTo(p[0], p[1]) : g.lineTo(p[0], p[1]); }
        g.stroke();
        // 背光面（沿体积的软阴影，不留接缝）
        g.save(); mPath(); g.clip();
        const shd = g.createLinearGradient(x - half * 0.1, 0, x + half, 0);
        shd.addColorStop(0, 'rgba(30,26,17,0)');
        shd.addColorStop(0.45, 'rgba(30,26,17,.10)');
        shd.addColorStop(0.78, 'rgba(30,26,17,.34)');
        shd.addColorStop(1, 'rgba(24,20,13,.52)');
        g.fillStyle = shd;
        g.fillRect(x - half, yBase - hgt * 1.05, half * 2, hgt * 1.1);
        g.restore();

        // 半山松
        const prnd = mulberry32(77 + i * 9);
        for (let k = 0; k < 9; k++) {
          const u = 0.12 + prnd() * 0.76;
          const px = x - half + 2 * half * u;
          const py = yBase - hgt * prof(u) * (0.30 + prnd() * 0.42);
          g.strokeStyle = 'rgba(44,38,27,.62)';
          g.lineWidth = 1.2;
          g.beginPath(); g.moveTo(px, py); g.lineTo(px, py - h * 0.034); g.stroke();
          g.fillStyle = 'rgba(50,50,34,.58)';
          for (let j = 0; j < 3; j++) {
            const yy = py - h * 0.014 - j * h * 0.009;
            const ww = h * (0.016 - j * 0.004);
            g.beginPath();
            g.moveTo(px - ww, yy + h * 0.007);
            g.lineTo(px + ww, yy + h * 0.007);
            g.lineTo(px, yy - h * 0.010);
            g.closePath(); g.fill();
          }
        }
      });

      // 山脚雾
      P.mistBand(g, { w, y: h * 0.838, height: h * 0.10, seed: 8, color: '#efe6d2', alpha: 0.46 });

      // 地
      const gg = g.createLinearGradient(0, h * 0.85, 0, h);
      gg.addColorStop(0, '#9a8d72');
      gg.addColorStop(0.55, '#7d7159');
      gg.addColorStop(1, '#413a2b');
      g.fillStyle = gg;
      g.fillRect(0, h * 0.85, w, h * 0.15);
      P.stones(g, w, h, { y: h * 0.87, spread: h * 0.1, count: 22, color: '#4e4636', alpha: 0.35 });
    },
    paintDynamic(d, w, h, t, par, S) {
      const base = h * 0.87;
      const shift = S.shift;
      // 代际：老愚公挖几下老死了，子子孙孙继续挖
      const genAge = Math.min(S.age / 60, 1);
      const genH = h * (0.132 - S.gen * 0.022);
      const genColor = ['#2c271e', '#332d22', '#4a4032', '#5c5042'][Math.min(S.gen, 3)] || '#6e6454';
      const walk = Math.sin(t * 1.6 + S.gen * 0.5) * (1.5 - S.gen * 0.3);
      const gx = w * 0.52 + walk;
      P.figure(d, gx, base, genH, genColor);
      // 担子
      d.strokeStyle = genColor; d.lineWidth = 1.4;
      d.beginPath();
      d.moveTo(gx - h * 0.035, base - h * 0.072);
      d.lineTo(gx + h * 0.035, base - h * 0.078);
      d.stroke();
      d.fillStyle = genColor;
      d.beginPath(); d.ellipse(gx - h * 0.034, base - h * 0.06, h * 0.012, h * 0.008, 0, 0, TAU); d.fill();
      d.beginPath(); d.ellipse(gx + h * 0.036, base - h * 0.066, h * 0.012, h * 0.008, 0, 0, TAU); d.fill();

      // 每搬一筐，扬一点尘
      if (S.puff > 0) {
        S.puff *= 0.94;
        for (let i = 0; i < 7; i++) {
          const a = (i / 7) * TAU;
          d.globalAlpha = S.puff * 0.35;
          P.glow(d, w * 0.53 + Math.cos(a) * h * 0.05, base - h * 0.02 + Math.sin(a) * h * 0.02, h * 0.02, '#d8c9ac', 1);
        }
        d.globalAlpha = 1;
      } else S.puff = 0;

      // 搬土尘土粒子（点击后持续飘散）
      if (S.dust) {
        d.fillStyle = '#d8c9ac';
        S.dust.forEach((m) => {
          m.x += m.vx; m.y += m.vy; m.vy += 0.0015; m.life -= 0.015;
          if (m.life <= 0) { m.life = 0.6 + Math.random() * 0.4; m.x = 0.53 + (Math.random() - 0.5) * 0.1; m.y = 0.87; m.vx = (Math.random() - 0.5) * 0.04; m.vy = -0.03 - Math.random() * 0.06; }
          d.globalAlpha = m.life * 0.5;
          d.beginPath(); d.arc(m.x * w, m.y * h, m.r, 0, TAU); d.fill();
        });
        d.globalAlpha = 1;
      }

      // 山脚被挖掉的台阶（搬得越多，露出越多梯级）
      const v = clamp(S.baskets / 240, 0, 1);
      if (v > 0.01) {
        d.fillStyle = 'rgba(58,50,38,' + (0.45 + v * 0.3) + ')';
        [0.325, 0.700].forEach((mx) => {
          const cx = mx * w;
          const n = Math.floor(v * 8) + 1;
          for (let s = 0; s < n; s++) {
            const sy = base - s * h * 0.012;
            const len = (s + 1) * w * 0.025;
            d.fillRect(cx - len * 0.6, sy, len, h * 0.009);
          }
        });
      }

      // 飞鸟
      if (!S.birds) S.birds = Array.from({ length: 5 }, (_, i) => ({ x: 0.1 + i * 0.075, y: 0.2 + (i % 3) * 0.03, ph: i }));
      S.birds.forEach((b, i) => {
        const x = ((t * 0.014 + b.x) % 1.2) * w;
        const y = h * b.y + Math.sin(t * 0.6 + b.ph) * 4;
        P.bird(d, x, y, h * 0.012, t * 6 + b.ph, 'rgba(48,43,34,.6)');
      });

      // 山的高度随筐数变化（极少）
      // 用一层与山色的薄雾模拟“没有变化”
      d.globalAlpha = 0.05 + v * 0.05;
      P.glow(d, w * 0.51, h * 0.52, w * 0.16, '#f6eedb', 1);
      d.globalAlpha = 1;
    },
    onDown(x, y, S) {
      S.baskets++;
      S.age++;
      S.puff = 1;
      S.shift = Math.min(1, S.shift + 0.02);
      // 每 60 筐一代人老死，子子孙孙继续挖
      if (S.age >= 60) { S.gen++; S.age = 0; }
      if (!S.dust) {
        const rnd = mulberry32(123);
        S.dust = Array.from({ length: 40 }, () => ({ x: rnd(), y: rnd(), r: 0.8 + rnd() * 1.5, vx: (rnd() - 0.5) * 0.03, vy: -0.02 - rnd() * 0.05, life: 0.6 + rnd() * 0.4 }));
      }
      S.dust.forEach((m) => { m.x = 0.53 + (m.x - 0.53) * 0.5 + (Math.random() - 0.5) * 0.06; m.y = 0.87; m.life = 0.8; m.vx = (Math.random() - 0.5) * 0.04; m.vy = -0.03 - Math.random() * 0.06; });
      return 'basket';
    },
    status(S) {
      const genNames = ['老 愚 公', '大 儿 子', '孙 子', '曾 孙'];
      const name = genNames[Math.min(S.gen, 3)] || '后 代';
      return { hint: '点 击 挖 土 · 一 筐 筐 挖', status: `${name} · 第 ${S.gen + 1} 代` };
    },
  };

  /* ═══════════════════════════════════════════
     02 后羿射日
     ═══════════════════════════════════════════ */
  SCENES.houyi = {
    reset() {
      const suns = [];
      for (let i = 0; i < 10; i++) {
        const t = i / 9;
        suns.push({
          x: 0.085 + t * 0.865 + Math.sin(i * 2.3) * 0.012,
          y: 0.70 - t * 0.40 - Math.sin(t * Math.PI) * 0.10 + Math.cos(i * 1.9) * 0.016,
          r: 0.0135 + (i % 3) * 0.0026,
          alive: true, fade: 1, ph: i * 0.7,
        });
      }
      this.S = { suns, arrows: [], aiming: false, pull: 0, ax: 0, ay: 0, shot: 0, dust: null, hit: 0, lastNoteAt: 0 };
    },
    geometry(w, h) {
      return { ax: w * 0.155, ay: h * 0.845, ah: h * 0.22 };
    },
    paintStatic(g, w, h) {
      // 十日之天
      P.sky(g, w, h, [[0, '#c98a4e'], [0.22, '#dda267'], [0.42, '#e8b57c'], [0.55, '#efc793'], [0.66, '#d9a86f'], [0.78, '#b3824f'], [1, '#6e4c2c']]);
      P.sunDisc(g, w * 0.80, h * 0.14, Math.min(w, h) * 0.008, '#fff3d4', '#f0b46a', 0.4);
      // 尘霾
      P.mistBand(g, { w, y: h * 0.30, height: h * 0.30, seed: 12, color: '#f4c78e', alpha: 0.16, count: 14 });

      // 远山剪影
      P.mountains(g, { w, h, base: h * 0.66, amp: h * 0.11, scale: 0.0022, seed: 31, top: 'rgba(122,78,44,.85)', bottom: 'rgba(88,56,32,.9)', haze: 0.12, hazeColor: '#e3ab6f' });
      P.mistBand(g, { w, y: h * 0.63, height: h * 0.05, seed: 3, color: '#edb77c', alpha: 0.4 });

      // 干裂大地
      const gy = h * 0.72;
      const gg = g.createLinearGradient(0, gy, 0, h);
      gg.addColorStop(0, '#b07a48');
      gg.addColorStop(0.5, '#8d5e35');
      gg.addColorStop(1, '#4c3220');
      g.fillStyle = gg;
      g.fillRect(0, gy, w, h - gy);
      // 裂纹
      const rnd = mulberry32(19);
      g.strokeStyle = 'rgba(48,29,16,.55)';
      for (let i = 0; i < 34; i++) {
        let x = rnd() * w, y = gy + rnd() * (h - gy);
        g.lineWidth = 0.5 + rnd() * 1.1;
        g.beginPath(); g.moveTo(x, y);
        for (let k = 0; k < 4; k++) {
          x += (rnd() - 0.5) * w * 0.06;
          y += rnd() * h * 0.03;
          g.lineTo(x, y);
        }
        g.stroke();
      }
      // 崖
      g.fillStyle = 'rgba(38,26,16,.92)';
      g.beginPath();
      g.moveTo(0, h);
      g.lineTo(0, h * 0.80);
      g.bezierCurveTo(w * 0.09, h * 0.815, w * 0.16, h * 0.83, w * 0.235, h * 0.875);
      g.lineTo(w * 0.27, h);
      g.closePath(); g.fill();
      g.strokeStyle = 'rgba(238,190,130,.35)';
      g.lineWidth = 1.2;
      g.beginPath();
      g.moveTo(0, h * 0.80);
      g.bezierCurveTo(w * 0.09, h * 0.815, w * 0.16, h * 0.83, w * 0.235, h * 0.875);
      g.stroke();
    },
    paintDynamic(d, w, h, t, par, S) {
      const { ax, ay, ah } = this.geometry(w, h);

      // 十日
      S.suns.forEach((s, i) => {
        if (!s.alive && s.fade <= 0) return;
        const x = s.x * w + par.x * 5, y = s.y * h + par.y * 3;
        const pulse = 1 + Math.sin(t * 0.9 + s.ph) * 0.035;
        const r = s.r * Math.min(w, h) * pulse * (s.alive ? 1 : 1 + (1 - s.fade) * 0.6);
        if (s.alive) {
          P.glow(d, x, y, r * 5.2, '#ffb765', 0.42);
          P.glow(d, x, y, r * 2.1, '#ffd39a', 0.55);
          P.sunDisc(d, x, y, r, '#fffdf2', '#f0a355', 1);
          d.strokeStyle = 'rgba(255,250,232,.62)';
          d.lineWidth = 1;
          d.beginPath(); d.arc(x, y, r * 1.34, 0, TAU); d.stroke();
        } else {
          d.globalAlpha = s.fade * 0.35;
          P.glow(d, x, y, r * 4, '#5a3a22', 1);
          d.globalAlpha = 1;
        }
      });

      // 尘
      if (!S.dust) {
        const rnd = mulberry32(23);
        S.dust = Array.from({ length: 40 }, () => ({ x: rnd(), y: rnd(), r: 0.4 + rnd() * 1.2, sp: 0.2 + rnd() * 0.5, ph: rnd() * TAU }));
      }
      d.fillStyle = '#f6cf9c';
      S.dust.forEach((m) => {
        m.x += m.sp * 0.0006;
        if (m.x > 1) m.x -= 1;
        d.globalAlpha = 0.12 + 0.18 * Math.abs(Math.sin(t * 0.5 + m.ph));
        d.beginPath(); d.arc(m.x * w, (m.y - (t * 0.004 * m.sp) % 1) * h, m.r, 0, TAU); d.fill();
      });
      d.globalAlpha = 1;

      // 弓与箭
      const bowX = ax + ah * 0.06, bowY = ay - ah * 0.62;
      const aimAng = S.aiming ? Math.atan2((S.ax || 0) - bowX, (S.ay || 0) - bowY) : -0.15;
      const ang = clamp(aimAng, -1.25, 0.35);
      P.archer(d, ax, ay, ah, '#241a11', S.aiming ? S.pull : 0, 0);

      if (S.aiming && S.pull > 0.1) {
        const len = Math.min(w, h) * 0.5;
        const tx = bowX + Math.cos(ang) * len * 0.8;
        const ty = bowY + Math.sin(ang) * len * 0.8;
        d.save();
        d.setLineDash([2, 7]);
        d.strokeStyle = 'rgba(255,235,200,.35)';
        d.lineWidth = 1;
        d.beginPath(); d.moveTo(bowX + Math.cos(ang) * ah * 0.2, bowY + Math.sin(ang) * ah * 0.2); d.lineTo(tx, ty); d.stroke();
        d.restore();
        d.strokeStyle = 'rgba(255,238,205,.5)';
        d.lineWidth = 1;
        d.beginPath(); d.arc(tx, ty, 7, 0, TAU); d.stroke();
      }

      // 飞行的箭
      S.arrows.forEach((a) => {
        d.strokeStyle = 'rgba(38,26,15,.95)';
        d.lineWidth = 1.6;
        d.beginPath();
        d.moveTo(a.x, a.y);
        d.lineTo(a.x - Math.cos(a.a) * 24, a.y - Math.sin(a.a) * 24);
        d.stroke();
        d.strokeStyle = 'rgba(255,240,215,.55)';
        d.lineWidth = 0.8;
        d.beginPath();
        d.moveTo(a.x, a.y);
        d.lineTo(a.x - Math.cos(a.a) * 40, a.y - Math.sin(a.a) * 40);
        d.stroke();
      });

      // 射中的余烬
      if (S.burst) {
        S.burst.forEach((p) => {
          p.x += p.vx * 0.016; p.y += p.vy * 0.016; p.vy += 0.02; p.life -= 0.016;
          d.globalAlpha = Math.max(0, p.life);
          d.fillStyle = p.c;
          d.beginPath(); d.arc(p.x, p.y, p.r, 0, TAU); d.fill();
        });
        d.globalAlpha = 1;
        S.burst = S.burst.filter((p) => p.life > 0);
      }
    },
    onDown(x, y, S, w, h) {
      const { ax, ay, ah } = this.geometry(w, h);
      S.aiming = true;
      S.ax = x; S.ay = y;
      const d = Math.hypot(x - (ax + ah * 0.06), y - (ay - ah * 0.62));
      S.pull = clamp(d / (Math.min(w, h) * 0.42), 0.05, 1);
      return 'aim';
    },
    onMove(x, y, S, w, h) {
      if (!S.aiming) return;
      const { ax, ay, ah } = this.geometry(w, h);
      S.ax = x; S.ay = y;
      const d = Math.hypot(x - (ax + ah * 0.06), y - (ay - ah * 0.62));
      S.pull = clamp(d / (Math.min(w, h) * 0.42), 0.05, 1);
    },
    onUp(x, y, S, w, h) {
      if (!S.aiming) return null;
      const { ax, ay, ah } = this.geometry(w, h);
      S.aiming = false;
      const bowX = ax + ah * 0.06, bowY = ay - ah * 0.62;
      const ang = clamp(Math.atan2((S.ay || y) - bowY, (S.ax || x) - bowX), -1.25, 0.35);
      const sp = 620 * (0.45 + S.pull * 0.75);
      S.arrows.push({ x: bowX, y: bowY, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, a: ang, life: 3 });
      S.pull = 0;
      return 'shoot';
    },
    tick(S, dt, w, h) {
      // 箭的飞行与命中
      const alive = S.suns.filter((s) => s.alive);
      for (const s of S.suns) {
        if (!s.alive) s.fade = Math.max(0, s.fade - dt * 0.8);
      }
      for (const a of S.arrows) {
        a.x += a.vx * dt;
        a.y += a.vy * dt;
        a.vy += 210 * dt;
        a.a = Math.atan2(a.vy, a.vx);
        a.life -= dt;
        for (const s of S.suns) {
          if (!s.alive) continue;
          const sx = s.x * w, sy = s.y * h;
          const r = s.r * Math.min(w, h) * 2.4;
          if (Math.hypot(a.x - sx, a.y - sy) < r) {
            s.alive = false;
            s.fade = 1;
            a.life = 0;
            S.hit++;
            // 余烬
            const bg = [];
            for (let i = 0; i < 26; i++) {
              const ang = Math.random() * TAU, sp = 30 + Math.random() * 130;
              bg.push({ x: sx, y: sy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 40, r: 0.6 + Math.random() * 1.8, life: 1, c: Math.random() > 0.5 ? '#ffd08a' : '#ff9b4f' });
            }
            S.burst = (S.burst || []).concat(bg);
            if (alive.length <= 1) S.final = true;
            break;
          }
        }
      }
      S.arrows = S.arrows.filter((a) => a.life > 0 && a.y < h * 1.2 && a.x < w * 1.2);
    },
    status(S) {
      const alive = S.suns.filter((s) => s.alive).length;
      return { hint: alive > 1 ? '按 住 并 后 拉 · 放 箭' : '最 后 一 支 箭 · 你 会 射 向 哪 里', status: `${['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][alive]} 日 · 悬 于 天` };
    },
    note(S) {
      return S.suns.filter((s) => s.alive).length === 1
        ? '九日坠地，化为焦土。最后一轮太阳留在天上——他收起了弓。'
        : '';
    },
  };

  /* ═══════════════════════════════════════════
     03 夸父逐日
     ═══════════════════════════════════════════ */
  SCENES.kuafu = {
    reset() { this.S = { run: 0, dist: 0, thirst: 0, fallen: 0, dust: null, stones: null }; },
    paintStatic(g, w, h) {
      P.sky(g, w, h, [[0, '#8a5a3c'], [0.2, '#b4744b'], [0.4, '#d18f5d'], [0.55, '#e3a670'], [0.64, '#d99a63'], [0.8, '#9c6a44'], [1, '#4e3423']]);
      // 巨大的落日
      P.sunDisc(g, w * 0.74, h * 0.585, Math.min(w, h) * 0.115, '#fff0cc', '#e8a05a', 1);
      // 远处山
      P.mountains(g, { w, h, base: h * 0.635, amp: h * 0.06, scale: 0.0018, seed: 8.5, top: 'rgba(112,70,44,.95)', bottom: 'rgba(78,48,30,.95)', haze: 0.1, hazeColor: '#e0a267' });
      // 荒原
      const gg = g.createLinearGradient(0, h * 0.63, 0, h);
      gg.addColorStop(0, '#a9744a');
      gg.addColorStop(0.35, '#8d5f3d');
      gg.addColorStop(1, '#3c2718');
      g.fillStyle = gg;
      g.fillRect(0, h * 0.63, w, h * 0.37);
      // 地平线光
      P.glow(g, w * 0.74, h * 0.61, w * 0.3, '#f0b878', 0.35);
      // 干裂
      const rnd = mulberry32(77);
      g.strokeStyle = 'rgba(58,35,20,.4)';
      for (let i = 0; i < 26; i++) {
        let x = rnd() * w, y = h * 0.64 + rnd() * h * 0.36;
        g.lineWidth = 0.5 + rnd();
        g.beginPath(); g.moveTo(x, y);
        for (let k = 0; k < 3; k++) { x += (rnd() - 0.5) * w * 0.05; y += rnd() * h * 0.02; g.lineTo(x, y); }
        g.stroke();
      }
    },
    paintDynamic(d, w, h, t, par, S) {
      // 热浪
      d.save();
      d.globalAlpha = 0.10;
      for (let i = 0; i < 9; i++) {
        const yy = h * (0.6 + i * 0.012);
        d.fillStyle = '#ffd9a6';
        d.fillRect(0, yy + Math.sin(t * 1.2 + i) * 2, w, 1.2);
      }
      d.restore();

      const groundY = h * 0.835;
      const runDist = S.dist;

      // 巨人
      const gx = w * (0.30 + 0.02 * Math.sin(t * 0.4) + runDist * 3.0);
      const bob = S.fallen ? 0 : Math.abs(Math.sin(t * 3.2 + S.run * 3)) * h * 0.010 * (S.run ? 1 : 0.3);
      const gh = h * 0.40;
      if (!S.fallen) {
        // 影子拉长
        const sh = h * 0.02 + S.thirst * h * 0.09;
        d.save();
        d.globalAlpha = 0.35;
        d.fillStyle = '#3a2517';
        d.beginPath();
        d.ellipse(gx + gh * 0.28, groundY + 4, sh * 1.7, sh * 0.22, 0, 0, TAU);
        d.fill();
        d.restore();
        // 身躯
        d.save();
        d.translate(gx, groundY - bob);
        const wob = Math.sin(t * 3.2) * 0.02;
        d.rotate(wob);
        d.fillStyle = '#2b1b10';
        // 腿
        d.beginPath();
        d.moveTo(-gh * 0.10, 0); d.lineTo(-gh * 0.02, -gh * 0.42); d.lineTo(gh * 0.05, -gh * 0.42);
        d.lineTo(gh * 0.11, 0); d.lineTo(gh * 0.03, 0); d.lineTo(0, -gh * 0.38); d.lineTo(-gh * 0.03, 0);
        d.closePath(); d.fill();
        // 躯干
        d.beginPath();
        d.moveTo(-gh * 0.09, -gh * 0.40);
        d.quadraticCurveTo(-gh * 0.14, -gh * 0.66, -gh * 0.08, -gh * 0.76);
        d.lineTo(gh * 0.09, -gh * 0.76);
        d.quadraticCurveTo(gh * 0.14, -gh * 0.66, gh * 0.09, -gh * 0.40);
        d.closePath(); d.fill();
        // 头
        d.beginPath(); d.arc(0, -gh * 0.84, gh * 0.085, 0, TAU); d.fill();
        // 前伸的手
        d.strokeStyle = '#2b1b10'; d.lineWidth = gh * 0.05; d.lineCap = 'round';
        d.beginPath();
        d.moveTo(gh * 0.06, -gh * 0.72);
        d.quadraticCurveTo(gh * 0.24, -gh * 0.80, gh * 0.34, -gh * 0.86);
        d.stroke();
        d.restore();
      } else {
        // 倒下：杖化为桃林（更茂密的桃树，桃花粉色，花瓣飘落）
        d.save();
        d.fillStyle = '#241609';
        d.beginPath();
        d.ellipse(gx + gh * 0.18, groundY - gh * 0.02, gh * 0.35, gh * 0.08, 0.06, 0, TAU);
        d.fill();
        d.restore();

        // 桃树树干
        d.strokeStyle = '#4a2e1a';
        d.lineWidth = gh * 0.03;
        d.lineCap = 'round';
        for (let i = 0; i < 4; i++) {
          const tx = gx + gh * (0.05 + i * 0.07);
          d.beginPath();
          d.moveTo(tx, groundY);
          d.lineTo(tx + (Math.sin(i) * gh * 0.04), groundY - gh * 0.18);
          d.stroke();
        }

        // 桃枝与桃花（更多枝桠，更大的桃子）
        for (let i = 0; i < 12; i++) {
          const bx = gx + gh * (0.08 + i * 0.075);
          const bh = gh * (0.14 + (i % 4) * 0.05);
          d.strokeStyle = 'rgba(74,46,26,0.85)';
          d.lineWidth = 1.8;
          d.beginPath();
          d.moveTo(bx, groundY);
          d.quadraticCurveTo(bx + Math.sin(i * 1.3) * 10, groundY - bh * 0.6, bx + Math.cos(i) * 6, groundY - bh);
          d.stroke();
          d.fillStyle = 'rgba(255,182,186,0.85)';
          for (let k = 0; k < 5; k++) {
            d.beginPath();
            d.arc(bx + (Math.sin(i * 2 + k) * 9), groundY - bh * (0.5 + k * 0.11), 2.2 + k * 0.4, 0, TAU);
            d.fill();
          }
        }

        // 桃花瓣飘落
        if (!S.petals) {
          const prnd = mulberry32(88);
          S.petals = Array.from({ length: 20 }, () => ({
            x: prnd(), y: prnd() * 0.5, r: 1 + prnd() * 1.5,
            sp: 0.0008 + prnd() * 0.0012, wx: (prnd() - 0.5) * 0.0004
          }));
        }
        d.fillStyle = '#ffc4c8';
        S.petals.forEach((p) => {
          p.y += p.sp;
          p.x += p.wx;
          if (p.y > 0.95) { p.y = 0.05; p.x = Math.random(); }
          d.globalAlpha = 0.7;
          d.beginPath(); d.arc(p.x * w, p.y * h, p.r, 0, TAU); d.fill();
        });
        d.globalAlpha = 1;
      }

      // 尘土（随巨人脚下扬起，跑得越快越多）
      if (!S.dust) {
        const rnd = mulberry32(41);
        S.dust = Array.from({ length: 24 }, () => ({ x: rnd(), y: rnd(), r: 0.8 + rnd() * 1.5, life: 0.5 + rnd() * 0.5 }));
      }
      const run = S.run ? 1 : 0;
      d.fillStyle = '#e8b988';
      S.dust.forEach((m) => {
        if (run > 0.5 && Math.random() < 0.18) {
          m.x = gx / w + (Math.random() - 0.5) * 0.06;
          m.y = 0.835 + Math.random() * 0.02;
          m.life = 0.6 + Math.random() * 0.4;
        }
        m.x -= 0.0008 * (1 + run * 4);
        m.life -= 0.02;
        if (m.life <= 0) { m.x = Math.random(); m.y = 0.835 + Math.random() * 0.02; m.life = 0.5 + Math.random() * 0.5; }
        d.globalAlpha = m.life * 0.5;
        d.beginPath(); d.arc(m.x * w, m.y * h, m.r, 0, TAU); d.fill();
      });
      d.globalAlpha = 1;

      // 渴：画面边缘发焦
      const th = S.thirst;
      if (th > 0.05) {
        const vg = d.createRadialGradient(w * 0.55, h * 0.55, h * 0.2, w * 0.55, h * 0.55, h * 0.95);
        vg.addColorStop(0, 'rgba(90,42,18,0)');
        vg.addColorStop(1, `rgba(90,42,18,${0.55 * th})`);
        d.fillStyle = vg;
        d.fillRect(0, 0, w, h);
      }
    },
    tick(S, dt) {
      if (S.run && !S.fallen) {
        S.dist += dt * 0.35;
        S.thirst = clamp(S.thirst + dt * 0.055, 0, 1);
        if (S.thirst >= 1) { S.fallen = 1; S.run = 0; }
      } else if (!S.run && !S.fallen) {
        S.thirst = clamp(S.thirst - dt * 0.04, 0, 1);
      }
    },
    onDown(x, y, S) { if (!S.fallen) { S.run = 1; return 'run'; } return 'fallen'; },
    onUp(x, y, S) { S.run = 0; return null; },
    status(S) {
      if (S.fallen) return { hint: '他 没 有 追 上', status: '他 倒 下 时 · 手 杖 化 为 桃 林' };
      return {
        hint: '按 住 · 向 地 平 线 奔 跑',
        status: S.thirst > 0.75 ? '渴 · 将 尽' : `里 · ${Math.round(300 + S.dist * 900)}`,
      };
    },
    note(S) { return S.fallen ? '他渴死在半途。太阳没有动，光仍在前面——倒下时，手杖生出一片桃林。' : ''; },
  };

  /* ═══════════════════════════════════════════
     04 女娲补天
     ═══════════════════════════════════════════ */
  SCENES.nuwa = {
    reset() {
      this.S = {
        sealed: [false, false, false, false, false],
        stones: [
          { x: 0.18, y: 0.80, taken: false, placed: -1, c: '#7fa189', name: '青' },
          { x: 0.32, y: 0.87, taken: false, placed: -1, c: '#a84b36', name: '赤' },
          { x: 0.46, y: 0.79, taken: false, placed: -1, c: '#d0a75f', name: '黄' },
          { x: 0.60, y: 0.87, taken: false, placed: -1, c: '#ded6c4', name: '白' },
          { x: 0.74, y: 0.80, taken: false, placed: -1, c: '#3c4a4b', name: '黑' },
        ],
        drag: null, stars: null,
      };
      this.crackPts = null;
    },
    crack() {
      return [
        [0.46, -0.02], [0.49, 0.10], [0.455, 0.17], [0.50, 0.25],
        [0.47, 0.33], [0.515, 0.41], [0.48, 0.49], [0.53, 0.57],
        [0.505, 0.63],
      ];
    },
    paintStatic(g, w, h) {
      P.sky(g, w, h, [[0, '#1d2a2b'], [0.25, '#2a3a39'], [0.45, '#3b4a43'], [0.6, '#5c6353'], [0.7, '#867d63'], [0.8, '#a3906f'], [1, '#3a3126']]);
      // 远雷云
      P.mistBand(g, { w, y: h * 0.24, height: h * 0.16, seed: 6, color: '#8fa196', alpha: 0.22, count: 12 });
      // 山
      P.mountains(g, { w, h, base: h * 0.72, amp: h * 0.15, scale: 0.0024, seed: 5.6, top: '#4e5546', bottom: '#2a2c23', haze: 0.1, hazeColor: '#b8a888', karst: true });
      P.mountains(g, { w, h, base: h * 0.78, amp: h * 0.10, scale: 0.0038, seed: 12.2, top: '#3a3d32', bottom: '#20211b', haze: 0.06, hazeColor: '#a89a7d' });
      P.mistBand(g, { w, y: h * 0.75, height: h * 0.07, seed: 13, color: '#c4b697', alpha: 0.3 });
      // 地平火
      const fg = g.createLinearGradient(0, h * 0.72, 0, h);
      fg.addColorStop(0, 'rgba(198,110,60,0)');
      fg.addColorStop(1, 'rgba(150,68,32,.35)');
      g.fillStyle = fg;
      g.fillRect(0, h * 0.72, w, h * 0.28);
      // 地
      P.stones(g, w, h, { y: h * 0.86, spread: h * 0.12, count: 26, color: '#14140f', alpha: 0.5 });
    },
    paintDynamic(d, w, h, t, par, S) {
      const pts = this.crack();
      // 裂缝的辉光
      let glow = 0;
      for (let i = 0; i < 5; i++) if (!S.sealed[i]) glow++;
      const intensity = glow / 5;
      d.save();
      d.lineCap = 'round'; d.lineJoin = 'round';
      for (let pass = 0; pass < 3; pass++) {
        d.beginPath();
        pts.forEach(([x, y], i) => (i ? d.lineTo(x * w, y * h) : d.moveTo(x * w, y * h)));
        d.strokeStyle = pass === 0 ? `rgba(255,196,110,${0.10 * intensity})` : pass === 1 ? `rgba(255,168,84,${0.22 * intensity})` : `rgba(255,235,196,${0.6 * intensity})`;
        d.lineWidth = pass === 0 ? 20 : pass === 1 ? 6.5 : 1.8;
        d.stroke();
      }
      // 分支裂纹
      d.strokeStyle = `rgba(255,214,150,${0.35 * intensity})`;
      d.lineWidth = 1;
      [[0.47, 0.25, 0.41, 0.31], [0.48, 0.49, 0.42, 0.44], [0.51, 0.41, 0.57, 0.36], [0.50, 0.17, 0.44, 0.13]].forEach(([x1, y1, x2, y2]) => {
        d.beginPath(); d.moveTo(x1 * w, y1 * h); d.lineTo(x2 * w, y2 * h); d.stroke();
      });
      d.restore();

      // 补天的五色石
      S.stones.forEach((st, i) => {
        if (st.placed >= 0) return;
        const x = st.x * w, y = st.y * h + Math.sin(t * 0.8 + i * 1.7) * 4;
        const r = Math.min(w, h) * 0.022;
        P.glow(d, x, y, r * 3.2, st.c, 0.5);
        d.beginPath(); d.arc(x, y, r, 0, TAU);
        const g2 = d.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
        g2.addColorStop(0, '#fff8e8');
        g2.addColorStop(0.35, st.c);
        g2.addColorStop(1, 'rgba(30,26,20,.95)');
        d.fillStyle = g2; d.fill();
        // 标签
        d.fillStyle = 'rgba(240,232,215,.55)';
        d.font = `${Math.max(9, Math.min(w, h) * 0.011)}px "Noto Serif SC", serif`;
        d.textAlign = 'center';
        d.fillText(st.name, x, y + r + 16);
      });
      // 已补的石头嵌在裂纹里
      S.stones.forEach((st) => {
        if (st.placed < 0) return;
        const [cx, cy] = pts[st.placed + 1] || pts[1];
        const x = cx * w, y = cy * h, r = Math.min(w, h) * 0.018;
        P.glow(d, x, y, r * 4, st.c, 0.35);
        d.beginPath(); d.arc(x, y, r, 0, TAU);
        d.fillStyle = st.c; d.fill();
      });

      // 缝好后，星与月光
      const done = S.sealed.every(Boolean);
      if (done) {
        if (!S.stars) {
          const rnd = mulberry32(88);
          S.stars = Array.from({ length: 120 }, () => ({ x: rnd(), y: rnd() * 0.55, r: 0.4 + rnd() * 1.1, ph: rnd() * TAU }));
        }
        S.stars.forEach((s) => {
          d.globalAlpha = 0.25 + 0.65 * Math.abs(Math.sin(t * 0.8 + s.ph));
          d.fillStyle = '#f6f0dd';
          d.beginPath(); d.arc(s.x * w, s.y * h, s.r, 0, TAU); d.fill();
        });
        d.globalAlpha = 1;
        P.sunDisc(d, w * 0.72, h * 0.20, Math.min(w, h) * 0.035, '#f7f2e2', '#cfe0d2', 0.85);
      }
    },
    pick(S, x, y, w, h) {
      for (const st of S.stones) {
        if (st.placed >= 0) continue;
        if (Math.hypot(x - st.x * w, y - st.y * h) < Math.min(w, h) * 0.06) return st;
      }
      return null;
    },
    onDown(x, y, S, w, h) {
      const st = this.pick(S, x, y, w, h);
      if (st) { S.drag = st; return 'grab'; }
      return null;
    },
    onMove(x, y, S, w, h) {
      if (!S.drag) return;
      S.drag.x = x / w; S.drag.y = y / h;
    },
    onUp(x, y, S, w, h) {
      if (!S.drag) return null;
      const st = S.drag;
      const pts = this.crack();
      let best = -1, bd = 1e9;
      for (let i = 0; i < 5; i++) {
        if (S.sealed[i]) continue;
        const [cx, cy] = pts[i + 1];
        const d = Math.hypot(x - cx * w, y - cy * h);
        if (d < bd) { bd = d; best = i; }
      }
      S.drag = null;
      if (best >= 0 && bd < Math.min(w, h) * 0.16) {
        S.sealed[best] = true;
        st.placed = best;
        return 'seal';
      }
      // 回位
      const i = S.stones.indexOf(st);
      st.x = [0.18, 0.32, 0.46, 0.60, 0.74][i];
      st.y = [0.80, 0.87, 0.79, 0.87, 0.80][i];
      return 'drop';
    },
    status(S) {
      const n = S.sealed.filter(Boolean).length;
      return { hint: n < 5 ? '拖 动 五 色 石 · 补 上 天 裂' : '天 已 补 好', status: `补 天 · ${n} / 5` };
    },
    note(S) {
      return S.sealed.every(Boolean) ? '五色石熔成一道光，裂缝合上了。天没有恢复到原样——它多了一道补丁。' : '';
    },
  };

  /* ═══════════════════════════════════════════
     05 大禹治水
     ═══════════════════════════════════════════ */
  SCENES.dayu = {
    reset() { this.S = { dig: 0, holding: false, rain: null, ripples: [] }; },
    paintStatic(g, w, h) {
      P.sky(g, w, h, [[0, '#404b4a'], [0.25, '#59635e'], [0.45, '#7c8378'], [0.58, '#9aa08f'], [0.68, '#a9a58e'], [0.8, '#7b7765'], [1, '#2f322a']]);
      // 云
      P.mistBand(g, { w, y: h * 0.18, height: h * 0.22, seed: 14, color: '#8d968b', alpha: 0.35, count: 18 });
      P.mistBand(g, { w, y: h * 0.30, height: h * 0.14, seed: 24, color: '#c3c4b2', alpha: 0.22, count: 10 });
      // 破云的光
      P.glow(g, w * 0.66, h * 0.16, w * 0.26, '#e6e2c8', 0.28);
      // 山
      P.mountains(g, { w, h, base: h * 0.56, amp: h * 0.20, scale: 0.0022, seed: 9.4, top: '#68705f', bottom: '#3d4436', haze: 0.16, hazeColor: '#c9c8b2', karst: true });
      P.mountains(g, { w, h, base: h * 0.62, amp: h * 0.13, scale: 0.0035, seed: 17.1, top: '#4e564a', bottom: '#2c3129', haze: 0.1, hazeColor: '#b9b8a3' });
      P.mistBand(g, { w, y: h * 0.60, height: h * 0.06, seed: 27, color: '#d4d2bb', alpha: 0.4 });
      // 远处的河堤
      g.fillStyle = 'rgba(52,54,44,.85)';
      g.beginPath();
      g.moveTo(0, h * 0.735);
      g.quadraticCurveTo(w * 0.3, h * 0.70, w * 0.55, h * 0.725);
      g.quadraticCurveTo(w * 0.8, h * 0.75, w, h * 0.73);
      g.lineTo(w, h * 0.78);
      g.quadraticCurveTo(w * 0.6, h * 0.79, 0, h * 0.79);
      g.closePath(); g.fill();
    },
    paintDynamic(d, w, h, t, par, S) {
      const level = h * (0.755 + (1 - S.dig) * 0.09);
      const top = h * 0.76;
      // 水
      const wg = d.createLinearGradient(0, level - h * 0.04, 0, h);
      wg.addColorStop(0, 'rgba(120,132,124,.92)');
      wg.addColorStop(0.25, 'rgba(78,92,88,.96)');
      wg.addColorStop(1, 'rgba(31,38,36,.98)');
      d.fillStyle = wg;
      d.fillRect(0, level, w, h - level);

      // 水面波纹
      d.save();
      d.beginPath(); d.rect(0, level, w, h - level); d.clip();
      for (let i = 0; i < 26; i++) {
        const yy = level + Math.pow(i / 26, 1.6) * (h - level);
        const a = 0.05 + (i / 26) * 0.1;
        d.strokeStyle = `rgba(226,231,214,${a})`;
        d.lineWidth = 0.8 + (i / 26) * 1.2;
        d.beginPath();
        const off = Math.sin(t * 0.6 + i) * 12;
        for (let x = -20; x <= w + 20; x += 24) {
          const y = yy + Math.sin(x * 0.012 + t * 0.9 + i) * (1.5 + i * 0.12);
          x === -20 ? d.moveTo(x + off, y) : d.lineTo(x + off, y);
        }
        d.stroke();
      }
      // 河道的亮痕（疏导后）
      if (S.dig > 0.2) {
        d.globalAlpha = S.dig * 0.5;
        d.strokeStyle = 'rgba(210,214,193,.5)';
        d.lineWidth = 2;
        d.beginPath();
        for (let x = 0; x <= w; x += 20) {
          const y = level + Math.sin(x * 0.01 + 1) * h * 0.012;
          x === 0 ? d.moveTo(x, y) : d.lineTo(x, y);
        }
        d.stroke();
        d.globalAlpha = 1;
      }
      d.restore();

      // 雨
      if (!S.rain) {
        const rnd = mulberry32(66);
        S.rain = Array.from({ length: 130 }, () => ({ x: rnd() * 1.3, y: rnd(), sp: 0.5 + rnd() * 0.9, l: 0.5 + rnd() * 0.8 }));
      }
      d.strokeStyle = 'rgba(224,228,214,.28)';
      d.lineWidth = 0.8;
      S.rain.forEach((r) => {
        const y = ((r.y + t * 0.22 * r.sp) % 1.15) * h;
        const x = r.x * w * 1.15 - w * 0.1;
        d.beginPath();
        d.moveTo(x, y);
        d.lineTo(x - 6 * r.l, y + 26 * r.l);
        d.stroke();
      });

      // 禹：站在堤上
      const figX = w * 0.40, figY = level - 2;
      d.save();
      d.globalAlpha = 0.96;
      P.figure(d, figX, figY, h * 0.105, 'rgba(28,30,24,.95)');
      // 手里的耒
      d.strokeStyle = 'rgba(28,30,24,.95)';
      d.lineWidth = 2;
      d.beginPath();
      d.moveTo(figX + h * 0.05, figY - h * 0.06);
      d.lineTo(figX + h * 0.115, figY - h * 0.20);
      d.stroke();
      d.fillStyle = 'rgba(28,30,24,.95)';
      d.beginPath();
      d.moveTo(figX + h * 0.115, figY - h * 0.20);
      d.lineTo(figX + h * 0.10, figY - h * 0.165);
      d.lineTo(figX + h * 0.135, figY - h * 0.175);
      d.closePath(); d.fill();
      d.restore();

      // 水退之后露出的田垄
      if (S.dig > 0.55) {
        d.globalAlpha = (S.dig - 0.55) / 0.45;
        d.strokeStyle = 'rgba(150,142,112,.55)';
        d.lineWidth = 1.2;
        for (let i = 0; i < 7; i++) {
          const y = h * 0.90 + i * h * 0.018;
          d.beginPath(); d.moveTo(w * 0.05, y); d.lineTo(w * 0.95, y + 4); d.stroke();
        }
        d.globalAlpha = 1;
      }
    },
    tick(S, dt) {
      if (S.holding) S.dig = clamp(S.dig + dt * 0.22, 0, 1);
      else S.dig = clamp(S.dig - dt * 0.02, 0, 1);
    },
    onDown(x, y, S) { S.holding = true; return 'dig'; },
    onUp(x, y, S) { S.holding = false; return null; },
    status(S) {
      if (S.dig >= 0.999) return { hint: '九 州 已 见', status: '水 · 退 尽' };
      return { hint: '按 住 · 疏 导 洪 水', status: `水 位 · ${(7 - S.dig * 7).toFixed(1)} 丈` };
    },
    note(S) { return S.dig >= 0.999 ? '他没有堵，只是让水找到了路。十三年后，九州露出了田垄。' : ''; },
  };

  /* ═══════════════════════════════════════════
     06 精卫填海
     ═══════════════════════════════════════════ */
  SCENES.jingwei = {
    reset() { this.S = { stones: 0, drops: [], bird: { x: 0.62, y: 0.30 }, target: null, splash: [] }; },
    paintStatic(g, w, h) {
      P.sky(g, w, h, [[0, '#222b31'], [0.2, '#334048'], [0.35, '#4b5a60'], [0.48, '#6e7d7e'], [0.56, '#8d9a92'], [0.62, '#7d8a82'], [0.68, '#4a5654'], [1, '#1c252b']]);
      P.mistBand(g, { w, y: h * 0.16, height: h * 0.20, seed: 7, color: '#8b9a9c', alpha: 0.3, count: 16 });
      // 云隙的光
      P.glow(g, w * 0.32, h * 0.24, w * 0.24, '#e6dfc6', 0.22);
      // 远处岛
      g.fillStyle = 'rgba(34,44,46,.9)';
      g.beginPath();
      g.moveTo(w * 0.72, h * 0.625);
      g.lineTo(w * 0.755, h * 0.555);
      g.lineTo(w * 0.78, h * 0.585);
      g.lineTo(w * 0.815, h * 0.535);
      g.lineTo(w * 0.855, h * 0.625);
      g.closePath(); g.fill();
      // 海面
      const wg = g.createLinearGradient(0, h * 0.625, 0, h);
      wg.addColorStop(0, '#6c7b7b');
      wg.addColorStop(0.18, '#4a5657');
      wg.addColorStop(0.55, '#2f3d42');
      wg.addColorStop(1, '#161f24');
      g.fillStyle = wg;
      g.fillRect(0, h * 0.625, w, h * 0.375);
      // 浪线
      const rnd = mulberry32(55);
      for (let i = 0; i < 42; i++) {
        const y = h * (0.63 + Math.pow(i / 42, 1.7) * 0.37);
        const x = rnd() * w;
        const len = 10 + rnd() * 90;
        g.strokeStyle = `rgba(214,224,216,${0.04 + rnd() * 0.1})`;
        g.lineWidth = 0.8 + rnd() * 1.2;
        g.beginPath();
        g.moveTo(x, y);
        g.quadraticCurveTo(x + len * 0.5, y - 2 - rnd() * 3, x + len, y);
        g.stroke();
      }
      // 月光反射
      P.glow(g, w * 0.34, h * 0.72, w * 0.16, '#c8cfc2', 0.12);
    },
    paintDynamic(d, w, h, t, par, S) {
      // 浪
      d.save();
      d.beginPath(); d.rect(0, h * 0.62, w, h * 0.38); d.clip();
      for (let i = 0; i < 9; i++) {
        const y = h * (0.66 + i * 0.038);
        d.strokeStyle = `rgba(226,234,226,${0.05 + i * 0.005})`;
        d.lineWidth = 1;
        d.beginPath();
        for (let x = 0; x <= w; x += 18) {
          const yy = y + Math.sin(x * 0.014 + t * (0.5 + i * 0.1) + i) * (2 + i * 0.6);
          x === 0 ? d.moveTo(x, yy) : d.lineTo(x, yy);
        }
        d.stroke();
      }
      d.restore();

      // 鸟
      const b = S.bird;
      const bx = b.x * w + Math.sin(t * 0.4) * w * 0.02 + par.x * 8;
      const by = b.y * h + Math.sin(t * 0.9) * h * 0.012 + par.y * 6;
      const flap = Math.sin(t * 6) * 0.6;

      // 鸟的影
      d.globalAlpha = 0.16;
      P.bird(d, bx + w * 0.02, h * 0.80, Math.min(w, h) * 0.024, flap, '#0d1214');
      d.globalAlpha = 1;

      // 石
      if (!S.dropStone) S.dropStone = { active: false };
      // 落石
      S.drops.forEach((s) => {
        s.vy += 0.35;
        s.y += s.vy * 0.016 * 60;
        d.fillStyle = 'rgba(20,24,24,.95)';
        d.beginPath(); d.arc(s.x, s.y, s.r, 0, TAU); d.fill();
      });
      // 涟漪
      S.splash.forEach((sp) => {
        sp.life -= 0.012;
        if (sp.life <= 0) return;
        d.strokeStyle = `rgba(226,234,226,${sp.life * 0.5})`;
        d.lineWidth = 1;
        d.beginPath(); d.ellipse(sp.x, sp.y, (1 - sp.life) * 44 + 2, ((1 - sp.life) * 44 + 2) * 0.28, 0, 0, TAU); d.stroke();
      });
      S.drops = S.drops.filter((s) => s.y < h * 0.94);
      S.splash = S.splash.filter((s) => s.life > 0);

      // 鸟本体
      d.save();
      d.strokeStyle = 'rgba(16,20,22,.95)';
      d.fillStyle = 'rgba(16,20,22,.95)';
      d.lineWidth = Math.min(w, h) * 0.0035;
      d.lineCap = 'round';
      const s = Math.min(w, h) * 0.022;
      // 双翼
      d.beginPath();
      d.moveTo(bx - s * 1.5, by - s * 0.2);
      d.quadraticCurveTo(bx - s * 0.4, by - s * (1.1 + flap * 0.5), bx, by - s * 0.05);
      d.quadraticCurveTo(bx + s * 0.5, by - s * (1.2 + flap * 0.5), bx + s * 1.6, by - s * 0.1);
      d.stroke();
      // 身体
      d.beginPath();
      d.ellipse(bx, by + s * 0.12, s * 0.62, s * 0.42, 0.2, 0, TAU);
      d.fill();
      // 头与喙
      d.beginPath(); d.arc(bx + s * 0.5, by - s * 0.18, s * 0.26, 0, TAU); d.fill();
      d.beginPath();
      d.moveTo(bx + s * 0.72, by - s * 0.18);
      d.lineTo(bx + s * 1.02, by - s * 0.1);
      d.lineTo(bx + s * 0.7, by - s * 0.04);
      d.closePath(); d.fill();
      // 衔着的石
      if (S.carry !== false) {
        const sx = bx + s * 1.08, sy = by - s * 0.02;
        P.glow(d, sx, sy, s * 0.9, '#cfd6c8', 0.35);
        d.beginPath(); d.arc(sx, sy, s * 0.17, 0, TAU); d.fillStyle = '#c9ccbb'; d.fill();
      }
      d.restore();
    },
    tick(S, dt, w, h) {
      // 鸟飞向目标，投石后返回原位
      if (S.target) {
        S.bird.x += (S.target.x - S.bird.x) * dt * 1.4;
        S.bird.y += (S.target.y - S.bird.y) * dt * 1.4;
        const dx = S.target.x - S.bird.x;
        const dy = S.target.y - S.bird.y;
        if (Math.hypot(dx, dy) < 0.02) {
          const bx = S.bird.x * w, by = S.bird.y * h;
          S.drops.push({ x: bx + 10, y: by, vy: 0.4, r: Math.max(2, Math.min(w, h) * 0.006) });
          S.target = null;
          S.returning = true;
        }
      } else if (S.returning) {
        S.bird.x += (0.62 - S.bird.x) * dt * 0.8;
        S.bird.y += (0.30 - S.bird.y) * dt * 0.8;
        if (Math.hypot(0.62 - S.bird.x, 0.30 - S.bird.y) < 0.01) S.returning = false;
      } else {
        S.bird.x += (0.62 - S.bird.x) * dt * 0.8;
        S.bird.y += (0.30 - S.bird.y) * dt * 0.8;
      }
      // 石头入水
      S.drops.forEach((s) => {
        if (!s.hit && s.y >= h * 0.80) {
          s.hit = true;
          S.splash.push({ x: s.x, y: h * 0.80, life: 1 });
        }
      });
    },
    onDown(x, y, S, w, h) {
      if (y < h * 0.62) return null;
      S.stones++;
      S.target = { x: x / w, y: y / h };
      S.returning = false;
      return 'throw';
    },
    status(S) {
      return { hint: '点 击 海 面 · 投 下 一 块 石', status: `第 ${S.stones} 块 石 头` };
    },
    note(S) { return S.stones >= 10 ? '海没有变浅一寸。她仍然每天衔起一块石头。' : ''; },
  };
  SCENES['jingwei'].noteThreshold = 10;

  window.SCENES = SCENES;
})();