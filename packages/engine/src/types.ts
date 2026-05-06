export interface PersonaYaml {
  schema_version: number;
  role: string;
  goals: string[];
  daily_workflow: string[];
  pain_points: string[];
  vocabulary: string[];
  tech_comfort: 'low' | 'medium' | 'high';
  pet_peeves: string[];
  review_lens: string[];
}

/**
 * A single finding from the validator.
 * sources: persona field names that drove this finding (e.g. ['pain_points', 'review_lens']).
 * Empty array is valid per D-03 — finding is accepted without traced source.
 */
export interface Finding {
  text: string;
  sources: string[];
}

export interface ValidationResult {
  fit: Finding[];
  friction: Finding[];
  questions: Finding[];
  refinements: Finding[];
}

export interface ValidateOptions {
  replay?: boolean;
}
