import React, { useEffect, useRef, useState } from 'react';

interface LandingPageProps {
  onEnter: (archetypeId?: string) => void;
}

const ARCHETYPES = [
  {
    id: 'STRONG',
    name: 'STRONG',
    title: 'THE POWERHOUSE',
    tagline: 'Raw strength. Unbreakable defense.',
    icon: '💪',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.6)',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #1c0a04 100%)',
    border: '#f97316',
    examples: 'Superman · Hulk · Thor',
    stat: 95,
    statLabel: 'POWER',
  },
  {
    id: 'JUSTICIERO',
    name: 'GUARDIAN',
    title: 'THE PROTECTOR',
    tagline: 'Justice and protection for all.',
    icon: '⚖️',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.6)',
    gradient: 'linear-gradient(135deg, #0c1d3b 0%, #030f1f 100%)',
    border: '#06b6d4',
    examples: 'Captain America · Black Panther',
    stat: 90,
    statLabel: 'DEFENSE',
  },
  {
    id: 'SPEEDSTER',
    name: 'SPEEDSTER',
    title: 'THE FLASH',
    tagline: 'Lightning speed and hyper-reflexes.',
    icon: '⚡',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.6)',
    gradient: 'linear-gradient(135deg, #1c1400 0%, #0a0900 100%)',
    border: '#fbbf24',
    examples: 'Flash · Quicksilver · Sonic',
    stat: 98,
    statLabel: 'SPEED',
  },
  {
    id: 'MYSTIC',
    name: 'MYSTIC',
    title: 'THE SORCERER',
    tagline: 'Ancient magic and mystical power.',
    icon: '🔮',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.6)',
    gradient: 'linear-gradient(135deg, #1a0533 0%, #080212 100%)',
    border: '#a855f7',
    examples: 'Doctor Strange · Scarlet Witch',
    stat: 95,
    statLabel: 'ENERGY',
  },
  {
    id: 'TECH',
    name: 'TECH',
    title: 'THE INVENTOR',
    tagline: 'Advanced technology and pure genius.',
    icon: '🤖',
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.6)',
    gradient: 'linear-gradient(135deg, #001c2a 0%, #000c12 100%)',
    border: '#22d3ee',
    examples: 'Iron Man · Batman · Mr. Fantastic',
    stat: 98,
    statLabel: 'INTEL',
  },
  {
    id: 'PARAGON',
    name: 'PARAGON',
    title: 'THE PERFECT HERO',
    tagline: 'The ultimate balanced champion.',
    icon: '🦸',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.6)',
    gradient: 'linear-gradient(135deg, #2d0505 0%, #0f0505 100%)',
    border: '#ef4444',
    examples: 'Superman · Captain Marvel',
    stat: 90,
    statLabel: 'ALL',
  },
];

const FEATURES = [
  {
    icon: '⚙️',
    title: '300+ MODULAR PARTS',
    desc: 'Mix and match heads, torsos, arms, legs, capes, symbols and more. Every combination is unique.',
    color: '#f97316',
  },
  {
    icon: '🎨',
    title: 'FULL MATERIAL CONTROL',
    desc: 'PBR materials, metallic finishes, custom colors and textures. Make it yours down to the last pixel.',
    color: '#a855f7',
  },
  {
    icon: '📦',
    title: 'EXPORT ANYWHERE',
    desc: 'GLB/GLTF for games and metaverses, STL for 3D printing, PNG tokens for Foundry VTT and Roll20.',
    color: '#22d3ee',
  },
  {
    icon: '📜',
    title: 'RPG CHARACTER SHEET',
    desc: 'Auto-generated stats compatible with Mutants & Masterminds. Ready for your next campaign.',
    color: '#fbbf24',
  },
];

