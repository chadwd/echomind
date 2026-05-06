import type { Finding, ValidationResult } from './types.js';

const findingItemSchema = {
  type: 'object' as const,
  properties: {
    text:    { type: 'string' as const },
    sources: { type: 'array' as const, items: { type: 'string' as const } },
  },
  required: ['text', 'sources'] as const,
} as const;

export const submitValidationTool = {
  name: 'submit_validation',
  description: 'Submit the structured persona validation result.',
  input_schema: {
    type: 'object' as const,
    properties: {
      fit:         { type: 'array' as const, items: findingItemSchema },
      friction:    { type: 'array' as const, items: findingItemSchema },
      questions:   { type: 'array' as const, items: findingItemSchema },
      refinements: { type: 'array' as const, items: findingItemSchema },
    },
    required: ['fit', 'friction', 'questions', 'refinements'] as const,
  },
} as const;

export function parseToolResult(input: Record<string, unknown>): ValidationResult {
  return {
    fit:         (input['fit'] as Finding[]) ?? [],
    friction:    (input['friction'] as Finding[]) ?? [],
    questions:   (input['questions'] as Finding[]) ?? [],
    refinements: (input['refinements'] as Finding[]) ?? [],
  };
}
