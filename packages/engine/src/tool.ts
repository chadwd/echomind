import type { ValidationResult } from './types.js';

export const submitValidationTool = {
  name: 'submit_validation',
  description: 'Submit the structured persona validation result.',
  input_schema: {
    type: 'object' as const,
    properties: {
      fit:         { type: 'array', items: { type: 'string' } },
      friction:    { type: 'array', items: { type: 'string' } },
      questions:   { type: 'array', items: { type: 'string' } },
      refinements: { type: 'array', items: { type: 'string' } },
    },
    required: ['fit', 'friction', 'questions', 'refinements'] as const,
  },
} as const;

export function parseToolResult(input: Record<string, unknown>): ValidationResult {
  return {
    fit:         (input['fit'] as string[]) ?? [],
    friction:    (input['friction'] as string[]) ?? [],
    questions:   (input['questions'] as string[]) ?? [],
    refinements: (input['refinements'] as string[]) ?? [],
  };
}
