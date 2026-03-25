/**
 * Provider contract test
 *
 * Verifies that both CopilotRuntimeProvider and ClaudeCodeRuntimeProvider
 * satisfy the same RuntimeProvider interface shape.  These tests are
 * intentionally structural — they do NOT require a live CLI or network
 * connection, and they should remain green on all platforms.
 */

import { describe, it, expect } from 'vitest';
import { CopilotRuntimeProvider } from '../../src/runtime/providers/copilot-provider.js';
import { ClaudeCodeRuntimeProvider } from '../../src/runtime/providers/claude-code-provider.js';
import type { RuntimeProvider } from '../../src/runtime/provider.js';

// ── Minimal stubs required to construct CopilotRuntimeProvider ───────────────

function createStubClient() {
  return {
    createSession: async () => ({
      sessionId: 'stub',
      sendMessage: async () => undefined,
      on: () => undefined,
      off: () => undefined,
      close: async () => undefined,
    }),
    listModels: async () => [],
  };
}

// ── Shared contract assertions ────────────────────────────────────────────────

function assertProviderContract(provider: RuntimeProvider, label: string): void {
  describe(`${label} — interface contract`, () => {
    it('has a non-empty "name" property', () => {
      expect(typeof provider.name).toBe('string');
      expect(provider.name.length).toBeGreaterThan(0);
    });

    it('exposes startSession as an async function', () => {
      expect(typeof provider.startSession).toBe('function');
    });

    it('exposes sendMessage as an async function', () => {
      expect(typeof provider.sendMessage).toBe('function');
    });

    it('exposes onEvent as an async function', () => {
      expect(typeof provider.onEvent).toBe('function');
    });

    it('exposes shutdownSession as an async function', () => {
      expect(typeof provider.shutdownSession).toBe('function');
    });

    it('exposes listModels as a function', () => {
      expect(typeof provider.listModels).toBe('function');
    });

    it('listModels() resolves to a non-empty string array', async () => {
      const models = await provider.listModels!();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      for (const m of models) {
        expect(typeof m).toBe('string');
      }
    });
  });
}

// ── Instantiate both providers ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const copilotProvider = new CopilotRuntimeProvider({ client: createStubClient() as any });
const claudeProvider = new ClaudeCodeRuntimeProvider({ claudeBin: 'claude' });

// ── Run contract assertions against each provider ─────────────────────────────

assertProviderContract(copilotProvider, 'CopilotRuntimeProvider');
assertProviderContract(claudeProvider, 'ClaudeCodeRuntimeProvider');

// ── Cross-provider parity checks ─────────────────────────────────────────────

describe('provider parity', () => {
  it('both providers have distinct names', () => {
    expect(copilotProvider.name).not.toBe(claudeProvider.name);
  });

  it('both listModels() return non-overlapping provider-appropriate models', async () => {
    const copilotModels = await copilotProvider.listModels!();
    const claudeModels = await claudeProvider.listModels!();

    // Copilot provider should include at least one GPT model
    expect(copilotModels.some((m) => m.startsWith('gpt'))).toBe(true);

    // Claude provider should include at least one Claude model
    expect(claudeModels.some((m) => m.startsWith('claude'))).toBe(true);
  });
});
