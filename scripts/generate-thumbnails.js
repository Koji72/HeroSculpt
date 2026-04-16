#!/usr/bin/env node
/**
 * HeroSculpt — Part Thumbnail Generator
 *
 * Renders every GLB in public/assets/ to a 512×512 PNG in public/thumbnails/.
 * Only renders parts that don't have a thumbnail yet (incremental).
 * After all renders: patches constants.ts to replace picsum.photos URLs.
 *
 * Pre-conditions:
 *   - serve (or npm run dev) running on port 5177
 *   - Node 18+ with puppeteer installed (npm install)
 *   - esbuild available (comes with vite, in node_modules/.bin/esbuild)
 *
 * Usage:
 *   node scripts/generate-thumbnails.js            # full run
 *   node scripts/generate-thumbnails.js --dry-run  # preview only, no renders
 */

import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import { readdirSync, existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, copyFileSync } from 'fs';
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

/** Convert absolute glb path to a URL served by localhost. */
function glbToUrl(glbPath) {
  const rel = path.relative(path.join(ROOT, 'public'), glbPath).replace(/\\/g, '/');
  return `${BASE_URL}/${rel}`;
}

/** Derive thumbnail filename from glb path (basename without extension). */
export function derivePartId(glbPath) {
  return path.basename(glbPath, '.glb');
}

// ── Build Three.js + GLTFLoader bundle (no CDN, no importmaps) ───────────────
// Uses esbuild (ships with vite) to create a single IIFE containing Three.js
// and GLTFLoader. Output is served from dist/ via localhost:5177.
function buildThreeBundle(distDir) {
  const BUNDLE_OUT   = path.join(distDir, '_three-bundle.js');
  const ENTRY_FILE   = path.join(ROOT, 'scripts', '_three_entry_tmp.js');
  const ESBUILD_BIN  = path.join(ROOT, 'node_modules', '.bin', 'esbuild');

  // Write minimal entry that exports THREE and GLTFLoader to window
  writeFileSync(ENTRY_FILE, [
    "import * as THREE from 'three';",
    "import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';",
    "import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';",
    "window.__THREE__ = THREE;",
    "window.__GLTFLoader__ = GLTFLoader;",
    "window.__DRACOLoader__ = DRACOLoader;",
  ].join('\n'));

  try {
    execSync(
      `"${ESBUILD_BIN}" "${ENTRY_FILE}" --bundle --format=iife --outfile="${BUNDLE_OUT}"`,
      { cwd: ROOT, stdio: 'pipe' }
    );
    console.log(`✅ Three.js bundle written to dist/_three-bundle.js (${Math.round(readFileSync(BUNDLE_OUT).length / 1024)}KB)`);
  } finally {
    try { unlinkSync(ENTRY_FILE); } catch {}
  }

  return BUNDLE_OUT;
}

// ── Minimal scene HTML — uses bundle from localhost, no ES module imports ────
const SCENE_HTML = `<!DOCTYPE html>
<html>
<head><style>*{margin:0;padding:0} body{background:#0f0f1a;overflow:hidden;}</style></head>
<body>
<canvas id="c" width="512" height="512"></canvas>
<script src="${BASE_URL}/_three-bundle.js"></script>
<script>
(function () {
  const THREE      = window.__THREE__;
  const GLTFLoader  = window.__GLTFLoader__;
  const DRACOLoader = window.__DRACOLoader__;
  if (!THREE || !GLTFLoader || !DRACOLoader) {
    document.title = 'ERROR:no-three';
    return;
  }

  const W = 512, H = 512;
  const canvas   = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x0f0f1a);
  renderer.shadowMap.enabled = true;

  const scene  = new THREE.Scene();
  scene.background = new THREE.Color(0x0f0f1a);
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.01, 1000);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(2, 3, 2);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x8090ff, 0.4);
  fillLight.position.set(-2, 1, -1);
  scene.add(fillLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/_draco/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  let currentModel = null;

  window.renderGLB = function (glbUrl) {
    return new Promise(function (resolve, reject) {
      if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
      }
      loader.load(glbUrl, function (gltf) {
        currentModel = gltf.scene;
        scene.add(currentModel);

        var box    = new THREE.Box3().setFromObject(currentModel);
        var center = box.getCenter(new THREE.Vector3());
        var size   = box.getSize(new THREE.Vector3());
        var maxDim = Math.max(size.x, size.y, size.z);
        var fov    = camera.fov * (Math.PI / 180);
        var dist   = (maxDim / 2) / Math.tan(fov / 2) * 1.8;
        var az = Math.PI / 4;
        var el = Math.PI / 6;
        camera.position.set(
          center.x + dist * Math.sin(az) * Math.cos(el),
          center.y + dist * Math.sin(el),
          center.z + dist * Math.cos(az) * Math.cos(el)
        );
        camera.lookAt(center);

        renderer.render(scene, camera);
        requestAnimationFrame(function () {
          renderer.render(scene, camera);
          resolve();
        });
      }, undefined, reject);
    });
  };

  window._sceneReady = true;
})();
</script>
</body>
</html>`;

