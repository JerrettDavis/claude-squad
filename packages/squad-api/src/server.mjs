import http from 'node:http';
import { URL } from 'node:url';
import { execSync } from 'node:child_process';

const port = Number(process.env.SQUAD_API_PORT || 8790);
const host = process.env.SQUAD_API_HOST || '0.0.0.0';
const owner = process.env.SQUAD_REPO_OWNER || 'JerrettDavis';
const repo = process.env.SQUAD_REPO_NAME || 'claude-squad';
const useLiveGh = process.env.SQUAD_API_LIVE_GH === '1';

/** @type {Set<http.ServerResponse>} */
const sseClients = new Set();

function ghIssue(i) {
  return {
    id: i,
    number: i,
    title: `Issue ${i}`,
    state: i % 2 ? 'open' : 'closed',
    labels: [{ id: 1, name: 'enhancement', color: 'a2eeef' }],
    user: { login: 'agent-bot', id: 1000 + i },
    html_url: `https://agenthub.local/issues/${i}`,
    _agenthub: { priority: i % 2 ? 'high' : 'normal' }
  };
}

function ghPr(i) {
  return {
    id: i,
    number: i,
    title: `PR ${i}`,
    state: 'open',
    draft: false,
    user: { login: 'agent-bot', id: 2000 + i },
    head: { ref: `feature/${i}` },
    base: { ref: 'main' },
    html_url: `https://agenthub.local/pull/${i}`,
    _agenthub: { steering: 'available' }
  };
}

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body, null, 2));
}

function safeGh(cmd, fallback) {
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return JSON.parse(out);
  } catch {
    return fallback;
  }
}

function getIssues() {
  if (!useLiveGh) return [ghIssue(1), ghIssue(2), ghIssue(3)];
  return safeGh(
    `gh issue list --repo ${owner}/${repo} --limit 25 --json id,number,title,state,labels,author,url`,
    [ghIssue(1), ghIssue(2)]
  ).map((i) => ({
    id: i.id,
    number: i.number,
    title: i.title,
    state: i.state,
    labels: (i.labels || []).map((l) => ({ id: l.id || 0, name: l.name, color: l.color || 'cccccc' })),
    user: { login: i.author?.login || 'unknown', id: 0 },
    html_url: i.url,
  }));
}

function getPrs() {
  if (!useLiveGh) return [ghPr(11), ghPr(12)];
  return safeGh(
    `gh pr list --repo ${owner}/${repo} --limit 25 --json id,number,title,state,isDraft,author,url,headRefName,baseRefName`,
    [ghPr(11), ghPr(12)]
  ).map((p) => ({
    id: p.id,
    number: p.number,
    title: p.title,
    state: p.state,
    draft: !!p.isDraft,
    user: { login: p.author?.login || 'unknown', id: 0 },
    head: { ref: p.headRefName || 'unknown' },
    base: { ref: p.baseRefName || 'main' },
    html_url: p.url,
  }));
}

function getAgents() {
  return [
    {
      id: 'neo',
      status: 'running',
      currentTask: 'triage',
      model: 'claude-sonnet-4-6',
      uptimeSec: 4100,
      tokenIn: 142000,
      tokenOut: 99000,
      requestCount: 84,
      costUsd: 4.82,
    },
    {
      id: 'trinity',
      status: 'idle',
      currentTask: null,
      model: 'gpt-5.3-codex',
      uptimeSec: 3900,
      tokenIn: 121000,
      tokenOut: 87000,
      requestCount: 73,
      costUsd: 3.91,
    },
  ];
}

function broadcastEvent(evt) {
  const frame = `event: message\ndata: ${JSON.stringify(evt)}\n\n`;
  for (const res of sseClients) {
    try { res.write(frame); } catch { /* ignore */ }
  }
}

setInterval(() => {
  broadcastEvent({
    type: 'heartbeat',
    ts: new Date().toISOString(),
    payload: { source: 'squad-api' },
  });
}, 10000).unref();

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  if (url.pathname === '/healthz') return json(res, 200, { ok: true, service: 'squad-api', liveGh: useLiveGh });

  if (req.method === 'GET' && url.pathname === '/api/events/stream') {
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      'access-control-allow-origin': '*',
    });
    res.write(`event: ready\ndata: ${JSON.stringify({ ok: true, ts: new Date().toISOString() })}\n\n`);
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // GitHub-shaped compatibility endpoints
  if (req.method === 'GET' && /\/repos\/[^/]+\/[^/]+\/issues$/.test(url.pathname)) return json(res, 200, getIssues());
  if (req.method === 'GET' && /\/repos\/[^/]+\/[^/]+\/pulls$/.test(url.pathname)) return json(res, 200, getPrs());
  if (req.method === 'GET' && /\/repos\/[^/]+\/[^/]+\/labels$/.test(url.pathname)) {
    return json(res, 200, [
      { id: 1, name: 'bug', color: 'd73a4a' },
      { id: 2, name: 'enhancement', color: 'a2eeef' },
      { id: 3, name: 'needs:review', color: 'fbca04' },
    ]);
  }

  // Dashboard aliases
  if (req.method === 'GET' && url.pathname === '/api/issues') return json(res, 200, getIssues());
  if (req.method === 'GET' && url.pathname === '/api/prs') return json(res, 200, getPrs());
  if (req.method === 'GET' && url.pathname === '/api/agents') return json(res, 200, getAgents());
  if (req.method === 'GET' && url.pathname === '/api/events') {
    return json(res, 200, {
      events: [
        { type: 'assignment.created', ts: new Date().toISOString(), payload: { issue: 1, agent: 'neo' } },
        { type: 'pr.review_requested', ts: new Date().toISOString(), payload: { pr: 11, reviewer: 'trinity' } },
      ]
    });
  }

  return json(res, 404, { error: 'not_found' });
});

server.listen(port, host, () => {
  console.log(`squad-api listening on http://${host}:${port}`);
});
