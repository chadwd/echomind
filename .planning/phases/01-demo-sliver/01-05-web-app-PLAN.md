---
phase: 01-demo-sliver
plan: 05
type: execute
wave: 4
depends_on:
  - 01-04-fixture-snapshot
files_modified:
  - apps/web/src/App.vue
  - apps/web/src/components/InputPane.vue
  - apps/web/src/components/ResultsPane.vue
  - apps/web/src/components/SectionCard.vue
  - apps/web/src/composables/useValidator.ts
autonomous: true
requirements_addressed:
  - WEB-01
  - WEB-04
  - WEB-05
  - DEMO-01

must_haves:
  truths:
    - "Opening http://localhost:5173 shows EchoMind app bar, input pane with disabled persona/PRD fields, and enabled Validate button"
    - "Clicking Validate triggers the VStepper progress (4 steps), then renders four section cards"
    - "Each section card shows the section title and bullet list of findings from the ValidationResult"
    - "VITE_REPLAY_MODE=true makes the validation instant (no live gateway call)"
    - "Layout is two-column: 360px input pane left, flex results pane right"
    - "Per-finding persona-field provenance UI is deferred to Phase 2 (VALD-03). Phase 1 satisfies the 4-section rendering portion of WEB-05; provenance rows in SectionCard are intentionally absent."
    - "The inlined gmPersona object in useValidator.ts is verified field-for-field against personas/general-manager.yaml. Drift is a known Phase 1 tradeoff; Phase 2 should add build-time YAML-to-TS generation or runtime fetch + parse."
  artifacts:
    - path: "apps/web/src/components/InputPane.vue"
      provides: "VCard with VSelect (persona), VTextField (PRD), VBtn (Validate)"
    - path: "apps/web/src/components/ResultsPane.vue"
      provides: "VStepper while validating, VRow/VCol with four SectionCard when done"
    - path: "apps/web/src/components/SectionCard.vue"
      provides: "VCard with VCardTitle + VList of finding bullets per section"
    - path: "apps/web/src/composables/useValidator.ts"
      provides: "isValidating, step, results reactive state + runValidation() function"
  key_links:
    - from: "apps/web/src/components/InputPane.vue VBtn"
      to: "apps/web/src/composables/useValidator.ts runValidation()"
      via: "@click emit or prop call"
      pattern: "runValidation"
    - from: "apps/web/src/composables/useValidator.ts"
      to: "@echomind/engine validate()"
      via: "import { validate } from '@echomind/engine'"
      pattern: "validate\\("
    - from: "apps/web/src/components/ResultsPane.vue"
      to: "apps/web/src/components/SectionCard.vue"
      via: "v-for on sections array, passes title+items props"
      pattern: "SectionCard"
---

<objective>
Build the complete Vue 3 + Vuetify single-page web app: InputPane, ResultsPane, SectionCard components, useValidator composable, and wire everything to the engine. The demo flow must work end-to-end in the browser.

Purpose: This is the web surface demo. Follows the UI-SPEC exactly. Depends on the engine being proven (Plan 03/04).

Output:
- pnpm --filter @echomind/web dev serves on port 5173
- Full demo flow works: open app → click Validate → see stepper → see four section cards
- Replay mode (VITE_REPLAY_MODE=true) works for demo-day reliability
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/01-demo-sliver/01-UI-SPEC.md
@.planning/phases/01-demo-sliver/01-CONTEXT.md
@.planning/phases/01-demo-sliver/01-RESEARCH.md
@.planning/phases/01-demo-sliver/01-01-monorepo-scaffold-SUMMARY.md
@.planning/phases/01-demo-sliver/01-04-fixture-snapshot-SUMMARY.md

<interfaces>
<!-- Engine API consumed by useValidator.ts -->
```typescript
// From @echomind/engine
import { validate, loadPersona } from '@echomind/engine';
import type { ValidationResult, PersonaYaml } from '@echomind/engine';

// validate() signature:
async function validate(
  persona: PersonaYaml,
  prd: string,
  opts?: { replay?: boolean }
): Promise<ValidationResult>
```

<!-- ValidationResult shape rendered by SectionCard -->
```typescript
interface ValidationResult {
  fit: string[];
  friction: string[];
  questions: string[];
  refinements: string[];
}
```

