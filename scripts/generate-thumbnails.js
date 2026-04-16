#!/usr/bin/env node
/**
 * HeroSculpt — Part Thumbnail Generator
 *
 * Renders every GLB in public/assets/ to a 512×512 PNG in public/thumbnails/.
 * Only renders parts that don't have a thumbnail yet (incremental).
 * After all renders: patches constants.ts to replace picsum.photos URLs.
 *
 * Pre-conditions:
 *   - `serve` (or `npm run dev`) running on port 5177
 *   - Node 18+ with puppeteer installed (npm install)
 *
 * Usage:
 *   node scripts/generate-thumbnails.js            # full run
 *   node scripts/generate-thumbnails.js --dry-run  # preview only, no renders
 */

import puppeteer from 'puppeteer';
import { readdirSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'public', 'assets');
const OUT_DIR    = path.join(ROOT, 'public', 'thumbnails');
const BASE_URL   = process.env.HEROSCULPT_URL || 'http://localhost:5177';
const DRY_RUN    = process.argv.includes('--dry-run');

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Recursively collect all .glb files under a directory. */
function findGlbFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findGlbFiles(full));
    else if (entry.name.endsWith('.glb')) results.push(full);
  }
  return results;
}

/** Convert an absolute glb path to a URL the headless browser can fetch. */
function glbToUrl(glbPath) {
  const rel = path.relative(path.join(ROOT, 'public'), glbPath).replace(/\\/g, '/');
  return `${BASE_URL}/${rel}`;
}

/** Derive thumbnail filename from glb path (basename without extension). */
export function derivePartId(glbPath) {
  return path.basename(glbPath, '.glb');
}

// ── Minimal Three.js scene injected into Puppeteer ───────────────────────────
// Loads Three.js from CDN — VPS needs internet access.
const SCENE_HTML = `<!DOCTYPE html>
<html>
<head><style>*{margin:0;padding:0} body{background:#0f0f1a;}</style></head>
<body>
<canvas id="c"></canvas>
<script type="importmap">
{"imports":{
  "three":"https://cdn.jsdelivr.net/npm/three@0.177.0/build/three.module.js",
  "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.177.0/examples/jsm/"
}}</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const W = 512, H = 512;
const canvas = document.getElementById('c');
canvas.width  = W;
canvas.height = H;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.setClearColor(0x0f0f1a);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f1a);

const camera = new THREE.PerspectiveCamera(45, W / H, 0.01, 1000);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(2, 3, 2);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x8090ff, 0.4);
fillLight.position.set(-2, 1, -1);
scene.add(fillLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const loader = new GLTFLoader();
let currentModel = null;

window.renderGLB = async (glbUrl) => {
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }

  const gltf = await loader.loadAsync(glbUrl);
  currentModel = gltf.scene;
  scene.add(currentModel);

  // Auto-fit camera: 3/4 isometric view (azimuth 45 deg, elevation 30 deg)
  const box    = new THREE.Box3().setFromObject(currentModel);
  const center = box.getCenter(new THREE.Vector3());
  const size   = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov    = camera.fov * (Math.PI / 180);
  const dist   = (maxDim / 2) / Math.tan(fov / 2) * 1.8;

  const az = Math.PI / 4;   // 45 deg azimuth
  const el = Math.PI / 6;   // 30 deg elevation

  camera.position.set(
    center.x + dist * Math.sin(az) * Math.cos(el),
    center.y + dist * Math.sin(el),
    center.z + dist * Math.cos(az) * Math.cos(el)
  );
  camera.lookAt(center);

  // Two render passes to ensure material textures resolve
  renderer.render(scene, camera);
  await new Promise(r => requestAnimationFrame(() => { renderer.render(scene, camera); r(); }));

  window._renderDone = true;
};

window._sceneReady = true;
</script>
</body>
</html>`;

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(ASSETS_DIR)) {
    console.error('❌ public/assets/ not found — run from the HeroSculpt project root');
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const glbFiles = findGlbFiles(ASSETS_DIR);
  const pending  = glbFiles.filter(f => !existsSync(path.join(OUT_DIR, derivePartId(f) + '.png')));

  console.log(`📦 Found ${glbFiles.length} GLB files. ${glbFiles.length - pending.length} already rendered. ${pending.length} to render.`);

  if (DRY_RUN) {
    console.log('\n[DRY RUN] First 10 pending:');
    pending.slice(0, 10).forEach(f => console.log(' -', path.relative(ROOT, f)));
    process.exit(0);
  }

  if (pending.length === 0) {
    console.log('✅ All thumbnails up to date.');
    updateConstants();
    process.exit(0);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 512, height: 512 });

    await page.setContent(SCENE_HTML, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => window._sceneReady === true, { timeout: 30_000 });

    let done = 0;
    let failed = 0;

    for (const glbPath of pending) {
      const partId  = derivePartId(glbPath);
      const glbUrl  = glbToUrl(glbPath);
      const outFile = path.join(OUT_DIR, partId + '.png');

      try {
        await page.evaluate(() => { window._renderDone = false; });
        await page.evaluate((url) => window.renderGLB(url), glbUrl);
        await page.waitForFunction(() => window._renderDone === true, { timeout: 10_000 });

        const canvasEl = await page.$('#c');
        await canvasEl.screenshot({ path: outFile, type: 'png' });

        done++;
        if (done % 10 === 0 || done === pending.length) {
          console.log(`  [${done}/${pending.length}] ${partId}`);
        }
      } catch (err) {
        console.error(`  ❌ Failed: ${partId} — ${err.message}`);
        failed++;
      }
    }

    console.log(`\n✅ Done. Rendered: ${done}  Failed: ${failed}`);
  } finally {
    await browser.close();
  }

  updateConstants();
}

/** Patch constants.ts: replace all picsum.photos thumbnail URLs with /thumbnails/{id}.png */
function updateConstants() {
  const constantsPath = path.join(ROOT, 'constants.ts');
  if (!existsSync(constantsPath)) return;

  const before = readFileSync(constantsPath, 'utf8');
  const after  = before.replace(
    /https:\/\/picsum\.photos\/seed\/([^/'"]+)\/100\/100/g,
    (_, id) => `/thumbnails/${id}.png`
  );

  if (before === after) {
    console.log('ℹ️  constants.ts thumbnail URLs already updated.');
    return;
  }

  writeFileSync(constantsPath, after);
  console.log('✅ constants.ts: updated thumbnail URLs to /thumbnails/{id}.png');
}

main().catch(e => {
  console.error('\n❌ Fatal error:', e.message);
  process.exit(1);
});
