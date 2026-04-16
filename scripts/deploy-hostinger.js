#!/usr/bin/env node
/**
 * Deploy HeroSculpt dist/ to Hostinger Static Hosting
 * Uses developers.hostinger.com API with TUS-compatible upload
 * Usage: node scripts/deploy-hostinger.js <zip-path>
 */

import fs from 'fs';
import path from 'path';

const API_TOKEN   = process.env.HOSTINGER_API_TOKEN;
const DOMAIN      = 'darkslategrey-ape-448372.hostingersite.com';
const USERNAME    = 'u798941843';
const BASE        = 'https://developers.hostinger.com';
const ZIP_PATH    = process.argv[2];

if (!API_TOKEN)                          { console.error('❌ HOSTINGER_API_TOKEN not set');        process.exit(1); }
if (!ZIP_PATH || !fs.existsSync(ZIP_PATH)) { console.error('❌ zip not found:', ZIP_PATH);         process.exit(1); }

async function api(method, url, body, extraHeaders = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

async function deploy() {
  const zipName  = path.basename(ZIP_PATH);
  const fileSize = fs.statSync(ZIP_PATH).size;
  console.log(`📦 ${zipName} (${(fileSize / 1024 / 1024).toFixed(1)} MB) → ${DOMAIN}`);

  // 1. Get upload credentials
  console.log('1/4 Getting upload credentials...');
  const creds = await api('POST', `${BASE}/api/hosting/v1/files/upload-urls`,
    { username: USERNAME, domain: DOMAIN }
  );
  const { url: uploadUrl, auth_key: authKey, rest_auth_key: restAuthKey } = creds;
  if (!uploadUrl || !authKey || !restAuthKey)
    throw new Error(`Bad credentials response: ${JSON.stringify(creds)}`);

  // 2. Create upload slot (pre-upload POST)
  const uploadTarget = `${uploadUrl.replace(/\/$/, '')}/${zipName}?override=true`;
  console.log('2/4 Creating upload slot...');
  const slotRes = await fetch(uploadTarget, {
    method: 'POST',
    headers: {
      'X-Auth':        authKey,
      'X-Auth-Rest':   restAuthKey,
      'upload-length': String(fileSize),
      'upload-offset': '0',
    },
    body: '',
  });
  if (slotRes.status !== 201) {
    const t = await slotRes.text();
    throw new Error(`Upload slot failed ${slotRes.status}: ${t}`);
  }
  console.log('   Slot created.');

  // 3. Upload file (PATCH) with retry
  console.log('3/4 Uploading archive...');
  const fileBuffer = fs.readFileSync(ZIP_PATH);
  let uploadRes;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      uploadRes = await fetch(uploadTarget, {
        method: 'PATCH',
        headers: {
          'X-Auth':         authKey,
          'X-Auth-Rest':    restAuthKey,
          'Content-Type':   'application/offset+octet-stream',
          'Content-Length': String(fileSize),
          'Upload-Offset':  '0',
        },
        body: fileBuffer,
      });
      break;
    } catch (err) {
      if (attempt === 3) throw err;
      console.log(`   Upload attempt ${attempt} failed (${err.message}), retrying in ${attempt * 5}s...`);
      await new Promise(r => setTimeout(r, attempt * 5000));
    }
  }
  if (!uploadRes.ok) {
    const t = await uploadRes.text();
    throw new Error(`Upload failed ${uploadRes.status}: ${t}`);
  }
  console.log('   Archive uploaded.');

  // 4. Trigger deploy
  console.log('4/4 Triggering deployment...');
  const result = await api('POST',
    `${BASE}/api/hosting/v1/accounts/${USERNAME}/websites/${DOMAIN}/deploy`,
    { archive_path: zipName }
  );
  console.log('   Deploy triggered:', JSON.stringify(result));
  console.log(`\n✅ Done → https://${DOMAIN}`);
}

deploy().catch(e => {
  console.error('\n❌ Deploy failed:', e.message);
  process.exit(1);
});
