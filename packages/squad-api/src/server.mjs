import http from 'node:http';
import { URL } from 'node:url';

const port = Number(process.env.SQUAD_API_PORT || 8790);
const host = process.env.SQUAD_API_HOST || '0.0.0.0';

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

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  if (url.pathname === '/healthz') return json(res, 200, { ok: true, service: 'squad-api' });

  // GitHub-shaped compatibility endpoints
  if (req.method === 'GET' && /\/repos\/[^/]+\/[^/]+\/issues$/.test(url.pathname)) {
    return json(res, 200, [ghIssue(1), ghIssue(2), ghIssue(3)]);
  }

  if (req.method === 'GET' && /\/repos\/[^/]+\/[^/]+\/pulls$/.test(url.pathname)) {
    return json(res, 200, [ghPr(11), ghPr(12)]);
  }

  if (req.method === 'GET' && /\/repos\/[^/]+\/[^/]+\/labels$/.test(url.pathname)) {
    return json(res, 200, [
      { id: 1, name: 'bug', color: 'd73a4a' },
      { id: 2, name: 'enhancement', color: 'a2eeef' }
    ]);
  }

  // Dashboard-friendly aliases
  if (req.method === 'GET' && url.pathname === '/api/issues') return json(res, 200, [ghIssue(1), ghIssue(2)]);
  if (req.method === 'GET' && url.pathname === '/api/prs') return json(res, 200, [ghPr(11), ghPr(12)]);
  if (req.method === 'GET' && url.pathname === '/api/agents') {
    return json(res, 200, [
      { id: 'neo', status: 'running', currentTask: 'triage' },
      { id: 'trinity', status: 'idle', currentTask: null }
    ]);
  }

  if (req.method === 'GET' && url.pathname === '/api/events') {
    return json(res, 200, {
      events: [
        { type: 'assignment.created', ts: new Date().toISOString(), payload: { issue: 1, agent: 'neo' } },
        { type: 'pr.review_requested', ts: new Date().toISOString(), payload: { pr: 11, reviewer: 'trinity' } }
      ]
    });
  }

  return json(res, 404, { error: 'not_found' });
});

server.listen(port, host, () => {
  console.log(`squad-api listening on http://${host}:${port}`);
});
