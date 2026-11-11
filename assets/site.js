/* Vitrine · comportements communs (aucune dépendance) */
(() => {
  'use strict';
  const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* En-tête : filet sous la barre dès qu'on défile */
  const top = document.querySelector('.top');
  if (top) {
    const maj = () => top.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', maj, { passive: true }); maj();
  }

  /* Apparition des blocs au défilement */
  const blocs = document.querySelectorAll('.reveal');
  if (calme || !('IntersectionObserver' in window)) blocs.forEach(b => b.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    blocs.forEach(b => io.observe(b));
  }

  /* Carte de contrôle animée : <svg class="chart" data-chart="spc"> */
  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };

  /* Dessinée à sa largeur réelle : le texte garde 12 px minimum, même sur téléphone */
  function carteSPC(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const W = Math.max(280, Math.round(svg.getBoundingClientRect().width) || 560);
    const narrow = W < 400;
    const H = narrow ? 260 : 300, L = 4, R = narrow ? 76 : 92, T = 64, B = 32;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('height', H);
    /* Mesures fictives : stables, dérive lente, puis un point hors tolérance */
    const v = [6.402, 6.396, 6.411, 6.389, 6.405, 6.398, 6.414, 6.392, 6.407, 6.401, 6.395, 6.409,
      6.404, 6.416, 6.410, 6.421, 6.415, 6.427, 6.423, 6.434, 6.431, 6.442, 6.451, 6.512];
    const lim = { usl: 6.5, ucl: 6.4738, cl: 6.4162, lcl: 6.3586, lsl: 6.3 };
    const y0 = 6.28, y1 = 6.53;
    const x = i => L + i * (W - L - R) / (v.length - 1);
    const y = val => T + (y1 - val) / (y1 - y0) * (H - T - B);

    /* Titre et indicateurs, placés l'un après l'autre */
    el('text', { x: L, y: 18, class: 'kpi title', style: '--d:0s' }, svg).textContent = narrow ? 'LARG 6,4' : 'LARG 6,4 · valeurs individuelles';
    let kx = L;
    [['Cpk', '1,46', 'var(--ok)'], ['Pp', '1,09', 'var(--ink)'], ['Hors limites', '1', 'var(--danger)']].forEach(([k, val, c], i) => {
      const g = el('g', { class: 'kpi', style: `--d:${.1 + i * .03}s` }, svg);
      el('text', { x: kx, y: 44 }, g).textContent = k;
      el('text', { x: kx + k.length * 7.3 + 6, y: 44, style: `fill:${c};font-weight:600` }, g).textContent = val;
      kx += (k.length + val.length) * 7.3 + (narrow ? 18 : 28);
    });

    const grid = el('g', { class: 'grid' }, svg);
    for (let i = 0; i < v.length; i += 4) el('line', { x1: x(i), x2: x(i), y1: T - 6, y2: H - B }, grid);
    const ligne = (val, cls, lab) => {
      el('line', { x1: L, x2: W - R + 4, y1: y(val), y2: y(val), class: cls }, svg);
      el('text', { x: W - R + 10, y: y(val) + 4 }, svg).textContent = narrow ? lab.split(' ')[0] : lab;
    };
    ligne(lim.usl, 'lim', 'USL 6,500'); ligne(lim.ucl, 'ctl', 'LSC 6,474'); ligne(lim.cl, 'cl', 'LC 6,416');
    ligne(lim.lcl, 'ctl', 'LIC 6,359'); ligne(lim.lsl, 'lim', 'LSL 6,300');

    const d = v.map((val, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(val).toFixed(1)}`).join(' ');
    const trace = el('path', { d, class: 'trace' }, svg);
    trace.style.setProperty('--len', Math.ceil(trace.getTotalLength ? trace.getTotalLength() : 900));

    v.forEach((val, i) => {
      const out = val > lim.usl || val < lim.lsl;
      if (out) el('circle', { cx: x(i), cy: y(val), r: 5, class: 'halo' }, svg);
      const c = el('circle', { cx: x(i), cy: y(val), r: out ? 5 : (narrow ? 3 : 3.6), class: 'pt' + (out ? ' out' : '') }, svg);
      c.style.setProperty('--i', i); c.style.setProperty('--n', v.length);
    });

    const last = v.length - 1, fw = 120, fx = x(last) - fw - 12, fy = y(v[last]) - 13;
    const flag = el('g', { class: 'flag' }, svg);
    el('rect', { x: fx, y: fy, width: fw, height: 26, rx: 6 }, flag);
    el('text', { x: fx + 12, y: fy + 17 }, flag).textContent = 'Alerte · arrêt';
    el('text', { x: L, y: H - 8 }, svg).textContent = 'OF400101';
    if (!narrow) el('text', { x: L + (W - L - R) / 2 - 28, y: H - 8 }, svg).textContent = 'OF400102';
    el('text', { x: W - R - 62, y: H - 8 }, svg).textContent = 'OF400103';
  }

  /* Outils communs aux illustrations */
  const cadre = (svg, hWide, hNarrow) => {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const W = Math.max(280, Math.round(svg.getBoundingClientRect().width) || 560), narrow = W < 400, H = narrow ? hNarrow : hWide;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('height', H);
    return { W, H, narrow };
  };
  const entete = (svg, titre, kpis, narrow) => {
    el('text', { x: 4, y: 18, class: 'a title', style: '--d:0s' }, svg).textContent = titre;
    let kx = 4;
    kpis.forEach(([k, val, c], i) => {
      const g = el('g', { class: 'a', style: `--d:${.1 + i * .03}s` }, svg);
      el('text', { x: kx, y: 44 }, g).textContent = k;
      el('text', { x: kx + k.length * 7.3 + 6, y: 44, style: `fill:${c || 'var(--ink)'};font-weight:600` }, g).textContent = val;
      kx += (k.length + val.length) * 7.3 + (narrow ? 18 : 28);
    });
  };
  const drapeau = (svg, x, y, texte, couleur, d) => {
    const w = texte.length * 7.3 + 24, g = el('g', { class: 'a', style: `--d:${d}s` }, svg);
    el('rect', { x, y, width: w, height: 26, rx: 6, style: `fill:${couleur}` }, g);
    el('text', { x: x + 12, y: y + 17, style: 'fill:#fff;font-weight:600' }, g).textContent = texte;
    return w;
  };

  /* SCAR : les huit étapes du 8D se valident une à une */
  function pipeline8D(svg) {
    const { W, narrow } = cadre(svg, 220, 210);
    entete(svg, narrow ? 'SCAR-2026-014' : 'SCAR-2026-014 · 8D fournisseur', [['Étapes', '8/8', 'var(--ok)'], ['Délai', '27 j'], ['Objectif', '≤ 30 j']], narrow);
    const n = 8, r = narrow ? 14 : 18, x0 = 4 + r, x1 = W - 4 - r, cy = 108, x = i => x0 + i * (x1 - x0) / (n - 1), pas = .28;
    el('line', { x1: x0, x2: x1, y1: cy, y2: cy, style: 'stroke:var(--grid);stroke-width:3' }, svg);
    el('rect', { x: x0, y: cy - 1.5, width: x1 - x0, height: 3, class: 'g', style: `fill:var(--accent);--d:.3s;--t:${pas * (n - 1)}s;--e:linear` }, svg);
    for (let i = 0; i < n; i++) {
      el('circle', { cx: x(i), cy, r, style: 'fill:var(--surface);stroke:var(--faint);stroke-width:1.5' }, svg);
      el('text', { x: x(i), y: cy + 4, 'text-anchor': 'middle' }, svg).textContent = 'D' + (i + 1);
      const g = el('g', { class: 'a pop', style: `--d:${.3 + i * pas}s` }, svg), fin = i === n - 1;
      el('circle', { cx: x(i), cy, r, style: `fill:${fin ? 'var(--ok)' : 'var(--accent)'}` }, g);
      el('text', { x: x(i), y: cy + 4, 'text-anchor': 'middle', style: 'fill:#fff;font-weight:600' }, g).textContent = 'D' + (i + 1);
    }
    const noms = narrow ? [[0, 'Équipe'], [3, 'Cause'], [7, 'Clôture']] : [[0, 'Équipe'], [3, 'Cause racine'], [5, 'Actions'], [7, 'Clôture']];
    noms.forEach(([i, t]) => el('text', { x: x(i), y: cy + r + 22, 'text-anchor': i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle', dx: i === 0 ? -r : i === n - 1 ? r : 0 }, svg).textContent = t);
    drapeau(svg, 4, cy + r + 44, '8D clos · efficacité vérifiée', 'var(--ok)', .3 + pas * n);
  }

  /* OQC : prélèvement ISO 2859-1 dans un lot de 150 pièces */
  function echantillon(svg) {
    const { W, H, narrow } = cadre(svg, 328, 328);
    entete(svg, narrow ? 'ISO 2859-1 · NQA 0,65' : 'ISO 2859-1 · niveau II · NQA 0,65', [['Lot', '150'], ['n', '20'], ['Ac', '0'], ['Re', '1']], narrow);
    const cols = 15, rows = 10, pas = Math.min(26, (W - 8) / cols), py = Math.min(pas, 20), r = Math.min(5, pas / 2 - 3), T = 72;
    const tires = [7, 19, 26, 38, 44, 51, 63, 70, 82, 88, 95, 101, 107, 113, 118, 124, 131, 137, 142, 148], defaut = 95;
    for (let k = 0; k < cols * rows; k++) {
      const cx = 4 + pas / 2 + (k % cols) * pas, cy = T + py / 2 + Math.floor(k / cols) * py;
      el('circle', { cx, cy, r, style: 'fill:var(--grid)' }, svg);
      const t = tires.indexOf(k);
      if (t >= 0) {
        el('circle', { cx, cy, r: r + 1, class: 'a pop', style: `fill:var(--accent);--d:${.3 + t * .07}s` }, svg);
        if (k === defaut) {
          el('circle', { cx, cy, r: r + 1, class: 'a pop', style: 'fill:var(--danger);--d:2.1s' }, svg);
          el('circle', { cx, cy, r: r + 1, class: 'halo', style: '--d:2.1s' }, svg);
        }
      }
    }
    const by = T + rows * py + 14;
    const w = drapeau(svg, 4, by, 'Lot refusé', 'var(--danger)', 2.4);
    el('text', { x: 4 + w + 12, y: by + 17, class: 'a', style: '--d:2.4s' }, svg).textContent = narrow ? '1 défaut > Ac 0' : '1 défaut dans l\'échantillon > Ac 0';
  }

  /* ECME : l'aiguille se stabilise dans la zone de tolérance */
  function jauge(svg) {
    const { W, narrow } = cadre(svg, 304, 304);
    entete(svg, narrow ? 'PC-006 · Pied à coulisse' : 'PC-006 · Pied à coulisse 0–150 mm', [['Écart', '+0,01 mm', 'var(--ok)'], ['EMT', '±0,03 mm']], narrow);
    const cx = W / 2, cy = 212, R = Math.min(128, (W - 96) / 2), pt = (a, rr) => [cx + rr * Math.sin(a * Math.PI / 180), cy - rr * Math.cos(a * Math.PI / 180)];
    const arc = (a0, a1, rr) => { const [x0, y0] = pt(a0, rr), [x1, y1] = pt(a1, rr); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${rr} ${rr} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
    el('path', { d: arc(-80, 80, R), style: 'fill:none;stroke:var(--grid);stroke-width:14;stroke-linecap:round' }, svg);
    el('path', { d: arc(-24, 24, R), class: 'a', style: 'fill:none;stroke:var(--ok);stroke-width:14;opacity:.85;--d:.2s' }, svg);
    for (let a = -80; a <= 80; a += 8) { const [x0, y0] = pt(a, R - 14), [x1, y1] = pt(a, R - (a % 40 === 0 ? 26 : 20)); el('line', { x1: x0, y1: y0, x2: x1, y2: y1, style: 'stroke:var(--faint);stroke-width:1' }, svg); }
    [[-24, '−EMT', 'end'], [24, '+EMT', 'start'], [0, '0', 'middle']].forEach(([a, t, anc]) => { const [x, y] = pt(a, R + 20); el('text', { x, y: y + 4, 'text-anchor': anc }, svg).textContent = t; });
    const g = el('g', { class: 'needle', style: `transform-origin:${cx}px ${cy}px;--to:8deg` }, svg);
    el('line', { x1: cx, y1: cy + 10, x2: cx, y2: cy - R + 18, style: 'stroke:var(--ink);stroke-width:2.5;stroke-linecap:round' }, g);
    el('circle', { cx, cy, r: 7, style: 'fill:var(--ink)' }, svg);
    const txt = 'Conforme', w = txt.length * 7.3 + 24;
    drapeau(svg, cx - w / 2, cy + 28, txt, 'var(--ok)', 1.7);
    el('text', { x: cx, y: cy + 76, 'text-anchor': 'middle', class: 'a', style: '--d:1.8s' }, svg).textContent = 'Prochaine échéance : 11.2027';
  }

  /* Gage R&R : d'où vient la variation mesurée */
  function barresRR(svg) {
    const { W, narrow } = cadre(svg, 328, 328);
    entete(svg, narrow ? 'MSA type 2' : 'MSA type 2 · 10 pièces × 3 opérateurs × 3 essais', [['%R&R', '26,7 %', 'var(--warn)'], ['ndc', '5', 'var(--ok)']], narrow);
    const L = 4, R = 64, lw = W - L - R, T = 90, pas = 50;
    const lignes = [['Répétabilité (moyen de mesure)', 'Répétabilité', 20.0, 'var(--accent)'], ['Reproductibilité (opérateurs)', 'Reproductibilité', 17.7, 'var(--accent)'], ['R&R total', 'R&R total', 26.7, 'var(--warn)'], ['Variation des pièces', 'Pièces', 96.4, 'var(--faint)']];
    [[10, '10 %'], [30, '30 %']].forEach(([v, t]) => {
      const x = L + lw * v / 100;
      el('line', { x1: x, x2: x, y1: T - 8, y2: T + pas * 3 - 14, style: 'stroke:var(--danger);stroke-width:1;stroke-dasharray:3 4;opacity:.6' }, svg);
      el('text', { x, y: T - 12, 'text-anchor': 'middle' }, svg).textContent = t;
    });
    lignes.forEach(([long, court, v, c], i) => {
      const y = T + i * pas, d = .3 + i * .25;
      el('text', { x: L, y: y + 12, style: 'fill:var(--ink-2)' }, svg).textContent = narrow ? court : long;
      el('rect', { x: L, y: y + 20, width: lw, height: 10, rx: 2, style: 'fill:var(--grid)' }, svg);
      el('rect', { x: L, y: y + 20, width: lw * v / 100, height: 10, rx: 2, class: 'g', style: `fill:${c};--d:${d}s;--t:.6s` }, svg);
      el('text', { x: W - 4, y: y + 30, 'text-anchor': 'end', class: 'a', style: `--d:${d + .4}s;fill:var(--ink);font-weight:600` }, svg).textContent = v.toFixed(1).replace('.', ',') + ' %';
    });
    drapeau(svg, L, T + pas * 4 + 2, 'Acceptable sous conditions', 'var(--warn)', 1.7);
  }

  const DESSINS = { spc: carteSPC, scar: pipeline8D, oqc: echantillon, ecme: jauge, rr: barresRR };
  document.querySelectorAll('svg[data-chart]').forEach(svg => {
    const dessiner = DESSINS[svg.dataset.chart]; if (!dessiner) return;
    dessiner(svg);
    let w = svg.getBoundingClientRect().width, t;
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { const n = svg.getBoundingClientRect().width; if (Math.abs(n - w) > 24) { w = n; dessiner(svg); } }, 150); });
    if (calme || !('IntersectionObserver' in window)) { svg.classList.add('play'); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { svg.classList.add('play'); io.disconnect(); } }), { threshold: .35 });
    io.observe(svg);
  });
})();
