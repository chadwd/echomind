import { readFile } from 'fs/promises';
import { join } from 'path';
import { buildSystemPrompt, buildUserMessage } from './prompt.js';
import { createLlmClient } from './llm.js';
import type { PersonaYaml, ValidationResult, ValidateOptions } from './types.js';

export type { PersonaYaml, ValidationResult, ValidateOptions };
export { loadPersona } from './persona.js';
export { buildSystemPrompt } from './prompt.js';

export async function validate(
  persona: PersonaYaml,
  prd: string,
  opts?: ValidateOptions,
): Promise<ValidationResult> {
  const replay = opts?.replay ?? false;
  const client = createLlmClient(replay);

  // Use process.cwd() so the path resolves from the repo root regardless of
  // where the compiled dist/ file lives. import.meta.url would resolve to
  // packages/prompts/ which doesn't exist.
  const templatePath = join(process.cwd(), 'prompts', 'persona-system-prompt.md');
  const template = await readFile(templatePath, 'utf-8');
  const systemPrompt = buildSystemPrompt(persona, template);
  const userMessage  = buildUserMessage(prd);

  return client.complete(systemPrompt, userMessage);
}
