/**
 * Runtime Resolver
 *
 * Resolves the active RuntimeProvider based on configuration.
 * Defaults to 'copilot' for backward compatibility.
 */

import type { RuntimeProvider, RuntimeProviderName } from './provider.js';
import { ClaudeCodeRuntimeProvider } from './providers/claude-code-provider.js';

export interface RuntimeResolverConfig {
  /** Which runtime to use. Defaults to 'copilot'. */
  runtime?: RuntimeProviderName;
  /** Options passed to the Claude Code provider. */
  claudeCode?: {
    claudeBin?: string;
    sessionTimeout?: number;
  };
}

const DEFAULT_RUNTIME: RuntimeProviderName = 'copilot';

/**
 * Registry of known provider factories.
 * 'copilot' factory is a placeholder — will be replaced when
 * CopilotRuntimeProvider is extracted in Lane A.
 */
const providerFactories: Record<
  RuntimeProviderName,
  (config: RuntimeResolverConfig) => RuntimeProvider
> = {
  'copilot': (_config) => {
    // TODO: Replace with CopilotRuntimeProvider once extracted (Lane A)
    throw new Error(
      'Copilot runtime provider not yet extracted. ' +
      'Use the existing Copilot integration path until Lane A completes extraction.',
    );
  },
  'claude-code': (config) => {
    return new ClaudeCodeRuntimeProvider({
      claudeBin: config.claudeCode?.claudeBin,
      sessionTimeout: config.claudeCode?.sessionTimeout,
    });
  },
};

/**
 * Resolve and instantiate the configured RuntimeProvider.
 */
export function resolveRuntime(config?: RuntimeResolverConfig): RuntimeProvider {
  const name = config?.runtime ?? DEFAULT_RUNTIME;

  const factory = providerFactories[name];
  if (!factory) {
    throw new Error(
      `Unknown runtime provider: "${name}". ` +
      `Available: ${Object.keys(providerFactories).join(', ')}`,
    );
  }

  return factory(config ?? {});
}

/**
 * Check if a runtime provider name is valid.
 */
export function isValidRuntime(name: string): name is RuntimeProviderName {
  return name in providerFactories;
}

/**
 * List available runtime provider names.
 */
export function listRuntimes(): RuntimeProviderName[] {
  return Object.keys(providerFactories) as RuntimeProviderName[];
}
