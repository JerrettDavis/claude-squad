import { BOLD, DIM, GREEN, RED, RESET, YELLOW } from '../core/output.js';

export interface OrchestrateArgs {
  prompt: string;
  url: string;
  pipe: string;
  orchestrator: string;
  wait: boolean;
  token?: string;
}

export function parseOrchestrateArgs(args: string[]): OrchestrateArgs {
  let prompt = '';
  let url = process.env['SQUAD_AGENTHUB_URL'] ?? 'http://localhost:8787';
  let pipe = 'agenthub';
  let orchestrator = process.env['SQUAD_ORCHESTRATOR'] ?? 'agenthub';
  let wait = false;

  for (let i = 0; i < args.length; i += 1) {
    const a = args[i]!;
    if ((a === '--prompt' || a === '-p') && args[i + 1]) {
      prompt = args[i + 1]!;
      i += 1;
      continue;
    }
    if (a === '--url' && args[i + 1]) {
      url = args[i + 1]!;
      i += 1;
      continue;
    }
    if (a === '--pipe' && args[i + 1]) {
      pipe = args[i + 1]!;
      i += 1;
      continue;
    }
    if (a === '--orchestrator' && args[i + 1]) {
      orchestrator = args[i + 1]!;
      i += 1;
      continue;
    }
    if (a === '--wait') {
      wait = true;
      continue;
    }
    if (!a.startsWith('--') && !prompt) {
      prompt = a;
    }
  }

  if (!prompt.trim()) {
    throw new Error('Missing prompt. Use --prompt "..." or provide a positional prompt.');
  }

  return {
    prompt,
    url: url.replace(/\/$/, ''),
    pipe,
    orchestrator,
    wait,
    token: process.env['AGENTHUB_TOKEN'],
  };
}

export async function runOrchestrate(args: string[]): Promise<void> {
  const parsed = parseOrchestrateArgs(args);
  if (parsed.orchestrator !== 'agenthub') {
    throw new Error(`Unsupported orchestrator: ${parsed.orchestrator}. Supported: agenthub`);
  }

  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (parsed.token) headers['authorization'] = `Bearer ${parsed.token}`;

  const createRes = await fetch(`${parsed.url}/v1/jobs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      pipe: parsed.pipe,
      prompt: parsed.prompt,
      parameters: {
        orchestrator: parsed.orchestrator,
        agenthubUrl: parsed.url,
      },
      meta: {
        source: 'squad-orchestrate',
      },
    }),
  });

  const created = await createRes.json() as { id?: string; status?: string; error?: string; message?: string; result?: unknown };
  if (!createRes.ok) {
    throw new Error(created.message || created.error || `AgentHub HTTP ${createRes.status}`);
  }

  console.log(`${GREEN}✓${RESET} Submitted to AgentHub`);
  console.log(`${BOLD}Job:${RESET} ${created.id ?? '(unknown)'}`);
  console.log(`${BOLD}Status:${RESET} ${created.status ?? 'queued'}`);

  if (!parsed.wait || !created.id) return;

  console.log(`${DIM}Waiting for completion...${RESET}`);
  for (let i = 0; i < 120; i += 1) {
    await new Promise(r => setTimeout(r, 1000));
    const pollRes = await fetch(`${parsed.url}/v1/jobs/${created.id}`, { headers });
    const polled = await pollRes.json() as { status?: string; result?: unknown; error?: string; message?: string };
    if (!pollRes.ok) {
      throw new Error(polled.message || polled.error || `AgentHub poll HTTP ${pollRes.status}`);
    }

    const status = polled.status ?? 'unknown';
    if (status === 'completed') {
      console.log(`${GREEN}✓${RESET} Completed`);
      if (polled.result) {
        console.log(`${BOLD}Result:${RESET} ${JSON.stringify(polled.result, null, 2)}`);
      }
      return;
    }
    if (status === 'failed' || status === 'canceled') {
      console.log(`${RED}✗${RESET} Terminal status: ${status}`);
      return;
    }
  }

  console.log(`${YELLOW}!${RESET} Timed out waiting for completion.`);
}
