import { ref } from 'vue';
import type { ValidationResult, PersonaYaml } from '@echomind/engine';

// GM persona hardcoded for Phase 1 (D-14)
// Inlined field-for-field from personas/general-manager.yaml.
// Phase 2 should add build-time YAML-to-TS generation or runtime fetch + parse.
const gmPersona: PersonaYaml = {
  schema_version: 1,
  role: 'General Manager',
  goals: [
    'Hit monthly retail and wholesale volume targets',
    'Keep the lot turning — minimize aging inventory',
    'Maintain CSI scores above regional benchmark',
  ],
  daily_workflow: [
    'Review overnight appraisal queue and approve/adjust prices',
    'Walk the lot with sales manager — check inventory mix',
    'Review CRM pipeline for deals stuck in financing',
    'Follow up on wholesale listings placed the previous day',
    'End-of-day summary meeting with F&I and service managers',
  ],
  pain_points: [
    'Inventory tools that require too many clicks to see the full picture',
    'Delayed appraisal data — by the time it arrives, the market has moved',
    "Reports that don't distinguish retail vs wholesale performance",
  ],
  vocabulary: ['aged units', 'turn rate', 'book out', 'pack', 'floor plan'],
  tech_comfort: 'medium',
  pet_peeves: [
    'Dashboards with too many charts and not enough actionable data',
    'Having to export to Excel just to sort a list',
    "Systems that don't remember my filter preferences",
  ],
  review_lens: [
    'Does this save me time vs what I do today?',
    'Can I get the answer I need in under 3 clicks?',
    'Will my team actually use this, or will they work around it?',
  ],
};

// Load PRD text at build time via Vite ?raw import (no fetch, no fallback).
// The ?raw suffix tells Vite to inline the file as a string literal in the bundle.
// assetsInclude: ['**/*.md'] is already in vite.config.ts (added in Plan 01).
import prdText from '../../../../fixtures/prds/acvmax-auctions.md?raw';

// Fail fast if the import produced an empty or placeholder string
// (guard against bundler misconfiguration).
if (!prdText || prdText.length < 500) {
  throw new Error(
    `[useValidator] prdText is too short (${prdText?.length ?? 0} chars). ` +
    'Check that assetsInclude includes "**/*.md" in vite.config.ts and that ' +
    'fixtures/prds/acvmax-auctions.md exists and is at least 500 chars.'
  );
}

// Import fixture JSON for browser-safe replay mode.
// The engine's FixtureClient uses Node.js readFile which is not available in the browser.
// In VITE_REPLAY_MODE=true, we short-circuit to this import directly.
import fixtureData from '../../../../fixtures/responses/gm-auctions-snapshot.json';

// Determine replay mode from Vite env (browser-safe, no secrets).
const replayMode = import.meta.env['VITE_REPLAY_MODE'] === 'true';

export function useValidator() {
  const isValidating = ref(false);
  const step = ref(0);          // 0=idle, 1-4=stepper steps
  const results = ref<ValidationResult | null>(null);
  const error = ref<string | null>(null);

  async function runValidation() {
    if (isValidating.value) return;
    isValidating.value = true;
    results.value = null;
    error.value = null;

    try {
      // Steps 1 and 2 complete instantly (persona + PRD are pre-loaded)
      step.value = 1;
      await new Promise(r => setTimeout(r, 300)); // brief pause for UX
      step.value = 2;
      await new Promise(r => setTimeout(r, 300));

      // Step 3: gateway call (or fixture replay)
      step.value = 3;

      let result: ValidationResult;

      if (replayMode) {
        // Browser-safe replay: import the fixture JSON directly.
        // Engine's FixtureClient uses Node.js readFile — not available in browser.
        await new Promise(r => setTimeout(r, 400)); // simulate brief network delay
        result = fixtureData as ValidationResult;
      } else {
        // Live mode: validate() calls the Anthropic SDK via the Vite proxy.
        // Note: this requires ECHOMIND_LLM_BASE_URL to be set and the proxy configured.
        // prdText is pre-loaded via ?raw import — no async fetch needed.
        // Lazy import to avoid bundling Node.js deps when not needed
        const { validate } = await import('@echomind/engine');
        result = await validate(gmPersona, prdText, { replay: false });
      }

      // Step 4: rendering
      step.value = 4;
      await new Promise(r => setTimeout(r, 200));
      results.value = result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    } finally {
      isValidating.value = false;
      // Reset step to 0 after results are shown so stepper hides
      await new Promise(r => setTimeout(r, 500));
      step.value = 0;
    }
  }

  return { isValidating, step, results, error, runValidation };
}

// fetchPrdText removed in Plan 01 revision: PRD is loaded via ?raw import above.
// Phase 3: replace the ?raw import with a Confluence/Notion fetch composable.
