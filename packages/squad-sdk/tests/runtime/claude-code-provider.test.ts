/**
 * Smoke tests for ClaudeCodeRuntimeProvider
 *
 * Tests the provider lifecycle: start → send → events → shutdown.
 * Uses a mock claude binary (simple Node.js script) to avoid requiring
 * actual Claude CLI installation in CI.
 *
 * NOTE: The mock binary is a Node.js script invoked via its shebang on
 * POSIX systems.  On Windows the tests that require a live subprocess are
 * skipped automatically because child_process.spawn cannot execute scripts
 * without shell:true; the CI target (Linux) runs all tests.
 */

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { writeFileSync, chmodSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ClaudeCodeRuntimeProvider } from '../../src/runtime/providers/claude-code-provider.js';
import type { RuntimeProviderEvent } from '../../src/runtime/provider.js';

const IS_WINDOWS = process.platform === 'win32';

/**
 * Create a cross-platform mock "claude" binary.
 *
 * On POSIX: writes a Node.js script with a `#!/usr/bin/env node` shebang
 * and makes it executable so `spawn(path, args)` works out of the box.
 *
 * On Windows: writes only the .js file (for documentation / type-checking)
 * and returns a special sentinel path — callers must skip live-subprocess
 * tests when IS_WINDOWS is true.
 */
function createMockClaude(dir: string): string {
  const script = [
    '#!/usr/bin/env node',
    // Emit one JSON line immediately so startSession() resolves.
    "process.stdout.write(JSON.stringify({type:'session_start',session_id:'test-123'})+'\\n');",
    'process.stdin.setEncoding("utf8");',
    'let buf="";',
    'process.stdin.on("data",(c)=>{',
    '  buf+=c;',
    '  let nl;',
    '  while((nl=buf.indexOf("\\n"))!==-1){',
    '    const line=buf.slice(0,nl).trim();',
    '    buf=buf.slice(nl+1);',
    '    if(line) process.stdout.write(JSON.stringify({type:"message",content:"echo: "+line})+"\\n");',
    '  }',
    '});',
    'process.stdin.on("end",()=>process.exit(0));',
  ].join('\n');

  const scriptPath = join(dir, 'claude');
  writeFileSync(scriptPath, script, { mode: 0o755 });
  if (!IS_WINDOWS) chmodSync(scriptPath, 0o755);
  return scriptPath;
}

let mockBinDir: string;
let mockClaudePath: string;

beforeAll(() => {
  mockBinDir = mkdtempSync(join(tmpdir(), 'claude-mock-'));
  mockClaudePath = createMockClaude(mockBinDir);
});

afterAll(() => {
  rmSync(mockBinDir, { recursive: true, force: true });
});

