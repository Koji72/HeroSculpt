import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HERO_IMG = 'https://i.imgur.com/8Km9tLL.png'; // Puedes cambiar por tu render
const ENEMY_IMG = 'https://i.imgur.com/1XjK4bF.png'; // Puedes cambiar por tu render

const initialHero = { name: 'Héroe', hp: 30, maxHp: 30 };
const initialEnemy = { name: 'Enemigo', hp: 25, maxHp: 25 };

export default function BattleDemo() {
  const [hero, setHero] = useState(initialHero);
  const [enemy, setEnemy] = useState(initialEnemy);
  const [log, setLog] = useState<string[]>([]);
  const [turn, setTurn] = useState<'hero' | 'enemy'>('hero');
  const [effect, setEffect] = useState<{ target: 'hero' | 'enemy'; type: 'hit' | 'heal' | null }>({ target: 'enemy', type: null });
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => setShowIntro(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  function addLog(msg: string) {
    setLog((l) => [msg, ...l.slice(0, 4)]);
  }

  function attack() {
    if (turn !== 'hero') return;
    const dmg = Math.floor(Math.random() * 6) + 3;
    setEffect({ target: 'enemy', type: 'hit' });
    setTimeout(() => setEffect({ target: 'enemy', type: null }), 400);
    setEnemy((e) => ({ ...e, hp: Math.max(0, e.hp - dmg) }));
    addLog(`¡Atacas al enemigo por ${dmg} de daño!`);
    setTurn('enemy');
    setTimeout(enemyTurn, 900);
  }

  function heal() {
    if (turn !== 'hero') return;
    const heal = Math.floor(Math.random() * 5) + 4;
    setEffect({ target: 'hero', type: 'heal' });
    setTimeout(() => setEffect({ target: 'hero', type: null }), 400);
    setHero((h) => ({ ...h, hp: Math.min(h.maxHp, h.hp + heal) }));
    addLog(`¡Te curas ${heal} puntos!`);
    setTurn('enemy');
    setTimeout(enemyTurn, 900);
  }

  function enemyTurn() {
    if (enemy.hp <= 0) return;
    const dmg = Math.floor(Math.random() * 5) + 2;
    setEffect({ target: 'hero', type: 'hit' });
    setTimeout(() => setEffect({ target: 'hero', type: null }), 400);
    setHero((h) => ({ ...h, hp: Math.max(0, h.hp - dmg) }));
    addLog(`¡El enemigo te ataca por ${dmg} de daño!`);
    setTurn('hero');
  }

  function reset() {
    setHero(initialHero);
    setEnemy(initialEnemy);
    setLog([]);
    setTurn('hero');
    setShowIntro(true);
  }

  // --- Animación de presentación ---
  if (showIntro) {
    return (
      <div style={{ background: '#181a1b', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.img
          src={HERO_IMG}
          initial={{ x: '-40vw', y: '40vh', opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
          style={{ position: 'absolute', left: '10%', bottom: '20%', width: 180, height: 180, objectFit: 'contain', borderRadius: 12, border: '2px solid #444', zIndex: 2 }}
        />
        <motion.img
          src={ENEMY_IMG}
          initial={{ x: '40vw', y: '-40vh', opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
          style={{ position: 'absolute', right: '10%', top: '20%', width: 180, height: 180, objectFit: 'contain', borderRadius: 12, border: '2px solid #444', zIndex: 2 }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          style={{ position: 'absolute', left: 0, right: 0, top: '45%', textAlign: 'center', fontSize: 32, fontWeight: 'bold', letterSpacing: 2 }}
        >
          ¡Comienza el combate!
        </motion.div>
      </div>
    );
  }

  // --- Combate normal ---
  return (
    <div style={{ background: '#181a1b', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ marginBottom: 16 }}>Demo Combate por Turnos</h2>
      <div style={{ display: 'flex', gap: 60, alignItems: 'flex-end', marginBottom: 32 }}>
        {/* Héroe */}
        <div style={{ textAlign: 'center', filter: effect.target === 'hero' && effect.type === 'hit' ? 'brightness(2) drop-shadow(0 0 10px red)' : effect.target === 'hero' && effect.type === 'heal' ? 'drop-shadow(0 0 10px #0f0)' : 'none', transition: 'filter 0.2s' }}>
          <img src={HERO_IMG} alt="Hero" style={{ width: 160, height: 160, objectFit: 'contain', borderRadius: 12, border: '2px solid #444' }} />
          <div style={{ marginTop: 8 }}><b>{hero.name}</b></div>
          <div>HP: {hero.hp} / {hero.maxHp}</div>
        </div>
        {/* Enemigo */}
        <div style={{ textAlign: 'center', filter: effect.target === 'enemy' && effect.type === 'hit' ? 'brightness(2) drop-shadow(0 0 10px red)' : 'none', transition: 'filter 0.2s' }}>
          <img src={ENEMY_IMG} alt="Enemy" style={{ width: 160, height: 160, objectFit: 'contain', borderRadius: 12, border: '2px solid #444' }} />
          <div style={{ marginTop: 8 }}><b>{enemy.name}</b></div>
          <div>HP: {enemy.hp} / {enemy.maxHp}</div>
        </div>
      </div>
      {/* Acciones */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button onClick={attack} disabled={turn !== 'hero' || hero.hp <= 0 || enemy.hp <= 0} style={{ padding: '10px 24px', fontWeight: 'bold', background: '#ffb300', border: 'none', borderRadius: 8, color: '#222', cursor: 'pointer', fontSize: 18 }}>Attack</button>
        <button onClick={heal} disabled={turn !== 'hero' || hero.hp <= 0 || enemy.hp <= 0} style={{ padding: '10px 24px', fontWeight: 'bold', background: '#4caf50', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 18 }}>Heal</button>
        <button onClick={reset} style={{ padding: '10px 24px', fontWeight: 'bold', background: '#222', border: '1px solid #888', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 18 }}>Reset</button>
      </div>
      {/* Log de combate */}
      <div style={{ background: '#222', padding: 16, borderRadius: 8, minWidth: 320, minHeight: 80, fontFamily: 'monospace', fontSize: 16 }}>
        {hero.hp <= 0 && <div style={{ color: '#f44336', fontWeight: 'bold' }}>You have been defeated!</div>}
        {enemy.hp <= 0 && <div style={{ color: '#ffb300', fontWeight: 'bold' }}>Victory!</div>}
        {log.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
    </div>
  );
} 