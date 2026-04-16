#!/usr/bin/env node
/**
 * Deploy HeroSculpt dist/ to Hostinger Static Hosting
 * Usage: node scripts/deploy-hostinger.js <zip-path>
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const API_TOKEN = process.env.HOSTINGER_API_TOKEN;
const DOMAIN = 'darkslategrey-ape-448372.hostingersite.com';
const USERNAME = 'u798941843';
const BASE_URL = 'https://developers.hostinger.com';
const ZIP_PATH = process.argv[2];

if (!API_TOKEN) { console.error('HOSTINGER_API_TOKEN not set'); process.exit(1); }
if (!ZIP_PATH || !fs.existsSync(ZIP_PATH)) { console.error('zip path missing or not found:', ZIP_PATH); process.exit(1); }

function request(method, urlStr, body, headers) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const opts = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json', ...headers }
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

function uploadFile(urlStr, filePath, headers) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const fileStream = fs.createReadStream(filePath);
    const stats = fs.statSync(filePath);
    const opts = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/offset+octet-stream',
        'Content-Length': stats.size,
        'Upload-Offset': '0',
        ...headers
      }
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    fileStream.pipe(req);
  });
}

async function deploy() {
  const zipName = path.basename(ZIP_PATH);
  const stats = fs.statSync(ZIP_PATH);
  console.log(`Deploying ${zipName} (${(stats.size / 1024 / 1024).toFixed(1)} MB) to ${DOMAIN}`);

  // Step 1: Get upload credentials
  console.log('Getting upload credentials...');
  const credsRes = await request('POST', `${BASE_URL}/api/hosting/v1/files/upload-urls`,
    { username: USERNAME, domain: DOMAIN },
    { Authorization: `Bearer ${API_TOKEN}` }
  );
  if (credsRes.status !== 200) throw new Error(`Upload creds failed: ${credsRes.status} ${credsRes.body}`);
  const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = JSON.parse(credsRes.body);
  console.log('Upload URL obtained.');

  // Step 2: Pre-upload POST (creates the file slot)
  const uploadUrlWithFile = `${uploadUrl.replace(/\/$/, '')}/${zipName}?override=true`;
  console.log('Creating upload slot...');
  const preRes = await request('POST', uploadUrlWithFile, '',
    { 'X-Auth': authToken, 'X-Auth-Rest': authRestToken, 'upload-length': stats.size.toString(), 'upload-offset': '0' }
  );
  if (preRes.status !== 201) throw new Error(`Pre-upload failed: ${preRes.status} ${preRes.body}`);
  console.log('Upload slot created.');

  // Step 3: Upload file via PATCH
  console.log('Uploading archive...');
  const upRes = await uploadFile(uploadUrlWithFile, ZIP_PATH,
    { 'X-Auth': authToken, 'X-Auth-Rest': authRestToken }
  );
  if (upRes.status < 200 || upRes.status >= 300) throw new Error(`Upload failed: ${upRes.status} ${upRes.body}`);
  console.log('Archive uploaded.');

  // Step 4: Trigger deploy
  console.log('Triggering deployment...');
  const deployRes = await request('POST',
    `${BASE_URL}/api/hosting/v1/accounts/${USERNAME}/websites/${DOMAIN}/deploy`,
    { archive_path: zipName },
    { Authorization: `Bearer ${API_TOKEN}` }
  );
  if (deployRes.status !== 200) throw new Error(`Deploy failed: ${deployRes.status} ${deployRes.body}`);
  console.log('Deploy triggered:', deployRes.body);
  console.log(`\nDone! -> https://${DOMAIN}`);
}

deploy().catch(e => { console.error('Deploy error:', e.message); process.exit(1); });
