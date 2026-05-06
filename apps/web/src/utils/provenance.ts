// apps/web/src/utils/provenance.ts
// Single source of truth for persona field → Vuetify color prop mapping.
// Used by SectionCard.vue to color provenance chips per D-06.
// Field names match PersonaYaml keys from @echomind/engine types.
export const FIELD_COLOR_MAP: Record<string, string> = {
  goals:          'primary',
  pain_points:    'error',
  daily_workflow: 'secondary',
  vocabulary:     'tertiary',
  tech_comfort:   'info',
  pet_peeves:     'warning',
  review_lens:    'success',
};

/**
 * Returns the Vuetify color prop for a persona field name.
 * Falls back to 'surface-variant' for unrecognized field names.
 */
export function chipColor(field: string): string {
  return FIELD_COLOR_MAP[field] ?? 'surface-variant';
}
