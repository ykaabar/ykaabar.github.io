/* Vitrine · comportements communs (aucune dépendance) */
(() => {
  'use strict';
  const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Langue de la page : textes des illustrations et virgule décimale */
  const EN = document.documentElement.lang === 'en';
  const t = (fr, en) => EN ? en : fr;
  const nb = s => EN ? String(s).replace(/(\d),(\d)/g, '$1.$2') : s;

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
    el('text', { x: L, y: 18, class: 'kpi title', style: '--d:0s' }, svg).textContent = nb(narrow ? 'LARG 6,4' : t('LARG 6,4 · valeurs individuelles', 'LARG 6,4 · individual values'));
    let kx = L;
    [['Cpk', nb('1,46'), 'var(--ok)'], ['Pp', nb('1,09'), 'var(--ink)'], [t('Hors limites', 'Out of limits'), '1', 'var(--danger)']].forEach(([k, val, c], i) => {
      const g = el('g', { class: 'kpi', style: `--d:${.1 + i * .03}s` }, svg);
      el('text', { x: kx, y: 44 }, g).textContent = k;
      el('text', { x: kx + k.length * 7.3 + 6, y: 44, style: `fill:${c};font-weight:600` }, g).textContent = val;
      kx += (k.length + val.length) * 7.3 + (narrow ? 18 : 28);
    });

    const grid = el('g', { class: 'grid' }, svg);
    for (let i = 0; i < v.length; i += 4) el('line', { x1: x(i), x2: x(i), y1: T - 6, y2: H - B }, grid);
    const ligne = (val, cls, lab) => {
      el('line', { x1: L, x2: W - R + 4, y1: y(val), y2: y(val), class: cls }, svg);
      el('text', { x: W - R + 10, y: y(val) + 4 }, svg).textContent = narrow ? lab.split(' ')[0] : nb(lab);
    };
    ligne(lim.usl, 'lim', 'USL 6,500'); ligne(lim.ucl, 'ctl', t('LSC', 'UCL') + ' 6,474'); ligne(lim.cl, 'cl', t('LC', 'CL') + ' 6,416');
    ligne(lim.lcl, 'ctl', t('LIC', 'LCL') + ' 6,359'); ligne(lim.lsl, 'lim', 'LSL 6,300');

    const d = v.map((val, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(val).toFixed(1)}`).join(' ');
    const trace = el('path', { d, class: 'trace' }, svg);
    trace.style.setProperty('--len', Math.ceil(trace.getTotalLength ? trace.getTotalLength() : 900));

    v.forEach((val, i) => {
      const out = val > lim.usl || val < lim.lsl;
      if (out) el('circle', { cx: x(i), cy: y(val), r: 5, class: 'halo' }, svg);
      const c = el('circle', { cx: x(i), cy: y(val), r: out ? 5 : (narrow ? 3 : 3.6), class: 'pt' + (out ? ' out' : '') }, svg);
      c.style.setProperty('--i', i); c.style.setProperty('--n', v.length);
    });

    const alerte = t('Alerte · arrêt', 'Alert · line stop'), last = v.length - 1, fw = alerte.length * 7.3 + 24, fx = x(last) - fw - 12, fy = y(v[last]) - 13;
    const flag = el('g', { class: 'flag' }, svg);
    el('rect', { x: fx, y: fy, width: fw, height: 26, rx: 6 }, flag);
    el('text', { x: fx + 12, y: fy + 17 }, flag).textContent = alerte;
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
    entete(svg, narrow ? 'SCAR-2026-014' : t('SCAR-2026-014 · 8D fournisseur', 'SCAR-2026-014 · supplier 8D'), [[t('Étapes', 'Steps'), '8/8', 'var(--ok)'], [t('Délai', 'Lead time'), t('27 j', '27 d')], [t('Objectif', 'Target'), t('≤ 30 j', '≤ 30 d')]], narrow);
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
    const noms = narrow ? [[0, t('Équipe', 'Team')], [3, t('Cause', 'Cause')], [7, t('Clôture', 'Closure')]] : [[0, t('Équipe', 'Team')], [3, t('Cause racine', 'Root cause')], [5, t('Actions', 'Actions')], [7, t('Clôture', 'Closure')]];
    noms.forEach(([i, t]) => el('text', { x: x(i), y: cy + r + 22, 'text-anchor': i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle', dx: i === 0 ? -r : i === n - 1 ? r : 0 }, svg).textContent = t);
    drapeau(svg, 4, cy + r + 44, t('8D clos · efficacité vérifiée', '8D closed · effectiveness verified'), 'var(--ok)', .3 + pas * n);
  }

  /* OQC : prélèvement ISO 2859-1 dans un lot de 150 pièces */
  function echantillon(svg) {
    const { W, H, narrow } = cadre(svg, 328, 328);
    entete(svg, nb(narrow ? t('ISO 2859-1 · NQA 0,65', 'ISO 2859-1 · AQL 0,65') : t('ISO 2859-1 · niveau II · NQA 0,65', 'ISO 2859-1 · level II · AQL 0,65')), [['Lot', '150'], ['n', '20'], ['Ac', '0'], ['Re', '1']], narrow);
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
    const w = drapeau(svg, 4, by, t('Lot refusé', 'Lot rejected'), 'var(--danger)', 2.4);
    el('text', { x: 4 + w + 12, y: by + 17, class: 'a', style: '--d:2.4s' }, svg).textContent = narrow ? t('1 défaut > Ac 0', '1 defect > Ac 0') : t('1 défaut dans l\'échantillon > Ac 0', '1 defect in the sample > Ac 0');
  }

  /* ECME : l'aiguille se stabilise dans la zone de tolérance */
  function jauge(svg) {
    const { W, narrow } = cadre(svg, 304, 304);
    entete(svg, narrow ? t('PC-006 · Pied à coulisse', 'PC-006 · Caliper') : t('PC-006 · Pied à coulisse 0–150 mm', 'PC-006 · Caliper 0–150 mm'), [[t('Écart', 'Error'), nb('+0,01 mm'), 'var(--ok)'], [t('EMT', 'MPE'), nb('±0,03 mm')]], narrow);
    const cx = W / 2, cy = 212, R = Math.min(128, (W - 96) / 2), pt = (a, rr) => [cx + rr * Math.sin(a * Math.PI / 180), cy - rr * Math.cos(a * Math.PI / 180)];
    const arc = (a0, a1, rr) => { const [x0, y0] = pt(a0, rr), [x1, y1] = pt(a1, rr); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${rr} ${rr} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
    el('path', { d: arc(-80, 80, R), style: 'fill:none;stroke:var(--grid);stroke-width:14;stroke-linecap:round' }, svg);
    el('path', { d: arc(-24, 24, R), class: 'a', style: 'fill:none;stroke:var(--ok);stroke-width:14;opacity:.85;--d:.2s' }, svg);
    for (let a = -80; a <= 80; a += 8) { const [x0, y0] = pt(a, R - 14), [x1, y1] = pt(a, R - (a % 40 === 0 ? 26 : 20)); el('line', { x1: x0, y1: y0, x2: x1, y2: y1, style: 'stroke:var(--faint);stroke-width:1' }, svg); }
    [[-24, t('−EMT', '−MPE'), 'end'], [24, t('+EMT', '+MPE'), 'start'], [0, '0', 'middle']].forEach(([a, t, anc]) => { const [x, y] = pt(a, R + 20); el('text', { x, y: y + 4, 'text-anchor': anc }, svg).textContent = t; });
    const g = el('g', { class: 'needle', style: `transform-origin:${cx}px ${cy}px;--to:8deg` }, svg);
    el('line', { x1: cx, y1: cy + 10, x2: cx, y2: cy - R + 18, style: 'stroke:var(--ink);stroke-width:2.5;stroke-linecap:round' }, g);
    el('circle', { cx, cy, r: 7, style: 'fill:var(--ink)' }, svg);
    const txt = t('Conforme', 'Compliant'), w = txt.length * 7.3 + 24;
    drapeau(svg, cx - w / 2, cy + 28, txt, 'var(--ok)', 1.7);
    el('text', { x: cx, y: cy + 76, 'text-anchor': 'middle', class: 'a', style: '--d:1.8s' }, svg).textContent = t('Prochaine échéance : 11.2027', 'Next calibration: 11.2027');
  }

  /* Gage R&R : d'où vient la variation mesurée */
  function barresRR(svg) {
    const { W, narrow } = cadre(svg, 328, 328);
    entete(svg, narrow ? 'MSA type 2' : t('MSA type 2 · 10 pièces × 3 opérateurs × 3 essais', 'MSA type 2 · 10 parts × 3 operators × 3 trials'), [['%R&R', nb('26,7 %'), 'var(--warn)'], ['ndc', '5', 'var(--ok)']], narrow);
    const L = 4, R = 64, lw = W - L - R, T = 90, pas = 50;
    const lignes = [[t('Répétabilité (moyen de mesure)', 'Repeatability (equipment)'), t('Répétabilité', 'Repeatability'), 20.0, 'var(--accent)'], [t('Reproductibilité (opérateurs)', 'Reproducibility (operators)'), t('Reproductibilité', 'Reproducibility'), 17.7, 'var(--accent)'], [t('R&R total', 'Total R&R'), t('R&R total', 'Total R&R'), 26.7, 'var(--warn)'], [t('Variation des pièces', 'Part variation'), t('Pièces', 'Parts'), 96.4, 'var(--faint)']];
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
      el('text', { x: W - 4, y: y + 30, 'text-anchor': 'end', class: 'a', style: `--d:${d + .4}s;fill:var(--ink);font-weight:600` }, svg).textContent = (EN ? v.toFixed(1) : v.toFixed(1).replace('.', ',')) + ' %';
    });
    drapeau(svg, L, T + pas * 4 + 2, t('Acceptable sous conditions', 'Conditionally acceptable'), 'var(--warn)', 1.7);
  }

  /* Qyklo : les mini-apps rejoignent le cycle PDCA, qui se boucle.
     Même géométrie que le logo (anneau coupé en 4, segment 0 = Plan en haut,
     sens horaire ; coupures de 14° ; queue à 45° vers le bas à droite).
     Le Q ne tourne jamais : les segments s'allument tour à tour. */
  function cycleQyklo(svg) {
    const { W, narrow } = cadre(svg, 380, 340);
    const H = narrow ? 340 : 380, cx = W / 2, cy = narrow ? 158 : 182, R = narrow ? 70 : 92, T = narrow ? 26 : 34;
    const pt = a => [cx + R * Math.cos(a * Math.PI / 180), cy + R * Math.sin(a * Math.PI / 180)];
    const noms = ['Plan', 'Do', 'Check', 'Act'];
    const modules = narrow ? [t('Politique · KPI', 'Policy · KPI'), t('Atelier', 'Floor'), t('Audits · Mesure', 'Audits · Gauges'), '8D · SCAR'] : [t('Politique · KPI · Revues', 'Policy · KPI · Reviews'), t('Alertes · Rebuts · Terrain', 'Alerts · Scrap · Floor'), t('Audits · Capabilité · Métrologie', 'Audits · Capability · Metrology'), '8D · SCAR · CAPA'];
    const lumiere = [.5, .85, 1.75, 2.55];
    noms.forEach((nom, i) => {
      const deb = -90 - 45 + i * 90 + 7, fin = deb + 76, [x1, y1] = pt(deb), [x2, y2] = pt(fin);
      el('path', { d: `M${x1.toFixed(1)} ${y1.toFixed(1)}A${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`, class: 'seg', 'stroke-width': T, style: `--d:${lumiere[i]}s` }, svg);
      /* libellés : au-dessus, à droite, en dessous, à gauche */
      const off = R + T / 2 + (narrow ? 14 : 18);
      const pos = [[cx, cy - off - 18, 'middle'], [cx + off, cy - 6, 'start'], [cx, cy + off + 6, 'middle'], [cx - off, cy - 6, 'end']][i];
      const g = el('g', { class: 'a', style: `--d:${lumiere[i]}s` }, svg);
      el('text', { x: pos[0], y: pos[1], 'text-anchor': pos[2], class: 'qlab' }, g).textContent = nom.toUpperCase();
      const lignes = i % 2 === 0 ? [modules[i]] : modules[i].split(' · '); /* côtés : un module par ligne */
      lignes.forEach((l, k) => el('text', { x: pos[0], y: pos[1] + 18 + k * 16, 'text-anchor': pos[2], class: 'qmod' }, g).textContent = l);
    });
    /* Les mini-apps du portfolio rejoignent leur quadrant (SPC et ECME : Check ; SCAR : Act) */
    const chips = [['1', 'SPC', 2, -1], ['4', 'ECME', 2, 1], ['2', 'SCAR', 3, 0]];
    chips.forEach(([n, nom, q, k], j) => {
      const a = -90 + q * 90 + (k * 18), [tx, ty] = [cx + R * Math.cos(a * Math.PI / 180), cy + R * Math.sin(a * Math.PI / 180)];
      const w = nom.length * 7.3 + 44, x = tx - w / 2, y = ty - 14;
      const depart = [[-(cx - 60), -(cy - 30)], [W - cx - 60, -(cy - 30)], [-(cx - 70), H - cy - 40]][j];
      const g = el('g', { class: 'chip', style: `--dx:${depart[0]}px;--dy:${depart[1]}px;--d:${.15 + j * .03}s;--t:${(q === 2 ? 1.6 : 2.4)}s` }, svg);
      el('rect', { x, y, width: w, height: 28, rx: 4 }, g);
      el('circle', { cx: x + 16, cy: y + 14, r: 9 }, g);
      el('text', { x: x + 16, y: y + 18, 'text-anchor': 'middle' }, g).textContent = n;
      el('text', { x: x + 32, y: y + 18 }, g).textContent = nom;
    });
    /* La queue orange sort : le cycle est bouclé, on retrouve le symbole Qyklo */
    const q0 = R * .38, q1 = R * 1.43, c = Math.SQRT1_2; /* proportions du logo : 0,38 R à 1,43 R */
    const queue = el('line', { x1: cx + q0 * c, y1: cy + q0 * c, x2: cx + q1 * c, y2: cy + q1 * c, class: 'queue', 'stroke-width': T, style: '--d:3s' }, svg);
    queue.style.setProperty('--len', Math.ceil((q1 - q0) + T));
    const lib = el('g', { class: 'a', style: '--d:3.3s' }, svg), txt = t('Cycle bouclé', 'Cycle closed'), wl = txt.length * 7.3 + 24;
    el('rect', { x: cx - wl / 2, y: H - 30, width: wl, height: 26, rx: 4, style: 'fill:#1a7346' }, lib);
    el('text', { x: cx - wl / 2 + 12, y: H - 13, style: 'fill:#fff;font-weight:600' }, lib).textContent = txt;
  }

  /* Accueil : la charte Qyklo s'applique tant que sa section occupe le centre de l'écran */
  const zone = document.querySelector('[data-zone-charte="qyklo"]');
  if (zone && 'IntersectionObserver' in window) {
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) document.documentElement.dataset.charte = 'qyklo';
      else delete document.documentElement.dataset.charte;
    }), { rootMargin: '-45% 0px -45% 0px' }).observe(zone);
  }


  /* ---------- Calculateur de capabilité ----------
     Cp = (USL − LSL) / 6σ ; Cpk = min(USL − µ, µ − LSL) / 3σ ;
     part hors tolérance = Φ((LSL − µ)/σ) + 1 − Φ((USL − µ)/σ). */
  const fx = (v, d) => { const s = v.toFixed(d); return EN ? s : s.replace('.', ','); };
  const phi = z => { /* loi normale cumulée (approximation d'Abramowitz et Stegun 26.2.17) */
    const t = 1 / (1 + .2316419 * Math.abs(z)), d = .3989423 * Math.exp(-z * z / 2);
    const p = d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  };
  const cpk = document.getElementById('calc-cpk');
  if (cpk) {
    const LSL = 9.9, USL = 10.1, NOM = 10, X0 = 9.84, X1 = 10.16, W = 320, H = 140, B = 112;
    const m = cpk.querySelector('#cpk-m'), sd = cpk.querySelector('#cpk-s'), svg = cpk.querySelector('svg');
    const px = v => (v - X0) / (X1 - X0) * W;
    const maj = () => {
      const mu = +m.value, s = +sd.value;
      const cp = (USL - LSL) / (6 * s), k = Math.min(USL - mu, mu - LSL) / (3 * s);
      const hors = phi((LSL - mu) / s) + 1 - phi((USL - mu) / s), ppm = Math.round(hors * 1e6);
      cpk.querySelector('#cpk-m-v').textContent = fx(mu, 3) + ' mm';
      cpk.querySelector('#cpk-s-v').textContent = fx(s, 3) + ' mm';
      cpk.querySelector('#cpk-cp').textContent = fx(cp, 2);
      cpk.querySelector('#cpk-cpk').textContent = fx(k, 2);
      cpk.querySelector('#cpk-ppm').textContent = ppm >= 1e5 ? fx(hors * 100, 1) + ' %' : ppm.toLocaleString(EN ? 'en' : 'fr-CH') + ' ppm';
      const [cl, lab, txt] = k >= 1.33 ? ['ok', t('Capable', 'Capable'), t('Le procédé tient la tolérance avec de la marge (Cpk ≥ 1,33).', 'The process holds the tolerance with margin (Cpk ≥ 1.33).')]
        : k >= 1 ? ['warn', t('À surveiller', 'Watch'), t('Le procédé tient la tolérance, sans marge : à surveiller (1 ≤ Cpk < 1,33).', 'The process holds the tolerance with no margin (1 ≤ Cpk < 1.33).')]
        : ['bad', t('Non capable', 'Not capable'), t('Le procédé produit des pièces hors tolérance (Cpk < 1) : centrer ou réduire la dispersion.', 'The process makes out-of-tolerance parts (Cpk < 1): centre it or reduce the spread.')];
      cpk.querySelector('#cpk-verdict').innerHTML = `<span class="badge ${cl}">${lab}</span>${txt}`;
      /* courbe en cloche */
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      /* hauteur du pic constante : la largeur de la cloche montre la dispersion */
      const pts = [], y = v => B - Math.exp(-((v - mu) ** 2) / (2 * s * s)) * (B - 12);
      for (let i = 0; i <= 160; i++) { const v = X0 + (X1 - X0) * i / 160; pts.push([px(v), y(v)]); }
      const d = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
      el('rect', { x: px(LSL), y: 4, width: px(USL) - px(LSL), height: B - 4, class: 'zone' }, svg);
      const horsZone = (a, b) => { const q = pts.filter(p => p[0] >= px(a) && p[0] <= px(b)); if (q.length > 1) el('path', { d: `M${q[0][0]} ${B} L` + q.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ` L${q[q.length - 1][0]} ${B} Z`, class: 'hors' }, svg); };
      horsZone(X0, LSL); horsZone(USL, X1);
      el('path', { d, class: 'courbe' }, svg);
      [[LSL, 'LSL'], [USL, 'USL']].forEach(([v, l]) => { el('line', { x1: px(v), x2: px(v), y1: 4, y2: B, class: 'tol' }, svg); el('text', { x: px(v), y: B + 18, 'text-anchor': 'middle' }, svg).textContent = l; });
      el('line', { x1: px(NOM), x2: px(NOM), y1: 4, y2: B, class: 'nom' }, svg);
      el('text', { x: px(NOM), y: B + 18, 'text-anchor': 'middle' }, svg).textContent = fx(NOM, 2);
      el('line', { x1: 0, x2: W, y1: B, y2: B, style: 'stroke:var(--line)' }, svg);
    };
    m.addEventListener('input', maj); sd.addEventListener('input', maj); maj();
  }

  /* ---------- Plan d'échantillonnage ISO 2859-1 ----------
     Tables reprises de l'application OQC (tableau I : lettre-code ; tableau II-A :
     contrôle normal, échantillonnage simple ; flèches suivies jusqu'au premier plan). */
  const aql = document.getElementById('calc-aql');
  if (aql) {
    const LETTRES = 'ABCDEFGHJKLMNPQR'.split(''), ECH = [2, 3, 5, 8, 13, 20, 32, 50, 80, 125, 200, 315, 500, 800, 1250, 2000];
    const LOTS = [[2, 8, 'A', 'A', 'B'], [9, 15, 'A', 'B', 'C'], [16, 25, 'B', 'C', 'D'], [26, 50, 'C', 'D', 'E'], [51, 90, 'C', 'E', 'F'], [91, 150, 'D', 'F', 'G'],
      [151, 280, 'E', 'G', 'H'], [281, 500, 'F', 'H', 'J'], [501, 1200, 'G', 'J', 'K'], [1201, 3200, 'H', 'K', 'L'], [3201, 10000, 'J', 'L', 'M'],
      [10001, 35000, 'K', 'M', 'N'], [35001, 150000, 'L', 'N', 'P'], [150001, 500000, 'M', 'P', 'Q'], [500001, Infinity, 'N', 'Q', 'R']];
    const NQA = ['0.010', '0.015', '0.025', '0.040', '0.065', '0.10', '0.15', '0.25', '0.40', '0.65', '1.0', '1.5', '2.5', '4.0', '6.5', '10'];
    const DIAG = { 0: [0, 1], 3: [1, 2], 4: [2, 3], 5: [3, 4], 6: [5, 6], 7: [7, 8], 8: [10, 11], 9: [14, 15], 10: [21, 22] };
    const cell = (i, j) => { const d = i + j - 14; return DIAG[d] ? { ac: DIAG[d][0], re: DIAG[d][1] } : (d === 1 || d > 10) ? 'up' : 'down'; };
    const plan = (lot, niv, a) => {
      const j = NQA.indexOf(a), r = LOTS.find(x => lot >= x[0] && lot <= x[1]); if (j < 0 || !r) return null;
      const start = LETTRES.indexOf(r[{ I: 2, II: 3, III: 4 }[niv]]); let i = start, c = cell(i, j), g = 0;
      while (typeof c === 'string' && g++ < 20) { i += c === 'up' ? -1 : 1; if (i < 0) { i = start; while (typeof cell(i, j) === 'string' && i < 15) i++; c = cell(i, j); break; } if (i > 15) { i = 15; c = { ac: 1, re: 2 }; break; } c = cell(i, j); }
      if (typeof c === 'string') return null;
      let n = ECH[i], full = false; if (n >= lot) { n = lot; full = true; }
      return { l: LETTRES[i], n, ac: c.ac, re: c.re, full };
    };
    const sel = aql.querySelector('#aql-nqa');
    NQA.forEach(a => { const o = document.createElement('option'); o.value = a; o.textContent = EN ? a : a.replace('.', ','); if (a === '0.65') o.selected = true; sel.appendChild(o); });
    const maj = () => {
      const lot = Math.floor(+aql.querySelector('#aql-lot').value), p = lot >= 2 ? plan(lot, aql.querySelector('#aql-niv').value, sel.value) : null;
      const out = (id, v) => { aql.querySelector(id).textContent = v; };
      if (!p) { out('#aql-l', '–'); out('#aql-n', '–'); out('#aql-acre', '–'); aql.querySelector('#aql-phrase').textContent = t('Saisissez une taille de lot d\'au moins 2 pièces.', 'Enter a lot size of at least 2 parts.'); return; }
      out('#aql-l', p.l); out('#aql-n', p.n.toLocaleString(EN ? 'en' : 'fr-CH')); out('#aql-acre', `${p.ac} / ${p.re}`);
      const pieces = n => n > 1 ? t('pièces', 'parts') : t('pièce', 'part');
      aql.querySelector('#aql-phrase').textContent = (p.full ? t('Contrôlez tout le lot. ', 'Inspect the whole lot. ') : t(`Prélevez ${p.n} ${pieces(p.n)}. `, `Sample ${p.n} ${pieces(p.n)}. `))
        + (p.ac === 0 ? t('Acceptez le lot seulement sans aucun défaut ; refusez-le dès 1 défaut.', 'Accept the lot only with zero defects; reject it from 1 defect.')
          : t(`Acceptez le lot jusqu'à ${p.ac} défaut${p.ac > 1 ? 's' : ''}, refusez-le à partir de ${p.re}.`, `Accept the lot with up to ${p.ac} defect${p.ac === 1 ? '' : 's'}, reject it from ${p.re}.`));
    };
    aql.addEventListener('input', maj); aql.addEventListener('change', maj); maj();
  }


  /* Vidéo : lecture muette quand elle est à l'écran, pause sinon ; jamais automatique si « réduire les animations » */
  document.querySelectorAll('video[data-auto]').forEach(v => {
    if (calme || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { const p = v.play(); if (p) p.catch(() => {}); } else v.pause();
    }), { threshold: .5 }).observe(v);
  });

  const DESSINS = { qyklo: cycleQyklo, spc: carteSPC, scar: pipeline8D, oqc: echantillon, ecme: jauge, rr: barresRR };
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
