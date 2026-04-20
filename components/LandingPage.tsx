import React, { useState } from 'react';

interface LandingPageProps {
  onEnter: (archetypeId?: string) => void;
}

const C = {
  surface: '#0c0e12',
  surfaceCLL: '#000000',
  surfaceCL: '#111318',
  surfaceC: '#171a1f',
  surfaceCH: '#1d2025',
  surfaceCHH: '#23262c',
  onSurface: '#f6f6fc',
  onSurfaceV: '#aaabb0',
  primary: '#ff9063',
  primaryDim: '#ff7437',
  primaryC: '#ff793f',
  onPrimary: '#571b00',
  onPrimaryFixed: '#000000',
  secondary: '#00e3fd',
  secondaryC: '#006875',
  secondaryFixed: '#26e6ff',
  onSecondary: '#004d57',
  tertiary: '#ffe792',
  error: '#ff716c',
  outline: '#74757a',
  outlineV: '#46484d',
};

const ARCHETYPES = [
  { id: 'STRONG',     label: 'SENTINEL', abbr: '',   color: '#ff9063', img: true },
  { id: 'JUSTICIERO', label: 'PHANTOM',  abbr: 'PH', color: '#00e3fd', img: false },
  { id: 'MYSTIC',     label: 'ARCANE',   abbr: 'AR', color: '#ffe792', img: false },
  { id: 'PARAGON',    label: 'TITAN',    abbr: 'TT', color: '#ff716c', img: false },
  { id: 'SPEEDSTER',  label: 'BLITZ',    abbr: 'BL', color: '#a855f7', img: false },
  { id: 'TECH',       label: 'GHOST',    abbr: 'GH', color: '#26e6ff', img: false },
];

const NAV_LINKS = ['Gallery', 'Creator', 'Community', 'Marketplace'];

const HUD_STATS = [
  { label: 'Power Output',     value: 94 },
  { label: 'Agility Vector',   value: 82 },
  { label: 'Durability Matrix', value: 68 },
];