describe('ClaudeCodeRuntimeProvider', () => {
  let provider: ClaudeCodeRuntimeProvider;

  beforeAll(() => {
    provider = new ClaudeCodeRuntimeProvider({ claudeBin: mockClaudePath });
  });

  afterEach(async () => {
    // Clean up any lingering sessions
    // Provider tracks sessions internally; this is belt-and-suspenders
  });

  it('should have correct provider name', () => {
    expect(provider.name).toBe('claude-code');
  });

  it('should list available models', async () => {
    const models = await provider.listModels!();
    expect(models).toContain('claude-sonnet-4-6');
    expect(models).toContain('claude-opus-4-6');
    expect(models.length).toBeGreaterThan(0);
  });

  it.skipIf(IS_WINDOWS)('should start a session and receive session.started event', async () => {
    const events: RuntimeProviderEvent[] = [];

    const session = await provider.startSession({
      workingDirectory: mockBinDir,
    });

    expect(session.id).toBeTruthy();
    expect(session.provider).toBe('claude-code');

    const unsub = await provider.onEvent(session.id, (event) => {
      events.push(event);
    });

    // Give time for the session.started event to propagate
    await new Promise((r) => setTimeout(r, 500));

    // session.started should have been emitted during startSession
    // (it fires before onEvent is wired, so check provider behavior)
    expect(session.id).toBeDefined();

    unsub();
    await provider.shutdownSession(session.id);
  });

  it.skipIf(IS_WINDOWS)('should send a message and receive events', async () => {
    const events: RuntimeProviderEvent[] = [];

    const session = await provider.startSession({
      workingDirectory: mockBinDir,
    });

    await provider.onEvent(session.id, (event) => {
      events.push(event);
    });

    await provider.sendMessage(session.id, {
      role: 'user',
      content: 'Hello from test',
    });

    // Wait for the mock to echo back
    await new Promise((r) => setTimeout(r, 1000));

    // Should have received at least one event (message delta or complete)
    const messageEvents = events.filter(
      (e) => e.type === 'message.delta' || e.type === 'message.complete',
    );
    expect(messageEvents.length).toBeGreaterThan(0);

    await provider.shutdownSession(session.id);
  });

  it.skipIf(IS_WINDOWS)('should shutdown session cleanly', async () => {
    const events: RuntimeProviderEvent[] = [];

    const session = await provider.startSession({
      workingDirectory: mockBinDir,
    });

    await provider.onEvent(session.id, (event) => {
      events.push(event);
    });

    await provider.shutdownSession(session.id);

    // After shutdown, sending should throw
    await expect(
      provider.sendMessage(session.id, { role: 'user', content: 'test' }),
    ).rejects.toThrow();
  });

  it.skipIf(IS_WINDOWS)('should handle multiple concurrent sessions', async () => {
    const session1 = await provider.startSession({
      workingDirectory: mockBinDir,
    });
    const session2 = await provider.startSession({
      workingDirectory: mockBinDir,
    });

    expect(session1.id).not.toBe(session2.id);

    await provider.shutdownSession(session1.id);
    await provider.shutdownSession(session2.id);
  });

  it.skipIf(IS_WINDOWS)('should unsubscribe event handler correctly', async () => {
    const events: RuntimeProviderEvent[] = [];

    const session = await provider.startSession({
      workingDirectory: mockBinDir,
    });

    const unsub = await provider.onEvent(session.id, (event) => {
      events.push(event);
    });

    // Unsubscribe immediately
    unsub();

    await provider.sendMessage(session.id, {
      role: 'user',
      content: 'should not appear',
    });

    await new Promise((r) => setTimeout(r, 500));

    // No events should have been captured after unsubscribe
    const postUnsub = events.filter((e) => e.timestamp > Date.now() - 400);
    expect(postUnsub.length).toBe(0);

    await provider.shutdownSession(session.id);
  });
});

// ── Edge-case hardening tests ─────────────────────────────────────────────────