<!-- UI-SPEC component inventory — use EXACTLY these -->
InputPane:
  - VSelect: disabled, items=['General Manager'], label='Persona', prepend-inner-icon='mdi-account'
  - VTextField: disabled, model-value='ACV MAX Auctions Integration', label='PRD', prepend-inner-icon='mdi-file-document'
  - VBtn: color='primary', size='large', block, text='Validate'
  - Container: VCard variant='outlined', rounded='lg'

Progress (while validating):
  - VStepper with 4 VStepperItem:
    Step 1: 'Loading persona' — completes instantly on click
    Step 2: 'Loading PRD' — completes instantly on click
    Step 3: 'Calling validator' — active during gateway call
    Step 4: 'Rendering output' — completes as sections mount

Results (when done):
  - VRow + VCol grid: 2-column on md+, 1-column on sm
  - Four VCard components (one per section), variant='elevated', elevation=2
  - VCardTitle: section name ('Fit', 'Friction', 'Questions', 'Refinements'), class='text-h6'
  - VCardText > VList > VListItem per finding bullet
  - Section icons: Fit=mdi-check-bold, Friction=mdi-alert, Questions=mdi-comment-question, Refinements=mdi-pencil

Empty state (initial load):
  - Heading: 'Ready to validate' (text-h6)
  - Body: 'Select a persona and PRD above, then click Validate to see the structured take-away.' (text-body-2)
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: useValidator composable + InputPane component</name>
  <files>
    apps/web/src/composables/useValidator.ts
    apps/web/src/components/InputPane.vue
  </files>

  <read_first>
    - apps/web/src/main.ts — confirm @echomind/engine is available as workspace dep
    - .planning/phases/01-demo-sliver/01-UI-SPEC.md — §Component Inventory (Input Pane), §Interaction States, §Copywriting Contract
    - .planning/phases/01-demo-sliver/01-CONTEXT.md — D-14 (layout + disabled inputs), D-15 (staged progress), D-16 (Validate button trigger)
    - .planning/phases/01-demo-sliver/01-RESEARCH.md — §Vue 3 + Vuetify Scaffold (useValidator state)
  </read_first>

  <action>
Create the useValidator composable and InputPane component.

**apps/web/src/composables/useValidator.ts:**

```typescript
import { ref } from 'vue';
import { validate } from '@echomind/engine';
import type { ValidationResult, PersonaYaml } from '@echomind/engine';

// GM persona hardcoded for Phase 1 (D-14)
// Import directly — Vite can bundle JSON/YAML with the right plugin,
// but for simplicity in Phase 1, inline the GM persona object:
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

// Load PRD text at build time via Vite ?raw import (no fetch, no fallback)
// The ?raw suffix tells Vite to inline the file as a string literal in the bundle.
// Requires assetsInclude: ['**/*.md'] in vite.config.ts (added in Plan 01).
import prdText from '../../../fixtures/prds/acvmax-auctions.md?raw';

// Fail fast if the import produced an empty or placeholder string (guard against bundler misconfiguration)
if (!prdText || prdText.length < 500) {
  throw new Error(
    `[useValidator] prdText is too short (${prdText?.length ?? 0} chars). ` +
    'Check that assetsInclude includes "**/*.md" in vite.config.ts and that ' +
    'fixtures/prds/acvmax-auctions.md exists and is at least 500 chars.'
  );
}

// Determine replay mode from Vite env (browser-safe, no secrets)
const replayMode = import.meta.env['VITE_REPLAY_MODE'] === 'true';

export function useValidator() {
  const isValidating = ref(false);
  const step = ref(0);          // 0=idle, 1-4=stepper steps
  const results = ref<ValidationResult | null>(null);

  async function runValidation() {
    if (isValidating.value) return;
    isValidating.value = true;
    results.value = null;

    try {
      // Steps 1 and 2 complete instantly (persona + PRD are pre-loaded)
      step.value = 1;
      await new Promise(r => setTimeout(r, 300)); // brief pause for UX
      step.value = 2;
      await new Promise(r => setTimeout(r, 300));

      // Step 3: gateway call (or fixture replay)
      step.value = 3;
      // prdText is pre-loaded via ?raw import above — no async fetch needed
      const result = await validate(gmPersona, prdText, { replay: replayMode });

      // Step 4: rendering
      step.value = 4;
      await new Promise(r => setTimeout(r, 200));
      results.value = result;
    } finally {
      isValidating.value = false;
      // Reset step to 0 after results are shown so stepper hides
      await new Promise(r => setTimeout(r, 500));
      step.value = 0;
    }
  }

  return { isValidating, step, results, runValidation };
}

// fetchPrdText removed in Plan 01 revision: PRD is loaded via ?raw import above.
// Phase 3: replace the ?raw import with a Confluence/Notion fetch composable.
```

