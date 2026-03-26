import { describe, expect, it } from 'vitest';
import { parseOrchestrateArgs } from '../../packages/squad-cli/src/cli/commands/orchestrate.ts';

describe('orchestrate (unit)', () => {
  it('parses prompt/url/wait flags', () => {
    const parsed = parseOrchestrateArgs([
      '--prompt',
      'build feature x',
      '--url',
      'http://localhost:9999/',
      '--wait',
    ]);

    expect(parsed.prompt).toBe('build feature x');
    expect(parsed.url).toBe('http://localhost:9999');
    expect(parsed.wait).toBe(true);
    expect(parsed.pipe).toBe('agenthub');
    expect(parsed.orchestrator).toBe('agenthub');
  });

  it('accepts positional prompt', () => {
    const parsed = parseOrchestrateArgs(['ship-this']);
    expect(parsed.prompt).toBe('ship-this');
  });
});
