import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import { submitValidationTool, parseToolResult } from './tool.js';
import type { ValidationResult } from './types.js';

// VALD-05 no-log invariant: this module MUST NOT log systemPrompt, userMessage,
// or any LLM response content. All persona+PRD data stays inside the gateway call.
// Do not add console.log, util.inspect, or debug flags to this file.

export type GatewayErrorKind = 'timeout' | 'auth' | 'rate_limit' | 'unknown';

export class GatewayError extends Error {
  constructor(public readonly kind: GatewayErrorKind, message: string) {
    super(message);
    this.name = 'GatewayError';
  }
}

export interface LlmClient {
  complete(systemPrompt: string, userMessage: string): Promise<ValidationResult>;
}

export class GatewayClient implements LlmClient {
  private client: Anthropic;
  private model: string;

  constructor() {
    const baseURL = process.env['ECHOMIND_LLM_BASE_URL'];
    const apiKey  = process.env['ECHOMIND_LLM_API_KEY'] ?? 'placeholder';
    this.model    = process.env['ECHOMIND_MODEL'] ?? 'claude-sonnet-4-6';

    if (!baseURL) {
      throw new Error('ECHOMIND_LLM_BASE_URL is required. Set it in .env.local');
    }

    this.client = new Anthropic({ baseURL, apiKey });
  }

  async complete(systemPrompt: string, userMessage: string): Promise<ValidationResult> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
        tools: [submitValidationTool as unknown as Parameters<typeof this.client.messages.create>[0] extends { tools?: (infer T)[] } ? T : never],
        tool_choice: { type: 'tool', name: 'submit_validation' },
      });

      const toolUse = response.content.find(b => b.type === 'tool_use');
      if (!toolUse || toolUse.type !== 'tool_use') {
        throw new GatewayError('unknown', 'submit_validation tool not called in response');
      }

      return parseToolResult(toolUse.input as Record<string, unknown>);
    } catch (err) {
      // Re-throw GatewayErrors as-is (already classified)
      if (err instanceof GatewayError) throw err;

      // Classify Anthropic SDK APIErrors by HTTP status
      if (err instanceof Error) {
        const status = (err as { status?: number }).status;
        const code   = (err as { code?: string }).code;
        const msg    = err.message;

        if (status === 401 || status === 403) {
          throw new GatewayError('auth', `Authentication failed (HTTP ${status}): ${msg}`);
        }
        if (status === 429) {
          throw new GatewayError('rate_limit', `Rate limit exceeded: ${msg}`);
        }
        if (code === 'ETIMEDOUT' || code === 'ECONNRESET' || msg.toLowerCase().includes('timeout')) {
          throw new GatewayError('timeout', `Gateway timed out: ${msg}`);
        }
        throw new GatewayError('unknown', msg);
      }

      throw new GatewayError('unknown', String(err));
    }
  }
}

export class FixtureClient implements LlmClient {
  // VALD-05: FixtureClient reads a pre-captured JSON file. No persona+PRD content is logged.
  private fixturePath: string;

  constructor(fixturePath = 'fixtures/responses/gm-auctions-snapshot.json') {
    this.fixturePath = fixturePath;
  }

  async complete(_systemPrompt: string, _userMessage: string): Promise<ValidationResult> {
    const raw = await readFile(this.fixturePath, 'utf-8');
    return JSON.parse(raw) as ValidationResult;
  }
}

export function createLlmClient(replay: boolean): LlmClient {
  if (replay || process.env['ECHOMIND_REPLAY'] === 'true') {
    return new FixtureClient();
  }
  return new GatewayClient();
}