function copyDracoAssets(distDir) {
  const dracoSrc = path.join(ROOT, 'node_modules', 'three', 'examples', 'jsm', 'libs', 'draco', 'gltf');
  const dracoOut = path.join(distDir, '_draco');
  mkdirSync(dracoOut, { recursive: true });

  for (const file of ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js']) {
    copyFileSync(path.join(dracoSrc, file), path.join(dracoOut, file));
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(ASSETS_DIR)) {
    console.error('ERROR public/assets/ not found -- run from HeroSculpt project root');
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const glbFiles = findGlbFiles(ASSETS_DIR);
  const pending  = glbFiles.filter(f => !existsSync(path.join(OUT_DIR, derivePartId(f) + '.png')));

  console.log(`Found ${glbFiles.length} GLB files. ${glbFiles.length - pending.length} already rendered. ${pending.length} to render.`);

  if (DRY_RUN) {
    console.log('\n[DRY RUN] First 10 pending:');
    pending.slice(0, 10).forEach(f => console.log(' -', path.relative(ROOT, f)));
    process.exit(0);
  }

  if (pending.length === 0) {
    console.log('All thumbnails up to date.');
    updateConstants();
    process.exit(0);
  }

  // Build the Three.js bundle
  const DIST_DIR = path.join(ROOT, 'dist');
  if (!existsSync(DIST_DIR)) {
    console.error('ERROR dist/ not found -- run npm run build first, or ensure serve is running');
    process.exit(1);
  }

  buildThreeBundle(DIST_DIR);
  copyDracoAssets(DIST_DIR);

  // Write scene HTML to dist/ so it's accessible at BASE_URL/_ts.html
  const SCENE_FILE = path.join(DIST_DIR, '_ts.html');
  writeFileSync(SCENE_FILE, SCENE_HTML);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 512, height: 512 });

    page.on('console', msg => {
      if (msg.type() === 'error') console.error('  [browser error]', msg.text());
    });
    page.on('pageerror', err => console.error('  [page error]', err.message));

    // Load the scene (Three.js bundle + scene setup, all from localhost — no CDN)
    await page.goto(`${BASE_URL}/_ts.html`, { waitUntil: 'load', timeout: 30_000 });

    const title = await page.title();
    if (title.startsWith('ERROR')) {
      console.error(`ERROR Scene init failed: ${title}`);
      process.exit(1);
    }

    await page.waitForFunction(() => window._sceneReady === true, { timeout: 30_000 });
    console.log('Scene ready. Starting renders...');

    let done = 0;
    let failed = 0;

    for (const glbPath of pending) {
      const partId  = derivePartId(glbPath);
      const glbUrl  = glbToUrl(glbPath);
      const outFile = path.join(OUT_DIR, partId + '.png');

      try {
        await page.evaluate((url) => window.renderGLB(url), glbUrl);
        await page.waitForFunction(() => window._sceneReady === true, { timeout: 10_000 });

        const canvasEl = await page.$('#c');
        await canvasEl.screenshot({ path: outFile, type: 'png' });

        done++;
        if (done % 10 === 0 || done === pending.length) {
          console.log(`  [${done}/${pending.length}] ${partId}`);
        }
      } catch (err) {
        console.error(`  FAILED: ${partId} -- ${err.message}`);
        failed++;
      }
    }

    console.log(`\nDone. Rendered: ${done}  Failed: ${failed}`);
  } finally {
    await browser.close();
    try { unlinkSync(SCENE_FILE); } catch {}
    // Keep the bundle for potential re-runs; it will be overwritten next time
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
    console.log('constants.ts thumbnail URLs already updated.');
    return;
  }

  writeFileSync(constantsPath, after);
  console.log('constants.ts: updated thumbnail URLs to /thumbnails/{id}.png');
}

main().catch(e => {
  console.error('\nFATAL:', e.message);
  process.exit(1);
});
