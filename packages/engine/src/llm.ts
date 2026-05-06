import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import { submitValidationTool, parseToolResult } from './tool.js';
import type { ValidationResult } from './types.js';

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
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
      tools: [submitValidationTool as Parameters<typeof this.client.messages.create>[0]['tools'][number]],
      tool_choice: { type: 'tool', name: 'submit_validation' },
    });

    const toolUse = response.content.find(b => b.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error('submit_validation tool not called in response');
    }

    return parseToolResult(toolUse.input as Record<string, unknown>);
  }
}

export class FixtureClient implements LlmClient {
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
