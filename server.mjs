import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8067);
const contactServiceUrl = process.env.CONTACT_SERVICE_URL || 'https://contact-form-service-e8aa.onrender.com/api/contact';
const contactTo = process.env.CONTACT_TO || 'nicolasmgomez9441@gmail.com';
const contactSite = process.env.CONTACT_SITE || 'Mentes Modernas';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const publicExtensions = new Set(['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.ico', '.mp4', '.webm', '.woff', '.woff2']);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const sendJson = (response, statusCode, data) => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(JSON.stringify(data));
};

const readJson = async (request) => {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 100_000) throw new Error('Payload demasiado grande');
  }
  return JSON.parse(body || '{}');
};

const handleContact = async (request, response) => {
  let input;
  try {
    input = await readJson(request);
  } catch {
    sendJson(response, 400, { success: false, error: 'Solicitud inválida' });
    return;
  }

  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim();
  const message = String(input.message || '').trim();
  const company = String(input.company || '').trim();

  if (!name || !emailPattern.test(email) || !message || company) {
    sendJson(response, 400, { success: false, error: 'Datos incompletos o inválidos' });
    return;
  }

  try {
    const upstream = await fetch(contactServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, to: contactTo, message, site: contactSite, company: '' })
    });
    const result = await upstream.json().catch(() => null);
    if (!upstream.ok || result?.success !== true) {
      sendJson(response, 502, { success: false, error: 'No se pudo enviar la consulta' });
      return;
    }
    sendJson(response, 200, { success: true });
  } catch {
    sendJson(response, 502, { success: false, error: 'Servicio de contacto no disponible' });
  }
};

const serveFile = async (request, response, pathname) => {
  const cleanPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const normalizedPath = normalize(cleanPath);
  const extension = extname(normalizedPath).toLowerCase();
  if (normalizedPath.startsWith('..') || !publicExtensions.has(extension)) {
    response.writeHead(404).end();
    return;
  }

  const filePath = join(root, normalizedPath);
  let fileStat;
  try {
    fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error('No es un archivo');
  } catch {
    response.writeHead(404).end();
    return;
  }

  const headers = {
    'Content-Type': contentTypes[extension] || 'application/octet-stream',
    'Accept-Ranges': 'bytes',
    'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=3600'
  };
  const range = request.headers.range;

  if (range && /^(bytes=)\d*-\d*$/.test(range)) {
    const [startText, endText] = range.replace('bytes=', '').split('-');
    const start = startText ? Number(startText) : 0;
    const end = endText ? Math.min(Number(endText), fileStat.size - 1) : fileStat.size - 1;
    if (start > end || start >= fileStat.size) {
      response.writeHead(416, { 'Content-Range': `bytes */${fileStat.size}` }).end();
      return;
    }
    response.writeHead(206, {
      ...headers,
      'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
      'Content-Length': end - start + 1
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(filePath, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, { ...headers, 'Content-Length': fileStat.size });
  if (request.method === 'HEAD') response.end();
  else createReadStream(filePath).pipe(response);
};

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (url.pathname === '/api/contact') {
    if (request.method !== 'POST') {
      response.writeHead(405, { Allow: 'POST' }).end();
      return;
    }
    await handleContact(request, response);
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  await serveFile(request, response, decodeURIComponent(url.pathname));
}).listen(port, () => {
  console.log(`MM Estudio disponible en http://localhost:${port}`);
});
