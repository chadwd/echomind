import { ref } from 'vue';
// Import only types from @echomind/engine — types are erased at build time,
// so this avoids bundling Node.js-only code (fs/promises, path) into the browser bundle.
import type { ValidationResult, PersonaYaml, GatewayErrorKind } from '@echomind/engine';
// Note: GatewayError is a class (value) from Node.js-only engine code.
// Cannot import as a value in the browser — detect by duck-typing err.name === 'GatewayError'
// and reading err.kind property with a type assertion.

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

// Suppress unused variable warning — gmPersona is used in the live-mode comment
// and represents the typed persona contract even if only replay is supported in browser.
void gmPersona;

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
// The engine package uses Node.js readFile/path which cannot run in the browser.
// For Phase 1 demo: VITE_REPLAY_MODE=true is the primary demo path.
// Phase 2: wire a server-side API endpoint that proxies to the engine.
import fixtureData from '../../../../fixtures/responses/gm-auctions-snapshot.json';

// Determine replay mode from Vite env (browser-safe, no secrets).
const replayMode = import.meta.env['VITE_REPLAY_MODE'] === 'true';

export function useValidator() {
  const isValidating = ref(false);
  const step = ref(0);          // 0=idle, 1-4=stepper steps
  const results = ref<ValidationResult | null>(null);
  const error = ref<string | null>(null);
  const errorKind = ref<GatewayErrorKind | null>(null);

  async function runValidation() {
    if (isValidating.value) return;
    isValidating.value = true;
    results.value = null;
    error.value = null;
    errorKind.value = null;

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
        // Browser-safe replay: load the fixture JSON directly.
        // Engine's FixtureClient uses Node.js readFile — not available in browser.
        // VITE_REPLAY_MODE=true is the demo-day reliability path (D-08).
        await new Promise(r => setTimeout(r, 400)); // simulate brief processing delay
        result = fixtureData as unknown as ValidationResult;
      } else {
        // Live mode: Phase 2 will wire a server-side API endpoint here.
        // The engine package uses Node.js APIs and cannot run directly in the browser.
        // For Phase 1, set VITE_REPLAY_MODE=true for the demo.
        throw new Error(
          'Live gateway mode is not yet supported in the browser. ' +
          'Set VITE_REPLAY_MODE=true in .env.local to run the demo.'
        );
      }

      // Step 4: rendering
      step.value = 4;
      await new Promise(r => setTimeout(r, 200));
      results.value = result;
    } catch (err) {
      if (err instanceof Error && err.name === 'GatewayError') {
        // err is a GatewayError from the engine — read kind via type assertion.
        // Cannot use instanceof (class not importable in browser — Node.js only).
        const gatewayErr = err as Error & { kind: GatewayErrorKind };
        errorKind.value = gatewayErr.kind;
        error.value = err.message;
      } else {
        errorKind.value = 'unknown';
        error.value = err instanceof Error ? err.message : String(err);
      }
    } finally {
      isValidating.value = false;
      // Reset step to 0 after results are shown so stepper hides
      await new Promise(r => setTimeout(r, 500));
      step.value = 0;
    }
  }

  return { isValidating, step, results, error, errorKind, runValidation };
}

// fetchPrdText removed in Plan 01 revision: PRD is loaded via ?raw import above.
// Phase 2: replace live-mode stub with a server-side API endpoint that calls the engine.
// Phase 3: replace the ?raw import with a Confluence/Notion fetch composable.