Note: The PRD is loaded via `?raw` import (NOT via fetch). This is the required approach for Phase 1:
- `assetsInclude: ['**/*.md']` is already in vite.config.ts (added in Plan 01)
- The import path must be relative from `apps/web/src/composables/` to the repo root `fixtures/` dir
- Relative path: `'../../../fixtures/prds/acvmax-auctions.md?raw'` (composables/ → src/ → web/ → echomind/)
- Verify: `grep "?raw" apps/web/src/composables/useValidator.ts` must return a match
- The `PRD_TEXT_PLACEHOLDER` fallback has been REMOVED — fail fast is better than silent garbage to gateway

**apps/web/src/components/InputPane.vue:**

```vue
<template>
  <v-card variant="outlined" rounded="lg" class="pa-6 h-100">
    <v-card-title class="text-h6 font-weight-semibold pa-0 mb-6">
      Configure
    </v-card-title>

    <div class="d-flex flex-column ga-4">
      <!-- Persona selector (D-14: real VSelect, disabled, single GM item) -->
      <v-select
        :model-value="'General Manager'"
        :items="['General Manager']"
        label="Persona"
        prepend-inner-icon="mdi-account"
        disabled
        variant="outlined"
        density="comfortable"
      />

      <!-- PRD display (D-14: disabled text field showing demo PRD title) -->
      <v-text-field
        model-value="ACV MAX Auctions Integration"
        label="PRD"
        prepend-inner-icon="mdi-file-document"
        disabled
        variant="outlined"
        density="comfortable"
      />

      <!-- Validate button — the sole active CTA (UI-SPEC: full-width, large, primary fill) -->
      <v-btn
        color="primary"
        size="large"
        block
        :loading="isValidating"
        @click="$emit('validate')"
      >
        Validate
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  isValidating: boolean;
}>();

defineEmits<{
  (e: 'validate'): void;
}>();
</script>
```
  </action>

  <verify>
    <automated>cd /Users/cdunbar/Repos/echomind && grep -n "runValidation\|isValidating\|step\|results" apps/web/src/composables/useValidator.ts | head -20</automated>
  </verify>

  <acceptance_criteria>
    - apps/web/src/composables/useValidator.ts exports useValidator() function
    - useValidator.ts imports `validate` from `@echomind/engine`
    - useValidator.ts contains `import.meta.env['VITE_REPLAY_MODE']` for replay toggle
    - useValidator.ts defines isValidating, step (0-4), results as Vue refs
    - grep "?raw" apps/web/src/composables/useValidator.ts returns a match (PRD loaded via ?raw import)
    - grep "PRD_TEXT_PLACEHOLDER" apps/web/src/composables/useValidator.ts returns NOTHING (fallback removed)
    - useValidator.ts contains a runtime assertion that throws if prdText.length < 500
    - Manual diff: every top-level key in personas/general-manager.yaml exists in the gmPersona object in useValidator.ts (verified during code review — drift is a known Phase 1 tradeoff)
    - apps/web/src/components/InputPane.vue contains VSelect with `items="['General Manager']"` and `disabled` prop
    - InputPane.vue contains VTextField with `model-value="ACV MAX Auctions Integration"` and `disabled`
    - InputPane.vue contains VBtn with `color="primary"`, `size="large"`, `block`, text "Validate"
    - InputPane.vue emits 'validate' on button click
    - InputPane.vue does NOT use hard-coded raw API keys or secrets
  </acceptance_criteria>

  <done>useValidator composable manages validation state. InputPane renders disabled persona/PRD fields and primary Validate button that emits to parent.</done>
</task>

