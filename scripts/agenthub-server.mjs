#!/usr/bin/env node
import http from 'node:http';
import { URL } from 'node:url';

const port = Number(process.env.AGENTHUB_PORT || 8787);
const host = process.env.AGENTHUB_HOST || '0.0.0.0';

/** @type {Map<string, any>} */
const jobs = new Map();
let seq = 0;

function json(res, status, body) {
  const text = JSON.stringify(body, null, 2);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(text);
}

function notFound(res) {
  json(res, 404, { error: 'not_found' });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        reject(new Error('payload_too_large'));
      }
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

function newJob(input) {
  const id = `job_${Date.now()}_${++seq}`;
  const now = new Date().toISOString();
  const job = {
    id,
    status: 'queued',
    createdAt: now,
    updatedAt: now,
    pipe: input.pipe || 'agenthub',
    parameters: input.parameters || {},
    prompt: input.prompt || '',
    meta: input.meta || {},
    result: null,
  };
  jobs.set(id, job);

  // Minimal fake runner so queue is observable end-to-end.
  setTimeout(() => {
    const j = jobs.get(id);
    if (!j || j.status !== 'queued') return;
    j.status = 'running';
    j.updatedAt = new Date().toISOString();
  }, 300);

  setTimeout(() => {
    const j = jobs.get(id);
    if (!j || j.status !== 'running') return;
    j.status = 'completed';
    j.updatedAt = new Date().toISOString();
    j.result = {
      summary: 'AgentHub MVP completed placeholder run',
      next: 'Wire real squad runtime executor here',
    };
  }, 1200);

  return job;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  // Health
  if (req.method === 'GET' && url.pathname === '/healthz') {
    return json(res, 200, {
      ok: true,
      service: 'agenthub',
      version: 'mvp',
      jobs: jobs.size,
      time: new Date().toISOString(),
    });
  }

  // Create job
  if (req.method === 'POST' && url.pathname === '/v1/jobs') {
    try {
      const raw = await readBody(req);
      const input = raw ? JSON.parse(raw) : {};
      const job = newJob(input);
      return json(res, 202, job);
    } catch (err) {
      return json(res, 400, { error: 'invalid_request', message: String(err?.message || err) });
    }
  }

  // List jobs
  if (req.method === 'GET' && url.pathname === '/v1/jobs') {
    return json(res, 200, { jobs: Array.from(jobs.values()) });
  }

  // Get job by id
  if (req.method === 'GET' && url.pathname.startsWith('/v1/jobs/')) {
    const id = url.pathname.split('/').pop();
    if (!id || !jobs.has(id)) return notFound(res);
    return json(res, 200, jobs.get(id));
  }

  // Cancel job
  if (req.method === 'POST' && url.pathname.startsWith('/v1/jobs/') && url.pathname.endsWith('/cancel')) {
    const id = url.pathname.split('/')[3];
    const job = jobs.get(id);
    if (!job) return notFound(res);
    if (job.status === 'completed' || job.status === 'failed') {
      return json(res, 409, { error: 'already_terminal', id, status: job.status });
    }
    job.status = 'canceled';
    job.updatedAt = new Date().toISOString();
    return json(res, 200, job);
  }

  return notFound(res);
});

server.listen(port, host, () => {
  console.log(`AgentHub listening on http://${host}:${port}`);
  console.log('Endpoints: GET /healthz, POST /v1/jobs, GET /v1/jobs, GET /v1/jobs/:id, POST /v1/jobs/:id/cancel');
});