const STATS = [
  { value: '300+', label: 'PARTS' },
  { value: '15+', label: 'ARCHETYPES' },
  { value: '3', label: 'EXPORT FORMATS' },
  { value: 'FREE', label: 'TO START' },
];

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [hoveredArchetype, setHoveredArchetype] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    const colors = ['#f97316', '#fbbf24', '#06b6d4', '#a855f7', '#22d3ee'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#04040a',
      overflowY: 'auto',
      fontFamily: "'Black Ops One', 'RefrigeratorDeluxeHeavy', cursive",
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.6s ease',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap');
        @keyframes hs-pulse-glow {
          0%, 100% { text-shadow: 0 0 30px rgba(249,115,22,0.8), 0 0 60px rgba(249,115,22,0.4); }
          50% { text-shadow: 0 0 60px rgba(249,115,22,1), 0 0 120px rgba(249,115,22,0.6); }
        }
        @keyframes hs-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes hs-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes hs-border-glow {
          0%, 100% { box-shadow: 0 0 10px var(--glow), inset 0 0 10px var(--glow); }
          50% { box-shadow: 0 0 30px var(--glow), inset 0 0 20px var(--glow); }
        }
        @keyframes hs-fadeup {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hs-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hs-cta-primary {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: 2px solid #f97316;
          color: #fff;
          padding: 18px 48px;
          font-size: 20px;
          letter-spacing: 3px;
          cursor: pointer;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          transition: all 0.2s ease;
          text-transform: uppercase;
          font-family: inherit;
        }
        .hs-cta-primary:hover {
          background: linear-gradient(135deg, #fb923c, #f97316);
          box-shadow: 0 0 40px rgba(249,115,22,0.7);
          transform: scale(1.04);
        }
        .hs-cta-secondary {
          background: transparent;
          border: 2px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.7);
          padding: 18px 40px;
          font-size: 18px;
          letter-spacing: 3px;
          cursor: pointer;
          clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
          transition: all 0.2s ease;
          text-transform: uppercase;
          font-family: inherit;
        }
        .hs-cta-secondary:hover {
          border-color: rgba(255,255,255,0.6);
          color: #fff;
          box-shadow: 0 0 20px rgba(255,255,255,0.15);
        }
        .hs-archetype-card {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          cursor: pointer;
          transition: all 0.25s ease;
          overflow: hidden;
          clip-path: polygon(16px 0%, 100% 0%, calc(100% - 16px) 100%, 0% 100%);
        }
        .hs-archetype-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--card-hover-border);
          box-shadow: 0 20px 60px var(--card-glow);
        }
        .hs-feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 32px 28px;
          transition: all 0.25s ease;
        }
        .hs-feature-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-4px);
        }
        .hs-stat-bar {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 6px;
        }
        .hs-stat-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.8s ease;
        }
      `}</style>

      {/* Particles */}
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      {/* Scan line */}
      <div style={{
        position: 'fixed', left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.4), transparent)',
        animation: 'hs-scan 6s linear infinite',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* ═══ HERO SECTION ═══ */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        zIndex: 2,
      }}>
        {/* Background radial glow */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div style={{
          background: 'rgba(249,115,22,0.15)',
          border: '1px solid rgba(249,115,22,0.4)',
          color: '#f97316',
          padding: '6px 20px',
          fontSize: 11,
          letterSpacing: 4,
          marginBottom: 32,
          animation: 'hs-fadeup 0.6s ease both',
        }}>
          THE ULTIMATE 3D SUPERHERO CREATOR
        </div>

        {/* Main title */}
        <h1 style={{
          fontSize: 'clamp(64px, 12vw, 140px)',
          color: '#2a3a5a',
          margin: '0 0 8px',
          textAlign: 'center',
          letterSpacing: '8px',
          lineHeight: 0.9,
          WebkitTextStroke: '2px #f97316',
          textShadow: '0 0 40px rgba(249,115,22,0.7), 4px 4px 0px #111, 2px 2px 0px #1a2a4a',
          animation: 'hs-pulse-glow 3s ease-in-out infinite, hs-fadeup 0.7s ease both',
        }}>
          HERO
        </h1>
        <h1 style={{
          fontSize: 'clamp(64px, 12vw, 140px)',
          background: 'linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #f97316 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 24px',
          textAlign: 'center',
          letterSpacing: '8px',
          lineHeight: 0.9,
          animation: 'hs-shimmer 3s linear infinite, hs-fadeup 0.8s ease both',
        }}>
          SCULPT
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center',
          maxWidth: 560,
          lineHeight: 1.5,
          marginBottom: 48,
          fontFamily: "'Black Ops One', cursive",
          letterSpacing: 2,
          animation: 'hs-fadeup 0.9s ease both',
        }}>
          FORGE YOUR LEGEND IN REAL-TIME 3D.<br />
          300+ PARTS · 15 ARCHETYPES · FULL MATERIAL CONTROL.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center',
          animation: 'hs-fadeup 1s ease both',
          marginBottom: 80,
        }}>
          <button className="hs-cta-primary" onClick={() => onEnter()}>
            BUILD YOUR HERO FREE →
          </button>
          <button className="hs-cta-secondary" onClick={() => {
            document.getElementById('hs-archetypes')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            EXPLORE ARCHETYPES
          </button>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'flex', gap: 0, flexWrap: 'wrap', justifyContent: 'center',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          width: '100%', maxWidth: 700,
          animation: 'hs-fadeup 1.1s ease both',
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              flex: '1 1 150px', textAlign: 'center',
              padding: '20px 16px',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: '#f97316', letterSpacing: 2 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: 3,
          animation: 'hs-float 2s ease-in-out infinite',
          cursor: 'pointer',
        }} onClick={() => document.getElementById('hs-archetypes')?.scrollIntoView({ behavior: 'smooth' })}>
          SCROLL
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(249,115,22,0.6), transparent)' }} />
        </div>
      </section>

      {/* ═══ ARCHETYPES SECTION ═══ */}
      <section id="hs-archetypes" style={{
        position: 'relative', zIndex: 2,
        padding: 'clamp(60px, 8vw, 120px) clamp(16px, 4vw, 80px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 11, letterSpacing: 5, color: '#f97316', marginBottom: 16 }}>
            — CHOOSE YOUR PATH —
          </div>
          <h2 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            color: '#fff',
            letterSpacing: 6,
            margin: 0,
          }}>
            ARCHETYPES
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, letterSpacing: 2, marginTop: 16 }}>
            EVERY HERO HAS AN ORIGIN. WHICH ONE IS YOURS?
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {ARCHETYPES.map(arch => (
            <div
              key={arch.id}
              className="hs-archetype-card"
              style={{
                '--card-bg': arch.gradient,
                '--card-border': `${arch.border}30`,
                '--card-hover-border': arch.border,
                '--card-glow': arch.glow,
                padding: '32px 24px',
              } as React.CSSProperties}
              onClick={() => onEnter(arch.id)}
              onMouseEnter={() => setHoveredArchetype(arch.id)}
              onMouseLeave={() => setHoveredArchetype(null)}
            >
              {/* Glow overlay on hover */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(circle at 50% 0%, ${arch.glow}15, transparent 70%)`,
                opacity: hoveredArchetype === arch.id ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 48, marginBottom: 12, display: 'block' }}>{arch.icon}</div>

                <div style={{ fontSize: 10, letterSpacing: 4, color: arch.color, marginBottom: 6 }}>
                  {arch.title}
                </div>
                <div style={{ fontSize: 26, color: '#fff', letterSpacing: 3, marginBottom: 10 }}>
                  {arch.name}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, lineHeight: 1.5, marginBottom: 20 }}>
                  {arch.tagline}
                </div>

                {/* Stat bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, letterSpacing: 2 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{arch.statLabel}</span>
                    <span style={{ color: arch.color }}>{arch.stat}</span>
                  </div>
                  <div className="hs-stat-bar">
                    <div className="hs-stat-fill" style={{
                      width: `${arch.stat}%`,
                      background: `linear-gradient(90deg, ${arch.color}80, ${arch.color})`,
                    }} />
                  </div>
                </div>

                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>
                  {arch.examples}
                </div>

                <div style={{
                  marginTop: 20,
                  color: arch.color,
                  fontSize: 11,
                  letterSpacing: 3,
                  display: 'flex', alignItems: 'center', gap: 8,
                  opacity: hoveredArchetype === arch.id ? 1 : 0.4,
                  transition: 'opacity 0.2s',
                }}>
                  BUILD THIS HERO →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section style={{
        position: 'relative', zIndex: 2,
        padding: 'clamp(60px, 8vw, 120px) clamp(16px, 4vw, 80px)',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 11, letterSpacing: 5, color: '#f97316', marginBottom: 16 }}>
            — EVERYTHING YOU NEED —
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 60px)', color: '#fff', letterSpacing: 5, margin: 0 }}>
            BUILT FOR CREATORS
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          maxWidth: 1100,
          margin: '0 auto',
        }}>
          {FEATURES.map(f => (
            <div key={f.title} className="hs-feature-card">
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <div style={{
                fontSize: 13,
                color: f.color,
                letterSpacing: 3,
                marginBottom: 12,
              }}>
                {f.title}
              </div>
              <div style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7,
                fontFamily: "'Black Ops One', cursive",
                letterSpacing: 0.5,
              }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA SECTION ═══ */}
      <section style={{
        position: 'relative', zIndex: 2,
        padding: 'clamp(80px, 10vw, 160px) 24px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, letterSpacing: 5, color: '#f97316', marginBottom: 24 }}>
            — YOUR LEGEND AWAITS —
          </div>
          <h2 style={{
            fontSize: 'clamp(40px, 7vw, 90px)',
            color: '#fff',
            letterSpacing: 6,
            margin: '0 0 16px',
            lineHeight: 1,
          }}>
            START BUILDING
          </h2>
          <h2 style={{
            fontSize: 'clamp(40px, 7vw, 90px)',
            background: 'linear-gradient(135deg, #f97316, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 32px',
            letterSpacing: 6,
            lineHeight: 1,
          }}>
            FOR FREE
          </h2>

          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 13,
            letterSpacing: 3,
            marginBottom: 48,
          }}>
            NO SIGN-UP REQUIRED TO START · EXPORT AFTER SIGN IN
          </p>

          <button className="hs-cta-primary" onClick={() => onEnter()} style={{ fontSize: 22, padding: '22px 60px' }}>
            ENTER HEROSCULPT →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 2,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.2)',
        fontSize: 11,
        letterSpacing: 3,
      }}>
        © 2026 HEROSCULPT · ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