<task type="auto">
  <name>Task 2: ResultsPane + SectionCard + wire App.vue</name>
  <files>
    apps/web/src/components/ResultsPane.vue
    apps/web/src/components/SectionCard.vue
    apps/web/src/App.vue
  </files>

  <read_first>
    - apps/web/src/App.vue — read current state (shell from Plan 01); replace placeholder columns with real components
    - apps/web/src/composables/useValidator.ts — confirm exports (isValidating, step, results, runValidation)
    - apps/web/src/components/InputPane.vue — confirm props/emits interface
    - .planning/phases/01-demo-sliver/01-UI-SPEC.md — §Component Inventory (Results Pane), §Interaction States, §Copywriting Contract (empty state copy, section titles)
    - .planning/phases/01-demo-sliver/01-CONTEXT.md — D-15 (stepper steps), D-16 (demo flow)
  </read_first>

  <action>
Create ResultsPane and SectionCard, then wire App.vue to use all three components via useValidator.

**apps/web/src/components/SectionCard.vue:**

```vue
<template>
  <v-card variant="elevated" :elevation="2" rounded="lg" class="h-100">
    <v-card-title class="text-h6 d-flex align-center ga-2 pt-4 px-4">
      <v-icon :icon="icon" size="20" />
      {{ title }}
    </v-card-title>
    <v-card-text>
      <v-list density="compact" lines="two">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :title="item"
          class="text-body-2 px-0"
        />
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
  items: string[];
}>();
</script>
```

**apps/web/src/components/ResultsPane.vue:**

```vue
<template>
  <div class="h-100">
    <!-- Empty state -->
    <div
      v-if="!isValidating && !results"
      class="d-flex flex-column align-center justify-center h-100 text-center"
      style="min-height: 300px"
    >
      <v-icon icon="mdi-lightning-bolt-outline" size="48" color="surface-variant" class="mb-4" />
      <div class="text-h6 font-weight-semibold mb-2">Ready to validate</div>
      <div class="text-body-2 text-medium-emphasis">
        Select a persona and PRD above, then click Validate to see the structured take-away.
      </div>
    </div>

    <!-- Stepper: visible while validating (D-15) -->
    <v-stepper
      v-else-if="isValidating"
      :model-value="step"
      non-linear
      flat
      class="bg-transparent"
    >
      <v-stepper-item
        :value="1"
        title="Loading persona"
        :complete="step > 1"
        :color="step > 1 ? 'success' : 'primary'"
        :complete-icon="step > 1 ? 'mdi-check-circle' : undefined"
      />
      <v-stepper-item
        :value="2"
        title="Loading PRD"
        :complete="step > 2"
        :color="step > 2 ? 'success' : 'primary'"
        :complete-icon="step > 2 ? 'mdi-check-circle' : undefined"
      />
      <v-stepper-item
        :value="3"
        title="Calling validator"
        :complete="step > 3"
        :color="step > 3 ? 'success' : 'primary'"
        :complete-icon="step > 3 ? 'mdi-check-circle' : undefined"
      />
      <v-stepper-item
        :value="4"
        title="Rendering output"
        :complete="step > 4"
        :color="step > 4 ? 'success' : 'primary'"
        :complete-icon="step > 4 ? 'mdi-check-circle' : undefined"
      />
    </v-stepper>

    <!-- Results: four section cards in 2-column grid (UI-SPEC: md+ = 2col, sm = 1col) -->
    <v-row v-else-if="results" class="ga-0">
      <v-col
        v-for="section in sections"
        :key="section.key"
        cols="12"
        md="6"
        class="pa-2"
      >
        <SectionCard
          :title="section.title"
          :icon="section.icon"
          :items="results[section.key]"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { ValidationResult } from '@echomind/engine';
import SectionCard from './SectionCard.vue';

defineProps<{
  isValidating: boolean;
  step: number;
  results: ValidationResult | null;
}>();

const sections: Array<{
  key: keyof ValidationResult;
  title: string;
  icon: string;
}> = [
  { key: 'fit',         title: 'Fit',         icon: 'mdi-check-bold' },
  { key: 'friction',    title: 'Friction',    icon: 'mdi-alert' },
  { key: 'questions',   title: 'Questions',   icon: 'mdi-comment-question' },
  { key: 'refinements', title: 'Refinements', icon: 'mdi-pencil' },
];
</script>
```

