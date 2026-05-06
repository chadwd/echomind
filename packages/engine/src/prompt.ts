import type { PersonaYaml } from './types.js';

function toBullets(arr: string[]): string {
  return arr.map(s => `- ${s}`).join('\n');
}

/**
 * Extract the raw prompt template from persona-system-prompt.md.
 * The file is a markdown document that wraps the actual template in a
 * fenced code block (```). We extract only that inner content so the
 * markdown headers, fences, and notes are not sent to the LLM.
 */
function extractTemplateContent(markdownFile: string): string {
  const match = markdownFile.match(/```\n([\s\S]*?)\n```/);
  if (!match) {
    // Fallback: use the full file (handles plain template files without fences)
    return markdownFile;
  }
  return match[1];
}

export function buildSystemPrompt(persona: PersonaYaml, template: string): string {
  const raw = extractTemplateContent(template);
  return raw
    .replace('{{role}}', persona.role)
    .replace('{{goals as bullets}}', toBullets(persona.goals))
    .replace('{{daily_workflow as bullets}}', toBullets(persona.daily_workflow))
    .replace('{{pain_points as bullets}}', toBullets(persona.pain_points))
    .replace('{{pet_peeves as bullets}}', toBullets(persona.pet_peeves))
    .replace('{{vocabulary as bullets}}', toBullets(persona.vocabulary))
    .replace('{{tech_comfort}}', persona.tech_comfort)
    .replace('{{review_lens as bullets}}', toBullets(persona.review_lens));
}

export function buildUserMessage(prd: string): string {
  return `You are reviewing the following PRD as the persona described above.

Return a structured validation using the submit_validation tool. For each section:
- fit: what this PRD gets right for you
- friction: specific pain points or workflow breaks you foresee
- questions: what you'd need answered before you'd back this feature
- refinements: concrete changes that would address your friction

PRD:
===
${prd}
===`;
}
