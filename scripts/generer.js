#!/usr/bin/env node
/* Génère les fichiers « construits » du site avec Chromium (Playwright) :
   - assets/cv/Yassine_Kaabar_CV.pdf et Yassine_Kaabar_CV_EN.pdf (depuis scripts/cv/)
   - assets/og/<langue>-<page>.png : images d'aperçu pour LinkedIn (1200 × 627)
   Usage : node scripts/generer.js   (Playwright doit être installé)
   À relancer après une modification du CV ou d'un titre de page. */
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const racine = path.resolve(__dirname, '..');
const url = f => 'file://' + path.join(racine, f);

/* Une ligne par image : [fichier, sur-titre, titre, sous-titre, illustration, charte] */
const OG = [
  ['fr-accueil', 'Ingénieur Qualité', 'Yassine Kaabar', 'Qualité clients et fournisseurs · lancements produits · SPC', 'spc', ''],
  ['en-accueil', 'Quality Engineer', 'Yassine Kaabar', 'Customer and supplier quality · product launches · SPC', 'spc', ''],
  ['fr-qyklo', 'Système qualité · Qyklo', 'Le cycle qualité, enfin visible', 'ISO 9001 · ISO 13485 · atelier connecté', 'q', 'qyklo'],
  ['en-qyklo', 'Quality system · Qyklo', 'The quality cycle, finally visible', 'ISO 9001 · ISO 13485 · connected shop floor', 'q', 'qyklo'],
  ['fr-spc', 'Production · SPC', 'Voir la dérive avant le client', 'Rendement porté de 89 % à 98 %', 'spc', ''],
  ['en-spc', 'Production · SPC', 'Spot the drift before the customer', 'Yield raised from 89 % to 98 %', 'spc', ''],
  ['fr-scar', 'Fournisseurs · SCAR et 8D', 'Du défaut fournisseur au 8D clos', 'KPI fournisseurs : 1 h → instantané', '8d', ''],
  ['en-scar', 'Suppliers · SCAR and 8D', 'From supplier defect to closed 8D', 'Supplier KPIs: 1 h → instant', '8d', ''],
  ['fr-oqc', 'Expédition · OQC', 'Le bon échantillon, le bon verdict', 'Plan d\'échantillonnage ISO 2859-1', 'oqc', ''],
  ['en-oqc', 'Shipping · OQC', 'The right sample, the right verdict', 'ISO 2859-1 sampling plan', 'oqc', ''],
  ['fr-ecme', 'Métrologie · ECME', 'Un parc de mesure prêt pour l\'audit', 'Échéances d\'étalonnage et planning', 'ecme', ''],
  ['en-ecme', 'Metrology · gauge control', 'A gauge fleet ready for audit', 'Calibration due dates and planning', 'ecme', ''],
  ['fr-gage-rr', 'Système de mesure · Gage R&R', 'Peut-on se fier à la mesure ?', 'MSA type 2 · verdict instantané', 'rr', ''],
  ['en-gage-rr', 'Measurement system · Gage R&R', 'Can you trust the measurement?', 'MSA type 2 · instant verdict', 'rr', '']
];