**apps/web/src/App.vue** — wire everything together (replace placeholder content from Plan 01):

```vue
<template>
  <v-app>
    <v-app-bar elevation="1" color="surface">
      <v-app-bar-title class="text-h5 font-weight-semibold">EchoMind</v-app-bar-title>
    </v-app-bar>

    <v-main style="background: rgb(var(--v-theme-surface))">
      <v-container fluid class="pa-6" style="height: calc(100vh - 64px)">
        <v-row style="height: 100%" no-gutters class="ga-8">
          <!-- Input pane — 360px fixed width (UI-SPEC) -->
          <v-col style="max-width: 360px; flex: 0 0 360px;">
            <InputPane
              :is-validating="isValidating"
              @validate="runValidation"
            />
          </v-col>

          <!-- Results pane — flex-grow fills remaining width -->
          <v-col>
            <ResultsPane
              :is-validating="isValidating"
              :step="step"
              :results="results"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useValidator } from './composables/useValidator';
import InputPane from './components/InputPane.vue';
import ResultsPane from './components/ResultsPane.vue';

const { isValidating, step, results, runValidation } = useValidator();
</script>
```

After creating all files, run `pnpm --filter @echomind/web dev` and verify the app loads on http://localhost:5173.
  </action>

  <verify>
    <automated>cd /Users/cdunbar/Repos/echomind && pnpm --filter @echomind/web build 2>&1 | tail -10</automated>
  </verify>

  <acceptance_criteria>
    - apps/web/src/components/SectionCard.vue defines props: title (string), icon (string), items (string[])
    - apps/web/src/components/SectionCard.vue uses VCard with variant="elevated" and :elevation="2"
    - apps/web/src/components/SectionCard.vue uses VList + VListItem to render items array
    - apps/web/src/components/ResultsPane.vue imports SectionCard and renders it in v-for over 4 sections
    - ResultsPane.vue contains v-stepper with 4 v-stepper-item elements
    - ResultsPane.vue contains empty state with text "Ready to validate"
    - ResultsPane.vue contains empty state body with "Select a persona and PRD above, then click Validate to see the structured take-away."
    - apps/web/src/App.vue imports useValidator, InputPane, ResultsPane
    - App.vue passes :is-validating, :step, :results to ResultsPane
    - App.vue listens to @validate event from InputPane and calls runValidation
    - pnpm --filter @echomind/web build exits 0 (TypeScript clean)
  </acceptance_criteria>

  <done>All three components wired. App builds clean. Demo flow navigable in browser: load → click Validate → stepper → four section cards.</done>
</task>

</tasks>

<verification>
```bash
# Build check
cd /Users/cdunbar/Repos/echomind && pnpm --filter @echomind/web build 2>&1 | grep -E "error|warning|built in"

# Component files exist
ls apps/web/src/components/ && ls apps/web/src/composables/

# Key wiring present
grep -n "runValidation\|useValidator" apps/web/src/App.vue
grep -n "validate\|@echomind/engine" apps/web/src/composables/useValidator.ts
grep -n "VITE_REPLAY_MODE" apps/web/src/composables/useValidator.ts

# No secrets in web source
grep -r "ECHOMIND_LLM_API_KEY\|sk-ant-" apps/web/src/ && echo "FAIL: secret in web source" || echo "PASS: no secrets"
```
</verification>

<success_criteria>
- pnpm --filter @echomind/web build exits 0 with no TypeScript errors
- pnpm --filter @echomind/web dev starts on port 5173 without errors
- App renders: EchoMind app bar, input pane with disabled controls, Validate button enabled
- Clicking Validate: stepper progresses through 4 steps, four section cards render with results
- VITE_REPLAY_MODE=true returns fixture output (no gateway call)
- No secrets or API keys appear in browser-bundled code
</success_criteria>

<output>
After completion, create `.planning/phases/01-demo-sliver/01-05-web-app-SUMMARY.md`. Include: Vite build output (stats line), screenshot description of the working UI, any deviations from UI-SPEC (e.g., stepper API differences in Vuetify 3), and confirmation that replay mode works.
</output>
