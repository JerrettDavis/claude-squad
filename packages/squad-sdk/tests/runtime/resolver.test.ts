/**
 * Tests for the runtime resolver.
 */

import { describe, it, expect } from 'vitest';
import { resolveRuntime, isValidRuntime, listRuntimes } from '../../src/runtime/resolver.js';
import { ClaudeCodeRuntimeProvider } from '../../src/runtime/providers/claude-code-provider.js';

describe('resolveRuntime', () => {
  it('should resolve claude-code provider', () => {
    const provider = resolveRuntime({ runtime: 'claude-code' });
    expect(provider).toBeInstanceOf(ClaudeCodeRuntimeProvider);
    expect(provider.name).toBe('claude-code');
  });

  it('should throw for copilot until extraction completes', () => {
    expect(() => resolveRuntime({ runtime: 'copilot' })).toThrow(
      'Copilot runtime provider not yet extracted',
    );
  });

  it('should default to copilot when no config provided', () => {
    // Default is copilot, which currently throws until Lane A extraction
    expect(() => resolveRuntime()).toThrow('Copilot runtime provider not yet extracted');
  });

  it('should throw for unknown runtime', () => {
    expect(() =>
      resolveRuntime({ runtime: 'unknown' as any }),
    ).toThrow('Unknown runtime provider: "unknown"');
  });

  it('should pass claude-code options through', () => {
    const provider = resolveRuntime({
      runtime: 'claude-code',
      claudeCode: { claudeBin: '/custom/claude' },
    });
    expect(provider.name).toBe('claude-code');
  });
});

describe('isValidRuntime', () => {
  it('should return true for known runtimes', () => {
    expect(isValidRuntime('copilot')).toBe(true);
    expect(isValidRuntime('claude-code')).toBe(true);
  });

  it('should return false for unknown runtimes', () => {
    expect(isValidRuntime('openai')).toBe(false);
    expect(isValidRuntime('')).toBe(false);
  });
});

describe('listRuntimes', () => {
  it('should return all available runtimes', () => {
    const runtimes = listRuntimes();
    expect(runtimes).toContain('copilot');
    expect(runtimes).toContain('claude-code');
    expect(runtimes.length).toBe(2);
  });
});