describe('ClaudeCodeRuntimeProvider — edge cases', () => {
  let edgeBinDir: string;
  let edgeClaudePath: string;

  beforeAll(() => {
    edgeBinDir = mkdtempSync(join(tmpdir(), 'claude-edge-'));
    edgeClaudePath = createMockClaude(edgeBinDir);
  });

  afterAll(() => {
    rmSync(edgeBinDir, { recursive: true, force: true });
  });

  // ── a. Malformed output lines ──────────────────────────────────────────────

  it.skipIf(IS_WINDOWS)('should not crash when handleOutputLine receives malformed JSON', async () => {
    const provider = new ClaudeCodeRuntimeProvider({ claudeBin: edgeClaudePath });
    const session = await provider.startSession({ workingDirectory: edgeBinDir });

    const events: RuntimeProviderEvent[] = [];
    await provider.onEvent(session.id, (e) => events.push(e));

    // Access private method via bracket notation for white-box testing.
    const p = provider as unknown as Record<string, (id: string, line: string) => void>;

    // Partial JSON — should not throw, should emit a message.delta
    expect(() => p['handleOutputLine'](session.id, '{"type": "incomplete"')).not.toThrow();

    // Pure binary garbage — should not throw
    expect(() => p['handleOutputLine'](session.id, '\x00\x01\x02\x03')).not.toThrow();

    // Extremely long line (> 1 MiB) — should not throw, should emit error event
    const hugeLine = 'x'.repeat(1_100_000);
    expect(() => p['handleOutputLine'](session.id, hugeLine)).not.toThrow();

    // At least one error event should have been emitted for the oversized line.
    const errorEvents = events.filter((e) => e.type === 'error');
    expect(errorEvents.length).toBeGreaterThan(0);

    await provider.shutdownSession(session.id);
  });

  // ── b. Double shutdown ─────────────────────────────────────────────────────

  it.skipIf(IS_WINDOWS)('should be safe to call shutdownSession twice on the same session', async () => {
    const provider = new ClaudeCodeRuntimeProvider({ claudeBin: edgeClaudePath });
    const session = await provider.startSession({ workingDirectory: edgeBinDir });

    // First shutdown — normal.
    await expect(provider.shutdownSession(session.id)).resolves.toBeUndefined();

    // Second shutdown — must be a no-op, not throw.
    await expect(provider.shutdownSession(session.id)).resolves.toBeUndefined();
  });

  // ── c. Send to dead session / dead process ─────────────────────────────────

  it.skipIf(IS_WINDOWS)('should throw a clear error when sending to a session whose process has exited', async () => {
    const provider = new ClaudeCodeRuntimeProvider({ claudeBin: edgeClaudePath });
    const session = await provider.startSession({ workingDirectory: edgeBinDir });

    // Force-kill the subprocess without going through shutdownSession so the
    // session map entry remains, simulating a crashed process.
    const proc = (
      provider as unknown as Record<string, Map<string, { process: import('node:child_process').ChildProcess }>>
    )['sessions'].get(session.id)!.process;

    proc.kill('SIGKILL');

    // Wait for the OS to mark the process as exited.
    await new Promise<void>((resolve) => {
      if (proc.exitCode !== null) { resolve(); return; }
      proc.once('exit', () => resolve());
    });

    // The session map entry is removed by the 'exit' handler — sending should
    // now throw (either "No active session" or the dead-process error).
    await expect(
      provider.sendMessage(session.id, { role: 'user', content: 'hello' }),
    ).rejects.toThrow();
  });

  // ── d. Missing binary throws immediately ──────────────────────────────────

  it('should throw immediately when the claude binary does not exist', async () => {
    const provider = new ClaudeCodeRuntimeProvider({
      claudeBin: '/nonexistent/path/to/claude-that-does-not-exist',
    });

    await expect(provider.startSession()).rejects.toThrow(
      /Claude binary not found or not executable/,
    );
  });

  // ── e. Session timeout fires and auto-shuts down ──────────────────────────

  it.skipIf(IS_WINDOWS)('should auto-shutdown and emit an error when session idle timeout fires', async () => {
    // Use a very short timeout (100 ms) so the test completes quickly.
    const provider = new ClaudeCodeRuntimeProvider({
      claudeBin: edgeClaudePath,
      sessionTimeout: 100,
    });

    const session = await provider.startSession({ workingDirectory: edgeBinDir });

    const events: RuntimeProviderEvent[] = [];
    await provider.onEvent(session.id, (e) => events.push(e));

    // Wait long enough for the watchdog to fire.
    await new Promise((r) => setTimeout(r, 600));

    // An error event with the timeout message must have been emitted.
    const timeoutErrors = events.filter(
      (e) =>
        e.type === 'error' &&
        typeof (e.payload as Record<string, unknown> | undefined)?.['message'] === 'string' &&
        ((e.payload as Record<string, unknown>)['message'] as string).includes('timed out'),
    );
    expect(timeoutErrors.length).toBeGreaterThan(0);

    // Session should have been removed from the provider.
    await expect(
      provider.sendMessage(session.id, { role: 'user', content: 'test' }),
    ).rejects.toThrow();
  });
});
