import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARCHETYPES, I18N, SITE_DOMAIN } from './archetype-pages-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_EN = path.join(ROOT, 'public', 'archetype', 'en');
const OUT_ES = path.join(ROOT, 'public', 'archetype', 'es');

fs.mkdirSync(OUT_EN, { recursive: true });
fs.mkdirSync(OUT_ES, { recursive: true });

function statBar(label, value) {
  return `
    <div class="stat-row">
      <span class="stat-label">${label}</span>
      <div class="stat-bar"><div class="stat-fill" style="width:${value}%"></div></div>
      <span class="stat-value">${value}</span>
    </div>`;
}

function abilityCard(typeLabel, name) {
  return `
    <div class="ability-card">
      <div class="ability-type">${typeLabel}</div>
      <div class="ability-name">${name}</div>
    </div>`;
}

function tipItem(i, text) {
  return `
    <div class="tip">
      <div class="tip-num">${i}</div>
      <div class="tip-text">${text}</div>
    </div>`;
}

function otherCard(a, lang) {
  const ldata = a[lang];
  return `
    <a href="${a.slug}.html" class="other-card">
      <span class="other-icon">${a.icon}</span>
      <div>
        <div class="other-name">${a.name}</div>
        <div class="other-title">${ldata.title}</div>
      </div>
    </a>`;
}