/* Petites illustrations fixes, dans l'esprit de celles du site */
function dessin(type) {
  const L = '#c0392b', A = '#0f60c4', O = '#a86f0c', G = '#2d7a4c', I = '#141920', F = '#e8ebef';
  if (type === 'q') {
    const seg = (a0) => { const r = 120, c = 160, p = a => [c + r * Math.cos(a * Math.PI / 180), c + r * Math.sin(a * Math.PI / 180)];
      const [x1, y1] = p(a0), [x2, y2] = p(a0 + 76); return `<path d="M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}" fill="none" stroke="#12324a" stroke-width="46"/>`; };
    return `<svg viewBox="0 0 340 340" width="340">${[-128, -38, 52, 142].map(seg).join('')}<line x1="192" y1="192" x2="282" y2="282" stroke="#e4572e" stroke-width="46" stroke-linecap="round"/></svg>`;
  }
  if (type === '8d') {
    const n = 8, x = i => 30 + i * 52;
    return `<svg viewBox="0 0 420 200" width="420"><line x1="30" x2="394" y1="100" y2="100" stroke="${A}" stroke-width="4"/>${Array.from({ length: n }, (_, i) =>
      `<circle cx="${x(i)}" cy="100" r="22" fill="${i === n - 1 ? G : A}"/><text x="${x(i)}" y="106" text-anchor="middle" fill="#fff" font-family="JetBrains Mono" font-size="15" font-weight="600">D${i + 1}</text>`).join('')}</svg>`;
  }
  if (type === 'oqc') {
    const tires = [7, 19, 26, 38, 44, 51, 63, 70, 82, 88, 95, 101, 107, 113, 118, 124, 131, 137, 142, 148]; let s = '';
    for (let k = 0; k < 150; k++) { const t = tires.indexOf(k); s += `<circle cx="${22 + (k % 15) * 26}" cy="${22 + Math.floor(k / 15) * 26}" r="${t >= 0 ? 8 : 6}" fill="${k === 95 ? L : t >= 0 ? A : F}"/>`; }
    return `<svg viewBox="0 0 410 280" width="410">${s}</svg>`;
  }
  if (type === 'ecme') {
    const c = 200, cy = 220, R = 160, p = (a, r) => [c + r * Math.sin(a * Math.PI / 180), cy - r * Math.cos(a * Math.PI / 180)];
    const arc = (a0, a1) => { const [x0, y0] = p(a0, R), [x1, y1] = p(a1, R); return `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`; };
    const [nx, ny] = p(8, R - 24);
    return `<svg viewBox="0 0 400 260" width="400"><path d="${arc(-80, 80)}" fill="none" stroke="${F}" stroke-width="22" stroke-linecap="round"/><path d="${arc(-24, 24)}" fill="none" stroke="${G}" stroke-width="22"/><line x1="${c}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="${I}" stroke-width="5" stroke-linecap="round"/><circle cx="${c}" cy="${cy}" r="11" fill="${I}"/></svg>`;
  }
  if (type === 'rr') {
    const b = [[20, A], [17.7, A], [26.7, O], [96.4, '#8a929f']];
    return `<svg viewBox="0 0 420 240" width="420">${b.map(([v, c], i) => `<rect x="0" y="${20 + i * 56}" width="400" height="20" rx="3" fill="${F}"/><rect x="0" y="${20 + i * 56}" width="${4 * v}" height="20" rx="3" fill="${c}"/>`).join('')}<line x1="40" x2="40" y1="8" y2="200" stroke="${L}" stroke-dasharray="4 5"/><line x1="120" x2="120" y1="8" y2="200" stroke="${L}" stroke-dasharray="4 5"/></svg>`;
  }
  /* carte de contrôle */
  const v = [6.402, 6.396, 6.411, 6.389, 6.405, 6.398, 6.414, 6.392, 6.407, 6.401, 6.395, 6.409, 6.404, 6.416, 6.410, 6.421, 6.415, 6.427, 6.423, 6.434, 6.431, 6.442, 6.451, 6.512];
  const x = i => 10 + i * 17, y = val => 20 + (6.53 - val) / 0.25 * 240;
  return `<svg viewBox="0 0 420 280" width="420">
    <line x1="0" x2="410" y1="${y(6.5)}" y2="${y(6.5)}" stroke="${L}" stroke-width="2" opacity=".6"/><line x1="0" x2="410" y1="${y(6.3)}" y2="${y(6.3)}" stroke="${L}" stroke-width="2" opacity=".6"/>
    <line x1="0" x2="410" y1="${y(6.474)}" y2="${y(6.474)}" stroke="${O}" stroke-width="2" stroke-dasharray="7 7" opacity=".7"/><line x1="0" x2="410" y1="${y(6.359)}" y2="${y(6.359)}" stroke="${O}" stroke-width="2" stroke-dasharray="7 7" opacity=".7"/>
    <path d="M${v.map((val, i) => `${x(i)} ${y(val)}`).join(' L')}" fill="none" stroke="${A}" stroke-width="3.5" stroke-linejoin="round"/>
    ${v.map((val, i) => `<circle cx="${x(i)}" cy="${y(val)}" r="${i === v.length - 1 ? 8 : 5}" fill="${i === v.length - 1 ? L : '#fff'}" stroke="${i === v.length - 1 ? L : A}" stroke-width="3"/>`).join('')}</svg>`;
}

