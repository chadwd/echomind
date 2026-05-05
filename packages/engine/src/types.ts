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

export interface ValidationResult {
  fit: string[];
  friction: string[];
  questions: string[];
  refinements: string[];
}

export interface ValidateOptions {
  replay?: boolean;
}