function generatePage(archetype, lang) {
  const i18n = I18N[lang];
  const ldata = archetype[lang];
  const canonicalUrl = `${SITE_DOMAIN}/archetype/${lang}/${archetype.slug}.html`;
  const altLang = lang === 'en' ? 'es' : 'en';
  const altUrl = `${SITE_DOMAIN}/archetype/${altLang}/${archetype.slug}.html`;
  const enUrl = lang === 'en' ? canonicalUrl : altUrl;
  const esUrl = lang === 'es' ? canonicalUrl : altUrl;

  const others = ARCHETYPES.filter(a => a.id !== archetype.id).slice(0, 6);
  const statsHtml = Object.entries(archetype.stats)
    .map(([k, v]) => statBar(i18n.statLabels[k], v)).join('');
  const abilitiesHtml = [
    abilityCard(i18n.primaryLabel, ldata.abilities.primary),
    abilityCard(i18n.secondaryLabel, ldata.abilities.secondary),
    abilityCard(i18n.ultimateLabel, ldata.abilities.ultimate),
    abilityCard(i18n.passiveLabel, ldata.abilities.passive),
  ].join('');
  const tagsHtml = archetype.theme.map(t => `<span class="tag">${t}</span>`).join('');
  const tipsHtml = ldata.tips.map((tip, i) => tipItem(i + 1, tip)).join('');
  const otherHtml = others.map(a => otherCard(a, lang)).join('');

  const pageTitle = lang === 'en'
    ? `${archetype.name} Superhero Creator — ${ldata.title} | HeroSculpt`
    : `Creador ${archetype.name} — ${ldata.title} | HeroSculpt`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${ldata.metaDesc}">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="es" href="${esUrl}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${ldata.metaDesc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"WebPage","name":${JSON.stringify(pageTitle)},"description":${JSON.stringify(ldata.metaDesc)},"url":${JSON.stringify(canonicalUrl)}}
  </script>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a0a0f;color:#e2e8f0;font-family:system-ui,-apple-system,sans-serif;line-height:1.6}
    a{color:#d8a23a;text-decoration:none}
    a:hover{text-decoration:underline}
    .container{max-width:860px;margin:0 auto;padding:0 20px}
    nav{background:rgba(10,10,15,0.96);border-bottom:1px solid rgba(216,162,58,0.2);padding:12px 0;position:sticky;top:0;z-index:10}
    .nav-inner{display:flex;justify-content:space-between;align-items:center}
    .logo{font-weight:900;font-size:18px;letter-spacing:2px;color:#d8a23a}
    .nav-link{font-size:12px;letter-spacing:1px;color:#9ca3af}
    .hero{padding:60px 0 40px;text-align:center}
    .hero-icon{font-size:64px;margin-bottom:16px}
    .hero-tag{display:inline-block;font-size:11px;letter-spacing:3px;color:#d8a23a;font-weight:700;margin-bottom:8px}
    h1{font-size:clamp(32px,6vw,56px);font-weight:900;letter-spacing:3px;color:#f8fafc;margin-bottom:8px}
    .hero-subtitle{font-size:14px;letter-spacing:2px;color:#9ca3af;margin-bottom:16px}
    .hero-desc{font-size:16px;color:#cbd5e1;max-width:520px;margin:0 auto 32px}
    .theme-tags{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:40px}
    .tag{background:rgba(216,162,58,0.12);border:1px solid rgba(216,162,58,0.25);color:#d8a23a;font-size:11px;letter-spacing:1.5px;padding:4px 12px;border-radius:20px}
    .section{padding:32px 0;border-top:1px solid rgba(255,255,255,0.06)}
    .section-title{font-size:11px;letter-spacing:3px;color:#6b7280;text-transform:uppercase;margin-bottom:20px}
    .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .stat-row{display:flex;align-items:center;gap:10px}
    .stat-label{width:80px;font-size:11px;letter-spacing:1px;color:#9ca3af}
    .stat-bar{flex:1;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden}
    .stat-fill{height:100%;background:#d8a23a;border-radius:3px}
    .stat-value{width:28px;font-size:11px;color:#9ca3af;text-align:right}
    .abilities-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .ability-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:14px}
    .ability-type{font-size:9px;letter-spacing:2px;color:#6b7280;text-transform:uppercase;margin-bottom:4px}
    .ability-name{font-size:14px;font-weight:700;color:#e2e8f0}
    .examples{font-size:15px;color:#cbd5e1}
    .tips-list{display:flex;flex-direction:column;gap:12px}
    .tip{display:flex;gap:12px;align-items:flex-start}
    .tip-num{width:22px;height:22px;background:rgba(216,162,58,0.15);border:1px solid rgba(216,162,58,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#d8a23a;flex-shrink:0;margin-top:2px}
    .tip-text{font-size:15px;color:#cbd5e1}
    .cta-section{padding:48px 0;text-align:center}
    .cta-btn{display:inline-block;background:#d8a23a;color:#000;font-weight:900;font-size:14px;letter-spacing:2px;padding:14px 36px;border-radius:6px;text-decoration:none;transition:opacity 0.15s}
    .cta-btn:hover{opacity:0.88;text-decoration:none}
    .cta-sub{font-size:12px;color:#6b7280;margin-top:10px}
    .other-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .other-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:12px;display:flex;align-items:center;gap:10px;transition:border-color 0.15s;color:inherit}
    .other-card:hover{border-color:rgba(216,162,58,0.3);text-decoration:none}
    .other-icon{font-size:20px}
    .other-name{font-size:12px;font-weight:700;color:#e2e8f0;letter-spacing:1px}
    .other-title{font-size:10px;color:#6b7280;margin-top:2px}
    footer{border-top:1px solid rgba(255,255,255,0.06);padding:24px 0;text-align:center;font-size:12px;color:#4b5563}
    @media(max-width:600px){.stats-grid,.abilities-grid{grid-template-columns:1fr}.other-grid{grid-template-columns:repeat(2,1fr)}}
  </style>
</head>
<body>
  <nav>
    <div class="container nav-inner">
      <a href="/" class="logo">HEROSCULPT</a>
      <a href="index.html" class="nav-link">← ${lang === 'en' ? 'All Archetypes' : 'Todos los Arquetipos'}</a>
    </div>
  </nav>
  <div class="container">
    <section class="hero">
      <div class="hero-icon">${archetype.icon}</div>
      <div class="hero-tag">${i18n.tag}</div>
      <h1>${archetype.name}</h1>
      <div class="hero-subtitle">${ldata.title.toUpperCase()}</div>
      <p class="hero-desc">${ldata.description}</p>
      <div class="theme-tags">${tagsHtml}</div>
    </section>
    <section class="section">
      <div class="section-title">${i18n.statsLabel}</div>
      <div class="stats-grid">${statsHtml}</div>
    </section>
    <section class="section">
      <div class="section-title">${i18n.abilitiesLabel}</div>
      <div class="abilities-grid">${abilitiesHtml}</div>
    </section>
    <section class="section">
      <div class="section-title">${i18n.examplesLabel}</div>
      <p class="examples">${ldata.examples.join(' · ')}</p>
    </section>
    <section class="section">
      <div class="section-title">${i18n.tipsLabel}</div>
      <div class="tips-list">${tipsHtml}</div>
    </section>
    <section class="cta-section">
      <a href="/?archetype=${archetype.id}" class="cta-btn">${i18n.ctaText(archetype.name)}</a>
      <div class="cta-sub">${i18n.ctaSub}</div>
    </section>
    <section class="section">
      <div class="section-title">${i18n.otherLabel}</div>
      <div class="other-grid">${otherHtml}</div>
    </section>
  </div>
  <footer>
    <div class="container">© ${new Date().getFullYear()} HeroSculpt · ${i18n.footerText} · <a href="${altUrl}">${i18n.altLangText}</a></div>
  </footer>
</body>
</html>`;
}

function generateIndex(lang) {
  const i18n = I18N[lang];
  const title = lang === 'en'
    ? 'All Superhero Archetypes — HeroSculpt Character Creator'
    : 'Todos los Arquetipos de Superhéroes — HeroSculpt';
  const desc = lang === 'en'
    ? 'Explore all 19 superhero archetypes in HeroSculpt. From powerhouse bruisers to mystic sorcerers — pick your archetype and build your hero in 3D for free.'
    : 'Explora los 19 arquetipos de superhéroes en HeroSculpt. Desde colosos hasta hechiceros — elige tu arquetipo y construye tu héroe en 3D gratis.';

  const cardsHtml = ARCHETYPES.map(a => {
    const ldata = a[lang];
    return `
    <a href="${a.slug}.html" class="index-card">
      <div class="index-icon">${a.icon}</div>
      <div class="index-name">${a.name}</div>
      <div class="index-title">${ldata.title}</div>
      <div class="index-theme">${a.theme.join(' · ')}</div>
    </a>`;
  }).join('');

  const altLang = lang === 'en' ? 'es' : 'en';
  const altUrl = `${SITE_DOMAIN}/archetype/${altLang}/index.html`;
  const canonicalUrl = `${SITE_DOMAIN}/archetype/${lang}/index.html`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="alternate" hreflang="en" href="${SITE_DOMAIN}/archetype/en/index.html">
  <link rel="alternate" hreflang="es" href="${SITE_DOMAIN}/archetype/es/index.html">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a0a0f;color:#e2e8f0;font-family:system-ui,-apple-system,sans-serif;line-height:1.6}
    a{color:#d8a23a;text-decoration:none}
    .container{max-width:960px;margin:0 auto;padding:0 20px}
    nav{background:rgba(10,10,15,0.96);border-bottom:1px solid rgba(216,162,58,0.2);padding:12px 0;position:sticky;top:0;z-index:10}
    .nav-inner{display:flex;justify-content:space-between;align-items:center}
    .logo{font-weight:900;font-size:18px;letter-spacing:2px;color:#d8a23a}
    .nav-link{font-size:12px;letter-spacing:1px;color:#9ca3af}
    .page-hero{padding:60px 0 40px;text-align:center}
    h1{font-size:clamp(28px,5vw,48px);font-weight:900;letter-spacing:2px;color:#f8fafc;margin-bottom:12px}
    .page-desc{font-size:16px;color:#9ca3af;max-width:560px;margin:0 auto 48px}
    .index-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;padding-bottom:60px}
    .index-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 16px;text-align:center;transition:border-color 0.15s,background 0.15s;display:block}
    .index-card:hover{border-color:rgba(216,162,58,0.35);background:rgba(216,162,58,0.05);text-decoration:none}
    .index-icon{font-size:36px;margin-bottom:10px}
    .index-name{font-size:13px;font-weight:900;letter-spacing:1.5px;color:#f8fafc;margin-bottom:4px}
    .index-title{font-size:10px;color:#d8a23a;margin-bottom:6px}
    .index-theme{font-size:9px;color:#6b7280;letter-spacing:0.5px}
    footer{border-top:1px solid rgba(255,255,255,0.06);padding:24px 0;text-align:center;font-size:12px;color:#4b5563}
    @media(max-width:500px){.index-grid{grid-template-columns:repeat(2,1fr)}}
  </style>
</head>
<body>
  <nav>
    <div class="container nav-inner">
      <a href="/" class="logo">HEROSCULPT</a>
      <a href="${altUrl}" class="nav-link">${i18n.altLangText}</a>
    </div>
  </nav>
  <div class="container">
    <section class="page-hero">
      <h1>${lang === 'en' ? 'All Archetypes' : 'Todos los Arquetipos'}</h1>
      <p class="page-desc">${desc}</p>
    </section>
    <div class="index-grid">${cardsHtml}</div>
  </div>
  <footer>
    <div class="container">© ${new Date().getFullYear()} HeroSculpt · <a href="${altUrl}">${i18n.altLangText}</a></div>
  </footer>
</body>
</html>`;
}

// Generate all pages
let count = 0;
for (const lang of ['en', 'es']) {
  const outDir = lang === 'en' ? OUT_EN : OUT_ES;

  // Index page
  fs.writeFileSync(path.join(outDir, 'index.html'), generateIndex(lang), 'utf8');
  count++;

  // Archetype pages
  for (const archetype of ARCHETYPES) {
    fs.writeFileSync(
      path.join(outDir, `${archetype.slug}.html`),
      generatePage(archetype, lang),
      'utf8'
    );
    count++;
  }
}

console.log(`✓ Generated ${count} pages in public/archetype/`);
