import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import type { PersonaYaml } from './types.js';

export async function loadPersona(yamlPath: string): Promise<PersonaYaml> {
  const raw = await readFile(yamlPath, 'utf-8');
  return load(raw) as PersonaYaml;
}
