import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { resolve } from 'node:path';
import { runOrchestrate } from '../../packages/squad-cli/src/cli/commands/orchestrate.ts';

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

describe('orchestrate (e2e)', () => {
  let server: ChildProcessWithoutNullStreams | null = null;

  beforeEach(async () => {
    const cwd = resolve(__dirname, '../../');
    server = spawn(process.execPath, ['scripts/agenthub-server.mjs'], {
      cwd,
      env: { ...process.env, AGENTHUB_PORT: '8899' },
      stdio: 'pipe',
    });
    await sleep(800);
  });

  afterEach(() => {
    if (server && !server.killed) server.kill('SIGTERM');
    server = null;
  });

  it('creates a job against live AgentHub server', async () => {
    const logs: string[] = [];
    const spy = vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.map(String).join(' '));
    });

    await runOrchestrate([
      '--prompt',
      'e2e test',
      '--url',
      'http://localhost:8899',
    ]);

    spy.mockRestore();
    const output = logs.join('\n');
    expect(output).toContain('Submitted to AgentHub');
    expect(output).toContain('Job:');
  });
});
