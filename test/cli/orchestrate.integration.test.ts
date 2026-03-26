import { afterEach, describe, expect, it, vi } from 'vitest';
import { runOrchestrate } from '../../packages/squad-cli/src/cli/commands/orchestrate.ts';

describe('orchestrate (integration)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('submits to /v1/jobs with agenthub contract', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 202,
      json: async () => ({ id: 'job_1', status: 'queued' }),
    }));

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await runOrchestrate(['--prompt', 'hello world', '--url', 'http://localhost:8787']);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('http://localhost:8787/v1/jobs');
    expect((init as RequestInit).method).toBe('POST');
    const body = JSON.parse(String((init as RequestInit).body));
    expect(body.pipe).toBe('agenthub');
    expect(body.parameters.orchestrator).toBe('agenthub');
    expect(body.parameters.agenthubUrl).toBe('http://localhost:8787');
    expect(logSpy).toHaveBeenCalled();
  });
});
