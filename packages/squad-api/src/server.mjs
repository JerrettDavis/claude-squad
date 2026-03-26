import http from 'node:http';
import { URL } from 'node:url';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const port = Number(process.env.SQUAD_API_PORT || 8790);
const host = process.env.SQUAD_API_HOST || '0.0.0.0';
const owner = process.env.SQUAD_REPO_OWNER || 'JerrettDavis';
const repo = process.env.SQUAD_REPO_NAME || 'claude-squad';
const repoRoot = process.env.SQUAD_REPO_ROOT || process.cwd();
const useLiveGh = process.env.SQUAD_API_LIVE_GH !== '0';
const useStubData = process.env.SQUAD_API_STUB_DATA === '1';

const squadDir = join(repoRoot, '.squad');

/** @type {Set<http.ServerResponse>} */
const sseClients = new Set();

// --- Helpers ---

function json(res, status, body) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type',
  });
  res.end(JSON.stringify(body, null, 2));
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch { resolve(null); }
    });
  });
}

function safeGh(cmd, fallback) {
  try {
    const out = execSync(cmd, { encoding: 'utf8', timeout: 15000, stdio: ['ignore', 'pipe', 'ignore'] });
    return JSON.parse(out);
  } catch {
    return fallback;
  }
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function safeReadJson(path, fallback) {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch { return fallback; }
}

function safeWriteJson(path, data) {
  ensureDir(join(path, '..'));
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

// --- GitHub Data ---

function getIssues() {
  if (!useLiveGh) return useStubData ? stubIssues() : [];
  return safeGh(
    `gh issue list --repo ${owner}/${repo} --limit 50 --state all --json number,title,state,labels,author,url,createdAt,updatedAt,comments,body`,
    stubIssues()
  ).map((i) => ({
    id: i.number,
    number: i.number,
    title: i.title,
    state: i.state?.toLowerCase() || 'open',
    labels: (i.labels || []).map((l) => ({ id: 0, name: l.name, color: l.color || 'cccccc' })),
    user: { login: i.author?.login || 'unknown', id: 0 },
    html_url: i.url,
    created_at: i.createdAt,
    updated_at: i.updatedAt,
    comments: i.comments?.length || 0,
    body: i.body || '',
    _agenthub: { priority: 'normal' },
  }));
}

function getPrs() {
  if (!useLiveGh) return useStubData ? stubPrs() : [];
  return safeGh(
    `gh pr list --repo ${owner}/${repo} --limit 50 --state all --json number,title,state,isDraft,author,url,headRefName,baseRefName,additions,deletions,changedFiles,createdAt,updatedAt,reviews,comments`,
    stubPrs()
  ).map((p) => ({
    id: p.number,
    number: p.number,
    title: p.title,
    state: p.isDraft ? 'draft' : (p.state?.toLowerCase() || 'open'),
    draft: !!p.isDraft,
    user: { login: p.author?.login || 'unknown', id: 0 },
    head: { ref: p.headRefName || 'unknown' },
    base: { ref: p.baseRefName || 'main' },
    html_url: p.url,
    additions: p.additions || 0,
    deletions: p.deletions || 0,
    changed_files: p.changedFiles || 0,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    comments: (p.comments?.length || 0) + (p.reviews?.length || 0),
    _agenthub: { steering: 'available' },
  }));
}

function stubIssues() {
  return [1, 2, 3].map(i => ({
    id: i, number: i, title: `Issue ${i}`, state: i % 2 ? 'open' : 'closed',
    labels: [{ id: 1, name: 'enhancement', color: 'a2eeef' }],
    user: { login: 'agent-bot', id: 1000 + i }, html_url: `#`,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    comments: 0, body: '', _agenthub: { priority: 'normal' },
  }));
}

function stubPrs() {
  return [11, 12].map(i => ({
    id: i, number: i, title: `PR ${i}`, state: 'open', draft: false,
    user: { login: 'agent-bot', id: 2000 + i },
    head: { ref: `feature/${i}` }, base: { ref: 'main' },
    html_url: `#`, additions: 0, deletions: 0, changed_files: 0,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    comments: 0, _agenthub: { steering: 'available' },
  }));
}

// --- Agent Config ---

const agentConfigPath = join(squadDir, 'agents.json');

function getAgentConfigs() {
  return safeReadJson(agentConfigPath, { agents: [] }).agents;
}

function saveAgentConfigs(agents) {
  ensureDir(squadDir);
  safeWriteJson(agentConfigPath, { agents });
}

function getAgents() {
  const configs = getAgentConfigs();
  if (configs.length === 0) {
    if (!useStubData) return [];
    // Return enriched defaults
    return [
      { id: 'claude-bot', name: 'Claude Bot', status: 'running', model: 'claude-opus-4-6', provider: 'claude-code', currentTask: 'Building dashboard API', role: 'developer', uptimeSec: 7200, tokensIn: 142000, tokensOut: 87400, requestCount: 47, costUsd: 4.82, capabilities: ['browser', 'personal-gh'], enabled: true },
      { id: 'copilot-agent', name: 'Copilot Agent', status: 'running', model: 'gpt-4.1', provider: 'copilot', currentTask: 'Backend hardening', role: 'developer', uptimeSec: 5400, tokensIn: 98200, tokensOut: 64300, requestCount: 32, costUsd: 2.14, capabilities: ['browser', 'personal-gh', 'docker'], enabled: true },
      { id: 'jdai', name: 'JD.AI', status: 'idle', model: 'qwen3.5:9b', provider: 'ollama', currentTask: null, role: 'scribe', uptimeSec: 1800, tokensIn: 12400, tokensOut: 8100, requestCount: 8, costUsd: 0, capabilities: ['browser'], enabled: true },
      { id: 'ralph', name: 'Ralph', status: 'offline', model: 'claude-sonnet-4-6', provider: 'claude-code', currentTask: null, role: 'lead', uptimeSec: 0, tokensIn: 0, tokensOut: 0, requestCount: 0, costUsd: 0, capabilities: ['personal-gh'], enabled: false },
    ];
  }
  return configs;
}

// --- Wiki ---

const wikiDir = join(squadDir, 'wiki');

function getWikiPages() {
  ensureDir(wikiDir);
  const files = readdirSync(wikiDir).filter(f => f.endsWith('.md'));
  return files.map(f => {
    const content = readFileSync(join(wikiDir, f), 'utf8');
    const slug = f.replace('.md', '');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return {
      slug,
      title: titleMatch ? titleMatch[1] : slug,
      content,
      updatedAt: new Date().toISOString(),
    };
  });
}

function getWikiPage(slug) {
  const path = join(wikiDir, `${slug}.md`);
  if (!existsSync(path)) return null;
  const content = readFileSync(path, 'utf8');
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return { slug, title: titleMatch ? titleMatch[1] : slug, content };
}

function saveWikiPage(slug, content) {
  ensureDir(wikiDir);
  writeFileSync(join(wikiDir, `${slug}.md`), content);
}

// --- Triage ---

const triageLogPath = join(squadDir, 'triage-log.json');

function getTriageLog() {
  return safeReadJson(triageLogPath, { entries: [] }).entries;
}

// --- Events ---

const eventLogPath = join(squadDir, 'event-log.json');

function getEvents() {
  return safeReadJson(eventLogPath, { events: [] }).events.slice(-50);
}

function broadcastEvent(evt) {
  // Also persist
  const log = safeReadJson(eventLogPath, { events: [] });
  log.events.push(evt);
  if (log.events.length > 500) log.events = log.events.slice(-200);
  safeWriteJson(eventLogPath, log);

  const frame = `event: message\ndata: ${JSON.stringify(evt)}\n\n`;
  for (const res of sseClients) {
    try { res.write(frame); } catch { /* ignore */ }
  }
}

// Heartbeat
setInterval(() => {
  broadcastEvent({
    type: 'heartbeat',
    ts: new Date().toISOString(),
    payload: { source: 'squad-api' },
  });
}, 30000).unref();

// --- Git Operations ---

function getGitBranches() {
  try {
    const out = execSync('git branch -a --format="%(refname:short)|%(upstream:short)|%(committerdate:iso8601)|%(subject)|%(authorname)"', {
      encoding: 'utf8', cwd: repoRoot, timeout: 10000, stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim().split('\n').filter(Boolean).map(line => {
      const [name, upstream, date, message, author] = line.split('|');
      return { name: name.replace('origin/', ''), upstream, lastCommitDate: date, lastCommit: message, author };
    });
  } catch { return []; }
}

function getGitLog(limit = 30) {
  try {
    const out = execSync(`git log --format="%H|%h|%s|%an|%aI|%D" -${limit}`, {
      encoding: 'utf8', cwd: repoRoot, timeout: 10000, stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim().split('\n').filter(Boolean).map(line => {
      const [hash, shortHash, message, author, date, refs] = line.split('|');
      return { hash, shortHash, message, author, date, refs: refs || '' };
    });
  } catch { return []; }
}

function getGitDiff(commitHash) {
  try {
    const out = execSync(`git diff ${commitHash}~1..${commitHash} --stat`, {
      encoding: 'utf8', cwd: repoRoot, timeout: 10000, stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim();
  } catch { return ''; }
}

// --- Router ---

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'access-control-allow-headers': 'content-type',
    });
    return res.end();
  }

  // Health
  if (url.pathname === '/healthz') {
    return json(res, 200, { ok: true, service: 'squad-api', liveGh: useLiveGh, repoRoot });
  }

  // SSE event stream
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

  // --- GitHub-shaped compatibility ---
  if (req.method === 'GET' && /\/repos\/[^/]+\/[^/]+\/issues$/.test(url.pathname)) return json(res, 200, getIssues());
  if (req.method === 'GET' && /\/repos\/[^/]+\/[^/]+\/pulls$/.test(url.pathname)) return json(res, 200, getPrs());
  if (req.method === 'GET' && /\/repos\/[^/]+\/[^/]+\/labels$/.test(url.pathname)) {
    if (useLiveGh) {
      const labels = safeGh(`gh label list --repo ${owner}/${repo} --json name,color --limit 50`, []);
      return json(res, 200, labels.map((l, i) => ({ id: i, name: l.name, color: l.color })));
    }
    return json(res, 200, [
      { id: 1, name: 'bug', color: 'd73a4a' },
      { id: 2, name: 'enhancement', color: 'a2eeef' },
    ]);
  }

  // --- Dashboard API ---
  if (req.method === 'GET' && url.pathname === '/api/issues') return json(res, 200, getIssues());
  if (req.method === 'GET' && url.pathname === '/api/prs') return json(res, 200, getPrs());
  if (req.method === 'GET' && url.pathname === '/api/agents') return json(res, 200, getAgents());
  if (req.method === 'GET' && url.pathname === '/api/events') return json(res, 200, { events: getEvents() });

  // Agent config CRUD
  if (req.method === 'GET' && url.pathname === '/api/agents/config') {
    return json(res, 200, { agents: getAgentConfigs() });
  }
  if (req.method === 'PUT' && url.pathname === '/api/agents/config') {
    const body = await readBody(req);
    if (!body?.agents) return json(res, 400, { error: 'missing agents array' });
    saveAgentConfigs(body.agents);
    broadcastEvent({ type: 'agents.config_updated', ts: new Date().toISOString(), payload: { count: body.agents.length } });
    return json(res, 200, { ok: true, count: body.agents.length });
  }
  if (req.method === 'GET' && /^\/api\/agents\/[^/]+\/config$/.test(url.pathname)) {
    const agentId = url.pathname.split('/')[3];
    const configs = getAgentConfigs();
    const agent = configs.find(a => a.id === agentId);
    return agent ? json(res, 200, agent) : json(res, 404, { error: 'agent not found' });
  }
  if (req.method === 'PUT' && /^\/api\/agents\/[^/]+\/config$/.test(url.pathname)) {
    const agentId = url.pathname.split('/')[3];
    const body = await readBody(req);
    if (!body) return json(res, 400, { error: 'invalid body' });
    const configs = getAgentConfigs();
    const idx = configs.findIndex(a => a.id === agentId);
    if (idx >= 0) configs[idx] = { ...configs[idx], ...body, id: agentId };
    else configs.push({ ...body, id: agentId });
    saveAgentConfigs(configs);
    broadcastEvent({ type: 'agent.config_updated', ts: new Date().toISOString(), payload: { agentId } });
    return json(res, 200, { ok: true, agentId });
  }

  // Wiki CRUD
  if (req.method === 'GET' && url.pathname === '/api/wiki') return json(res, 200, getWikiPages());
  if (req.method === 'GET' && /^\/api\/wiki\/[^/]+$/.test(url.pathname)) {
    const slug = url.pathname.split('/')[3];
    const page = getWikiPage(slug);
    return page ? json(res, 200, page) : json(res, 404, { error: 'page not found' });
  }
  if (req.method === 'PUT' && /^\/api\/wiki\/[^/]+$/.test(url.pathname)) {
    const slug = url.pathname.split('/')[3];
    const body = await readBody(req);
    if (!body?.content) return json(res, 400, { error: 'missing content' });
    saveWikiPage(slug, body.content);
    broadcastEvent({ type: 'wiki.page_updated', ts: new Date().toISOString(), payload: { slug } });
    return json(res, 200, { ok: true, slug });
  }

  // Triage
  if (req.method === 'GET' && url.pathname === '/api/triage') return json(res, 200, { entries: getTriageLog() });

  // Git operations
  if (req.method === 'GET' && url.pathname === '/api/git/branches') return json(res, 200, getGitBranches());
  if (req.method === 'GET' && url.pathname === '/api/git/log') {
    const limit = Number(url.searchParams.get('limit')) || 30;
    return json(res, 200, getGitLog(limit));
  }
  if (req.method === 'GET' && /^\/api\/git\/diff\/[a-f0-9]+$/.test(url.pathname)) {
    const hash = url.pathname.split('/')[4];
    return json(res, 200, { hash, diff: getGitDiff(hash) });
  }

  // Broadcast event (for agents to push events)
  if (req.method === 'POST' && url.pathname === '/api/events') {
    const body = await readBody(req);
    if (!body) return json(res, 400, { error: 'invalid body' });
    broadcastEvent({ ...body, ts: body.ts || new Date().toISOString() });
    return json(res, 201, { ok: true });
  }

  return json(res, 404, { error: 'not_found' });
});

server.listen(port, host, () => {
  console.log(`squad-api listening on http://${host}:${port}`);
  console.log(`  repo: ${owner}/${repo} (root: ${repoRoot})`);
  console.log(`  live gh: ${useLiveGh}`);
});
