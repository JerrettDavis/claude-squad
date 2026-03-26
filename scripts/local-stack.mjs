#!/usr/bin/env node
import { spawn } from 'node:child_process';
import net from 'node:net';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);

function arg(name, fallback) {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
}

function has(name) {
  return args.includes(name);
}

function parseNum(name, fallback) {
  const n = Number(arg(name, String(fallback)));
  return Number.isFinite(n) ? n : fallback;
}

async function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => resolve(false));
    server.listen({ port, host: '0.0.0.0' }, () => {
      server.close(() => resolve(true));
    });
  });
}

async function pickPort(base, label) {
  for (let p = base; p < base + 50; p += 1) {
    if (await isPortFree(p)) {
      if (p !== base) {
        console.warn(`[${label}] port ${base} in use, using ${p}`);
      }
      return p;
    }
  }
  throw new Error(`No free port found for ${label} in range ${base}-${base + 49}`);
}

async function main() {
  const workspaceName = arg('--workspace', 'default');
  const workspacesRoot = resolve(root, '.local', 'workspaces');
  const workspaceDir = resolve(workspacesRoot, workspaceName);
  const fresh = has('--fresh');

  const baseAgenthubPort = parseNum('--agenthub-port', 8787);
  const baseApiPort = parseNum('--api-port', 8790);
  const baseDashboardPort = parseNum('--dashboard-port', 5173);

  const agenthubPort = await pickPort(baseAgenthubPort, 'agenthub');
  const apiPort = await pickPort(baseApiPort, 'api');
  const dashboardPort = await pickPort(baseDashboardPort, 'dashboard');

  if (!existsSync(workspacesRoot)) mkdirSync(workspacesRoot, { recursive: true });
  if (!existsSync(workspaceDir)) mkdirSync(workspaceDir, { recursive: true });

  if (fresh) {
    const squadDir = join(workspaceDir, '.squad');
    const hubDir = join(workspaceDir, '.agenthub');
    if (existsSync(squadDir)) rmSync(squadDir, { recursive: true, force: true });
    if (existsSync(hubDir)) rmSync(hubDir, { recursive: true, force: true });
  }

  const envPath = join(root, 'packages', 'squad-dashboard', '.env.local');
  const envContent = [
    `VITE_USE_MOCKS=false`,
    `VITE_API_BASE_URL=http://localhost:${apiPort}`,
    `VITE_AGENTHUB_URL=http://localhost:${agenthubPort}`,
  ].join('\n') + '\n';
  writeFileSync(envPath, envContent);

  const common = { ...process.env };

  function run(name, command, cwd, envExtra = {}) {
    const child = spawn(command, {
      cwd,
      env: { ...common, ...envExtra },
      shell: true,
      stdio: 'inherit',
    });
    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(`[${name}] exited with code ${code}`);
      }
    });
    return child;
  }

  const procs = [];

  procs.push(
    run('agenthub', 'npm run agenthub:serve', root, {
      AGENTHUB_PORT: String(agenthubPort),
      AGENTHUB_STATE_DIR: join(workspaceDir, '.agenthub'),
    })
  );

  procs.push(
    run('api', 'npm run api:serve', root, {
      SQUAD_API_PORT: String(apiPort),
      SQUAD_REPO_ROOT: workspaceDir,
      SQUAD_API_LIVE_GH: '0',
    })
  );

  procs.push(
    run('dashboard', `npm run dev -- --port ${dashboardPort} --host`, join(root, 'packages', 'squad-dashboard'))
  );

  console.log('');
  console.log('Local stack started:');
  console.log(`- workspace: ${workspaceDir}`);
  console.log(`- agenthub: http://localhost:${agenthubPort}`);
  console.log(`- api:      http://localhost:${apiPort}`);
  console.log(`- ui:       http://localhost:${dashboardPort}`);
  console.log(`- mode:     live API (VITE_USE_MOCKS=false)`);
  console.log('');
  console.log('Press Ctrl+C to stop all processes.');

  function shutdown() {
    for (const p of procs) {
      try { p.kill(); } catch {}
    }
    process.exit(0);
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(String(err?.stack || err));
  process.exit(1);
});
