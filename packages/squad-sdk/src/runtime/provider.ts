/**
 * Runtime Provider abstraction
 *
 * This interface decouples Squad orchestration from a specific runtime client
 * implementation (Copilot today, Claude Code next).
 */

export type RuntimeProviderName = 'copilot' | 'claude-code';

export interface RuntimeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface RuntimeProviderSession {
  id: string;
  provider: RuntimeProviderName;
  model?: string;
}

export interface RuntimeProviderEvent {
  type:
    | 'message.delta'
    | 'message.complete'
    | 'tool.call'
    | 'tool.result'
    | 'error'
    | 'session.started'
    | 'session.ended';
  sessionId: string;
  timestamp: number;
  payload?: unknown;
}

export interface RuntimeStartOptions {
  sessionId?: string;
  model?: string;
  workingDirectory?: string;
  systemPrompt?: string;
}

export interface RuntimeProvider {
  readonly name: RuntimeProviderName;

  startSession(options?: RuntimeStartOptions): Promise<RuntimeProviderSession>;
  sendMessage(sessionId: string, message: RuntimeMessage): Promise<void>;
  onEvent(sessionId: string, handler: (event: RuntimeProviderEvent) => void): Promise<() => void>;
  shutdownSession(sessionId: string): Promise<void>;

  listModels?(): Promise<string[]>;
}