const FEATURES_3 = ['devices', 'cloud_sync', 'videogame_asset'];

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [hoveredArch, setHoveredArch] = useState<string | null>(null);

  return (
    <div style={{ backgroundColor: C.surface, color: C.onSurface, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        .ms { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; display: inline-block; }
        .hl { font-family: 'Space Grotesk', sans-serif; }
        .bd { font-family: 'Inter', sans-serif; }
        .glow-p { text-shadow: 0 0 15px rgba(255,144,99,0.4), 0 0 30px rgba(255,144,99,0.2); }
        .glow-s { text-shadow: 0 0 10px rgba(0,227,253,0.5); }
        .obsidian { background: linear-gradient(145deg, rgba(23,26,31,0.9), rgba(12,14,18,0.95)); backdrop-filter: blur(12px); }

        @keyframes lp-bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-8px); } }
        @keyframes lp-spin-fwd  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes lp-spin-back { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
        @keyframes lp-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

        .lp-bounce  { animation: lp-bounce  1.0s ease-in-out infinite; }
        .lp-spin-fwd  { animation: lp-spin-fwd  20s linear infinite; }
        .lp-spin-back { animation: lp-spin-back 10s linear infinite; }
        .lp-pulse   { animation: lp-pulse   2s ease-in-out infinite; }

        .lp-arch-img { filter: grayscale(1); opacity: 0.4; transform: scale(1.1); transition: all 0.5s; }
        .lp-arch-card:hover .lp-arch-img { filter: grayscale(0); opacity: 1; transform: scale(1); }
        .lp-arch-bar { width: 0; height: 2px; margin: 0 auto; transition: width 0.3s; }
        .lp-arch-card:hover .lp-arch-bar { width: 50%; }

        .lp-feat-img { filter: grayscale(1); opacity: 0.6; transition: all 0.7s; }
        .lp-feat-wrap:hover .lp-feat-img { filter: grayscale(0); }
        .lp-feat-icon { opacity: 0.2; transition: opacity 0.3s; }
        .lp-feat-wrap:hover .lp-feat-icon { opacity: 1; }

        .lp-btn-pri {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, ${C.primary}, ${C.primaryC});
          color: ${C.onPrimaryFixed};
          font-family: 'Space Grotesk', sans-serif; font-weight: 900;
          letter-spacing: -0.04em; text-transform: uppercase;
          transition: transform 0.2s; cursor: pointer; border: none;
        }
        .lp-btn-pri:hover { transform: scale(1.05); }
        .lp-btn-pri:active { transform: scale(0.95); }
        .lp-btn-pri .glow-layer { position:absolute; inset:0; background:${C.secondary}; filter:blur(20px); opacity:0; transition:opacity 0.3s; }
        .lp-btn-pri:hover .glow-layer { opacity: 0.3; }

        .lp-btn-sec {
          border: 1px solid rgba(0,227,253,0.3); color: ${C.secondary};
          font-family: 'Space Grotesk', sans-serif; font-weight: 900;
          letter-spacing: -0.04em; text-transform: uppercase;
          background: transparent; cursor: pointer; transition: background 0.2s;
          display: flex; align-items: center; gap: 12px;
        }
        .lp-btn-sec:hover { background: rgba(0,227,253,0.1); }

        .lp-cta-btn {
          position: relative; overflow: hidden;
          background: ${C.primary}; color: ${C.onPrimary};
          font-family: 'Space Grotesk', sans-serif; font-weight: 900;
          font-size: 1.5rem; letter-spacing: -0.04em; text-transform: uppercase;
          border: none; cursor: pointer; transition: transform 0.3s;
        }
        .lp-cta-btn:hover { transform: scale(1.1); }
        .lp-cta-btn:active { transform: scale(0.95); }
        .lp-cta-btn .glow-layer { position:absolute; inset:-4px; background:${C.primary}; filter:blur(20px); opacity:0; transition:opacity 0.3s; }
        .lp-cta-btn:hover .glow-layer { opacity: 0.4; }

        .lp-dna-btn {
          width: 100%; font-family: 'Space Grotesk', sans-serif; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.2em; font-size: 11px;
          background: rgba(0,227,253,0.1); color: ${C.secondary};
          border: 1px solid rgba(0,227,253,0.3); cursor: pointer;
          padding: 12px 0; transition: background 0.2s;
        }
        .lp-dna-btn:hover { background: rgba(0,227,253,0.2); }

        .lp-nav-link {
          font-family: 'Space Grotesk', sans-serif; font-weight: 500;
          letter-spacing: -0.02em; text-transform: uppercase;
          text-decoration: none; transition: color 0.2s; cursor: pointer;
        }
        .lp-nav-link:hover { color: ${C.onSurface}; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, backgroundColor: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(255,94,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', height: 80 }}>
          <div className="hl" style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.05em', textTransform: 'uppercase', color: C.onSurface }}>
            HEROSCULPT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            {NAV_LINKS.map((item, i) => (
              <a key={item} className="lp-nav-link" style={{ color: i === 0 ? C.primary : C.onSurfaceV, borderBottom: i === 0 ? `2px solid ${C.primaryDim}` : 'none', paddingBottom: i === 0 ? 4 : 0 }}>
                {item}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <button onClick={() => onEnter()} className="lp-btn-pri" style={{ padding: '10px 24px', fontSize: 14 }}>
              <div className="glow-layer" />
              <span style={{ position: 'relative', zIndex: 1 }}>Start Creating</span>
            </button>
            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: `1px solid ${C.outlineV}`, backgroundColor: C.surfaceCHH }}>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxIY8feiUxlkU3U-JpHBsu8KcaCsp9VIIUYe1K4ytPsjk1vltaFlervYq9qfKh8dDTwBsv-m9HkOI9nOlRgZCvcAui8lKUpE1R5ucjgb6gQioDYjdbXmS8_2wP6op127ZLjR8SBZ4WJbAKh59XoSB1VJl7avhzyFWxyCoMMMq2NG7_LTZ_laPx-v1pYeiObeE6uoja7cOK_lvT519-gWk1LgJ0zsJJzD63taBSFVrSlH0Gg7FKpaNM-kMIQcKJbxYz94zo5gkus_c"
                   alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzW3Rv2NfbKb3i_Eyqki7aFRik5IwsiZfgjJ3oY2118TF4vLfYpcvtF9C6m27V9MM6c6S5WYgfAoqsHrb--W1NN0oi8JkqlJ9G7ybMivxsexAQ8u-YigIy3wdRaa5qg5WmzwY36eCxvVUxqSAygGoitSf6qNYgwMUuun38u3AG2TedeIG4E1Hf4kWaUz_w7hAx3_xArrrHUYRLkW-lw88jDUr3JXWlG_c7EITu7RxvtHr2hwOQXE3NBrUp-zHaNNwa9byvgQ-Ux1A"
               alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${C.surface}, transparent, rgba(12,14,18,0.4))` }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(12,14,18,0.8), transparent, rgba(12,14,18,0.8))' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 16px' }}>
          <h1 className="hl glow-p" style={{ fontSize: 'clamp(80px,12vw,192px)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.8, color: C.onSurface, marginBottom: 16, opacity: 0.9, fontStyle: 'italic' }}>
            HEROSCULPT
          </h1>
          <p className="hl" style={{ fontSize: 'clamp(14px,2vw,24px)', fontWeight: 700, letterSpacing: '0.5em', color: C.primary, marginBottom: 48, textTransform: 'uppercase' }}>
            3D SUPERHERO CHARACTER CREATOR
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => onEnter()} className="lp-btn-pri" style={{ padding: '16px 40px', fontSize: 20 }}>
              <div className="glow-layer" />
              <span style={{ position: 'relative', zIndex: 1 }}>INITIALIZE FORGE</span>
            </button>
            <button className="lp-btn-sec" style={{ padding: '16px 40px', fontSize: 20 }}>
              <span className="ms">play_arrow</span>
              WATCH TRAILER
            </button>
          </div>
        </div>
        <div className="lp-bounce" style={{ position: 'absolute', bottom: 48, left: '50%', color: C.outline }}>
          <span className="ms" style={{ fontSize: 32 }}>keyboard_double_arrow_down</span>
        </div>
      </section>

      {/* ── HERO LINEUP + HUD ── */}
      <section style={{ position: 'relative', padding: '128px 0', backgroundColor: C.surfaceCLL }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 48, alignItems: 'center' }}>
          {/* Image */}
          <div style={{ gridColumn: 'span 8', position: 'relative', overflow: 'hidden', borderRadius: 4, boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: `1px solid rgba(70,72,77,0.1)` }}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCliQZ4ExSJ8Ldu_Wju7VMbpJN914EMD3BklIZRP-_qwQfV-rTM-Mhr0R8FAqkBN6dqfDs92mwWIdxOd-YCC7OR56pjLKG7ZU4LeQv4CU9jWHhppFY7rdClAVzNy8jgQ_D7yzP-GV8m66JPH07JfW9CUJ1TWe9Cm58CcisNj6H_ywhvfm-SKbfNzFGJFp4BR5dMfeR4Aw72_92hfXlMsMesXzYT-nRTWIzfwI2qjOFw6VnbaGM4plC0vvFFlFk_3PCQ6SVuwotEun0"
                 alt="Hero Lineup" style={{ width: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.8), transparent)` }} />
          </div>
          {/* HUD */}
          <div style={{ gridColumn: 'span 4' }}>
            <div className="obsidian" style={{ padding: 32, borderRadius: 2, borderLeft: `4px solid ${C.secondary}`, boxShadow: `inset 0 0 1px 0 rgba(0,227,253,0.3)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
                <div>
                  <span className="hl" style={{ fontSize: 10, letterSpacing: '0.3em', color: C.secondary, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Subject: ALPHA_01</span>
                  <h2 className="hl glow-s" style={{ fontSize: 36, fontWeight: 700, color: C.onSurface, textTransform: 'uppercase', letterSpacing: '-0.04em', margin: 0 }}>STRIKER</h2>
                </div>
                <span className="glow-s" style={{ color: C.secondary, fontFamily: 'monospace', fontSize: 20 }}>ACTIVE</span>
              </div>
              {HUD_STATS.map(s => (
                <div key={s.label} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '-0.01em', textTransform: 'uppercase', color: C.onSurfaceV, marginBottom: 8 }}>
                    <span>{s.label}</span>
                    <span style={{ color: C.secondary }}>{s.value}%</span>
                  </div>
                  <div style={{ height: 4, backgroundColor: C.surfaceCHH, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.value}%`, background: `linear-gradient(to right, ${C.secondaryC}, ${C.secondary})` }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid rgba(70,72,77,0.2)` }}>
                <p className="bd" style={{ color: C.onSurfaceV, fontSize: 14, lineHeight: 1.6, marginBottom: 24, fontStyle: 'italic', fontWeight: 300 }}>
                  Optimized for high-velocity engagement and kinetic energy absorption. Chassis reinforced with graphene-titanium composite.
                </p>
                <button onClick={() => onEnter()} className="lp-dna-btn">View Full DNA Profile</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE TECH ── */}
      <section style={{ padding: '128px 32px', backgroundColor: C.surface }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 64 }}>
            <h2 className="hl" style={{ fontSize: 'clamp(40px,6vw,60px)', fontWeight: 900, color: C.onSurface, textTransform: 'uppercase', letterSpacing: '-0.04em', fontStyle: 'italic', margin: 0 }}>CORE TECH</h2>
            <div style={{ height: 1, flexGrow: 1, backgroundColor: 'rgba(70,72,77,0.3)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {/* Feature 1 — spans 2 cols */}
            <div className="lp-feat-wrap" style={{ gridColumn: 'span 2', position: 'relative', height: 500, overflow: 'hidden', backgroundColor: C.surfaceCH, border: `1px solid rgba(70,72,77,0.2)` }}>
              <img className="lp-feat-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvQOSrVROtq5wFh27YBkjqpGWjvHhl-Q05ScoJkoCeTamc8CsnRQYQJGnd8Wy1epF1oeISdYVELdJlbWgn96-rYxTei2myTu_gzvmYk6H2lKqkgquK5g3H8YMucACZjQFANVlXyzSFoLww3W4ClHsUWoz4oe0HmkUjmZC0pqNZvZkT49ij7ZuEStLqis_Zbyo2-RhWK6AN_aVsl5TdU7_fTpgSuzj2IlZKi1pqKya8xc9ik6o83sNlxBVZ0Iwr2ziknJVNd9COPqw"
                   alt="Modular Armor" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${C.surface}, transparent)` }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 40 }}>
                <span className="hl" style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: C.primary, color: C.onPrimary, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 16 }}>Module_01</span>
                <h3 className="hl" style={{ fontSize: 36, fontWeight: 700, color: C.onSurface, textTransform: 'uppercase', marginBottom: 8 }}>Modular Armor Forge</h3>
                <p className="bd" style={{ color: C.onSurfaceV, maxWidth: 448 }}>Thousands of interlocking plates and biological components to sculpt your ultimate defender.</p>
              </div>
              <div className="lp-feat-icon" style={{ position: 'absolute', top: 0, right: 0, padding: 24 }}>
                <span className="ms" style={{ fontSize: 64, color: C.primary }}>architecture</span>
              </div>
            </div>
            {/* Feature 2 */}
            <div style={{ position: 'relative', height: 500, overflow: 'hidden', backgroundColor: C.surfaceCH, border: `1px solid rgba(70,72,77,0.2)` }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,104,117,0.2), transparent)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                <div className="lp-spin-fwd" style={{ width: '100%', aspectRatio: '1/1', border: '2px solid rgba(0,227,253,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="lp-spin-back" style={{ width: '75%', aspectRatio: '1/1', border: '1px solid rgba(0,227,253,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="ms glow-s" style={{ fontSize: 72, color: C.secondary }}>bar_chart</span>
                  </div>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 40, width: '100%', background: `linear-gradient(to top, ${C.surface}, transparent)` }}>
                <h3 className="hl" style={{ fontSize: 24, fontWeight: 700, color: C.onSurface, textTransform: 'uppercase', marginBottom: 8 }}>Holographic HUD Stats</h3>
                <p className="bd" style={{ color: C.onSurfaceV, fontSize: 14 }}>Real-time performance analytics for every component choice you make.</p>
              </div>
            </div>
            {/* Feature 3 — full width */}
            <div style={{ gridColumn: 'span 3', position: 'relative', height: 300, overflow: 'hidden', backgroundColor: C.surfaceC, border: `1px solid rgba(70,72,77,0.2)`, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 64px', gap: 32, flexWrap: 'wrap' }}>
                <div>
                  <h3 className="hl" style={{ fontSize: 36, fontWeight: 700, color: C.onSurface, textTransform: 'uppercase', marginBottom: 8 }}>Cross-Platform Sync</h3>
                  <p className="bd" style={{ color: C.onSurfaceV }}>Deploy your creations instantly to any game engine or metaverse environment.</p>
                </div>
                <div style={{ display: 'flex', gap: 48, color: C.outlineV }}>
                  {FEATURES_3.map(icon => <span key={icon} className="ms" style={{ fontSize: 64 }}>{icon}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCHETYPES ── */}
      <section style={{ padding: '128px 0', backgroundColor: C.surfaceCL, overflow: 'hidden' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 96 }}>
            <span className="hl" style={{ fontSize: 14, letterSpacing: '0.8em', color: C.tertiary, textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>Select your Origin</span>
            <h2 className="hl" style={{ fontSize: 'clamp(48px,7vw,72px)', fontWeight: 900, color: C.onSurface, textTransform: 'uppercase', letterSpacing: '-0.04em', margin: 0 }}>THE ARCHETYPES</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 }}>
            {ARCHETYPES.map(arch => (
              <div key={arch.id} className="lp-arch-card" style={{ cursor: 'pointer' }}
                   onClick={() => onEnter(arch.id)}
                   onMouseEnter={() => setHoveredArch(arch.id)}
                   onMouseLeave={() => setHoveredArch(null)}>
                <div style={{ position: 'relative', aspectRatio: '3/4', marginBottom: 16, overflow: 'hidden', backgroundColor: C.surfaceCHH, border: `1px solid ${hoveredArch === arch.id ? arch.color + '80' : 'rgba(70,72,77,0.1)'}`, transition: 'border-color 0.3s' }}>
                  {arch.img ? (
                    <img className="lp-arch-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtAplE8CI4lsy_2YmSK7QOIntXlh2E70BrYWM-tz7-5LU-Q6PwCX8RC5OtTylaaE884ZkRdFtjDtaBWzb0F_1fzakM4M3RpXfvUov1_wm1m6Ilypn5WXa_HDQlUajZlOwRuDm_pvCVjOcs3MClnTS9yuXq_R1aNoBekaCkiobOjI7jcLOntizb_xMTBOHq2cCes-mhbPTUX6kqdmx_cEjVdTsHd4l1QC_ORC-wX19gmsUTSwLrv_B3TkCEmCUh6YOkXCtKFiDyP_4"
                         alt={arch.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="hl" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, fontWeight: 900, color: arch.color, opacity: 0.1, userSelect: 'none' }}>
                      {arch.abbr}
                    </span>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${arch.color}4d, transparent)`, opacity: hoveredArch === arch.id ? 1 : 0, transition: 'opacity 0.3s' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 className="hl" style={{ fontSize: 20, fontWeight: 700, color: hoveredArch === arch.id ? arch.color : C.onSurfaceV, transition: 'color 0.3s', margin: '0 0 4px' }}>
                    {arch.label}
                  </h4>
                  <div className="lp-arch-bar" style={{ backgroundColor: arch.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', padding: '192px 0', backgroundColor: '#000', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, rgba(255,144,99,0.2), transparent)` }} />
          {[
            { top: '25%',  left: '25%' },
            { top: '66%',  right: '33%' },
            { bottom: '25%', left: '50%' },
            { top: '50%',  right: '25%' },
          ].map((pos, i) => (
            <div key={i} className="lp-pulse" style={{ position: 'absolute', width: i === 1 ? 8 : i === 2 ? 6 : 4, height: i === 1 ? 8 : i === 2 ? 6 : 4, backgroundColor: C.primary, borderRadius: '50%', filter: 'blur(1px)', animationDelay: `${i * 75}ms`, ...pos }} />
          ))}
        </div>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '56rem', margin: '0 auto', textAlign: 'center', padding: '0 32px' }}>
          <h2 className="hl" style={{ fontSize: 'clamp(56px,9vw,96px)', fontWeight: 900, color: C.onSurface, textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: 1, marginBottom: 32 }}>
            THE FORGE IS{' '}
            <span className="glow-p" style={{ color: C.primary, fontStyle: 'italic' }}>WAITING</span>
          </h2>
          <p className="bd" style={{ color: C.onSurfaceV, fontSize: 'clamp(16px,2vw,22px)', maxWidth: '36rem', margin: '0 auto 48px', fontWeight: 300 }}>
            The world needs new protectors. Access the most powerful character creation suite ever forged.
          </p>
          <button onClick={() => onEnter()} className="lp-cta-btn" style={{ padding: '24px 64px' }}>
            <div className="glow-layer" />
            <span style={{ position: 'relative', zIndex: 1 }}>START CREATING</span>
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: '#09090b', borderTop: '1px solid #18181b', padding: '48px 0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '0 48px', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.onSurface }}>
            <span className="hl" style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>HEROSCULPT</span>
            <span style={{ width: 1, height: 16, backgroundColor: '#27272a' }} />
            <span className="bd" style={{ color: '#71717a', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Cinematic Tectonics Protocol Active</span>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Terms of Service', 'Privacy Policy', 'Cookie Settings', 'Support'].map(link => (
              <a key={link} href="#" className="bd" style={{ color: '#71717a', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}>{link}</a>
            ))}
          </div>
          <div className="bd" style={{ color: '#71717a', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            © 2026 HEROSCULPT. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