function og([fichier, kicker, titre, sous, type, charte]) {
  const q = charte === 'qyklo';
  const C = q ? { bg: '#f5f7f8', ink: '#12324a', acc: '#0b6e79', grid: 'rgba(18,50,74,.07)', grid2: 'rgba(18,50,74,.11)' }
              : { bg: '#f7f8fa', ink: '#141920', acc: '#0d58b4', grid: 'rgba(15,96,196,.07)', grid2: 'rgba(15,96,196,.12)' };
  const en = fichier.startsWith('en');
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=JetBrains+Mono:wght@500;600&display=block" rel="stylesheet">
<style>
@font-face { font-family: "Archivo"; src: url("${url('assets/qyklo/fonts/Archivo-Bold.woff2')}"); font-weight: 700; }
html,body{margin:0;width:1200px;height:627px;overflow:hidden}
body{background:${C.bg};color:${C.ink};font-family:"Space Grotesk",sans-serif;
 background-image:linear-gradient(${C.grid2} 1px,transparent 1px),linear-gradient(90deg,${C.grid2} 1px,transparent 1px),linear-gradient(${C.grid} 1px,transparent 1px),linear-gradient(90deg,${C.grid} 1px,transparent 1px);
 background-size:40px 40px,40px 40px,8px 8px,8px 8px}
.cadre{position:absolute;inset:28px;border:2px solid ${C.ink}}
.txt{position:absolute;left:84px;top:92px;width:540px}
.k{font:600 22px "JetBrains Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:${C.acc}}
h1{margin:18px 0 0;font-size:${titre.length > 22 ? 54 : 72}px;line-height:1.04;letter-spacing:-.02em;font-weight:600;${q ? 'font-family:Archivo;font-weight:700' : ''}}
.cote{display:flex;align-items:center;gap:14px;margin-top:20px;font:600 18px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:${C.acc};width:480px}
.cote:before,.cote:after{content:"";flex:1;height:14px;border-left:2px solid;border-right:2px solid;background:linear-gradient(currentColor,currentColor) center/100% 2px no-repeat}
p{margin:26px 0 0;font-size:26px;line-height:1.3;color:${q ? '#2e4a5e' : '#3d4653'}}
.art{position:absolute;right:80px;top:50%;transform:translateY(-58%);background:#fff;border:2px solid ${C.ink};padding:24px;display:grid;place-items:center}.art svg{width:${q ? 300 : 360}px;height:auto}
.cart{position:absolute;left:28px;right:28px;bottom:28px;height:66px;display:grid;grid-template-columns:2fr 1fr 1fr;border-top:2px solid ${C.ink};background:#fff}
.cart div{padding:10px 18px;border-left:1px solid #d5dbe3;font-size:20px;font-weight:500}
.cart div:first-child{border-left:0}
.cart span{display:block;font:600 12px "JetBrains Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:#5d6674;margin-bottom:2px}
</style></head><body>
<div class="cadre"></div>
<div class="txt"><div class="k">${kicker}</div><h1>${titre}</h1><div class="cote">${en ? '5+ years' : '5+ ans'} · ISO 13485</div><p>${sous}</p></div>
<div class="art">${dessin(type)}</div>
<div class="cart"><div><span>${en ? 'Title' : 'Titre'}</span>${en ? 'Portfolio · Quality Engineer' : 'Portfolio · Ingénieur Qualité'}</div><div><span>${en ? 'Drawn by' : 'Dessiné par'}</span>Yassine Kaabar</div><div><span>Site</span>ykaabar.github.io</div></div>
</body></html>`;
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1200, height: 627 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  /* CV */
  for (const [src, out] of [['scripts/cv/cv-fr.html', 'assets/cv/Yassine_Kaabar_CV.pdf'], ['scripts/cv/cv-en.html', 'assets/cv/Yassine_Kaabar_CV_EN.pdf']]) {
    await p.goto(url(src), { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(racine, out), format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log('✓', out);
  }
  /* Images d'aperçu */
  fs.mkdirSync(path.join(racine, 'assets/og'), { recursive: true });
  for (const ligne of OG) {
    const tmp = path.join(require('os').tmpdir(), 'og-vitrine.html'); fs.writeFileSync(tmp, og(ligne));
    await p.goto('file://' + tmp, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(racine, `assets/og/${ligne[0]}.png`) });
    console.log('✓', `assets/og/${ligne[0]}.png`);
  }
  await b.close();
})();
