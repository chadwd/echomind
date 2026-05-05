import { readFile } from 'fs/promises';
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

  const templatePath = new URL('../../prompts/persona-system-prompt.md', import.meta.url).pathname;
  const template = await readFile(templatePath, 'utf-8');
  const systemPrompt = buildSystemPrompt(persona, template);
  const userMessage  = buildUserMessage(prd);

  return client.complete(systemPrompt, userMessage);
}
