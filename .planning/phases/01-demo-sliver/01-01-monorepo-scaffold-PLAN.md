---
phase: 01-demo-sliver
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - pnpm-workspace.yaml
  - .npmrc
  - tsconfig.base.json
  - packages/engine/package.json
  - packages/engine/tsconfig.json
  - packages/engine/tsup.config.ts
  - packages/engine/src/types.ts
  - packages/engine/src/persona.ts
  - packages/engine/src/tool.ts
  - packages/engine/src/prompt.ts
  - packages/engine/src/llm.ts
  - packages/engine/src/index.ts
  - packages/engine/bin/echomind-validate.ts
  - apps/web/package.json
  - apps/web/tsconfig.json
  - apps/web/index.html
  - apps/web/vite.config.ts
  - apps/web/src/main.ts
  - apps/web/src/App.vue
autonomous: true
requirements_addressed:
  - PERS-01
  - PERS-03
  - VALD-01
  - VALD-02
  - LLM-01
  - LLM-02
  - WEB-01

must_haves:
  truths:
    - "pnpm install succeeds at repo root with no errors"
    - "pnpm build (engine) produces dist/ with compiled JS"
    - "The engine exposes validate() and ValidationResult as public exports"
    - "The web app dev server starts on port 5173 without errors"
    - "All gateway LLM calls go through ECHOMIND_LLM_BASE_URL — no hardcoded anthropic.com URLs"
  artifacts:
    - path: "pnpm-workspace.yaml"
      provides: "workspace config declaring packages/* and apps/*"
      contains: "packages/*"
    - path: "packages/engine/src/types.ts"
      provides: "ValidationResult and PersonaYaml type definitions"
      exports:
        - "ValidationResult"
        - "PersonaYaml"
    - path: "packages/engine/src/index.ts"
      provides: "validate() public entrypoint"
      exports:
        - "validate"
        - "loadPersona"
        - "ValidationResult"
    - path: "packages/engine/bin/echomind-validate.ts"
      provides: "CLI binary for skill invocation"
    - path: "apps/web/src/main.ts"
      provides: "Vue 3 + Vuetify app bootstrap"
  key_links:
    - from: "packages/engine/src/index.ts"
      to: "packages/engine/src/llm.ts"
      via: "LlmClient interface + GatewayClient/FixtureClient factory"
      pattern: "ECHOMIND_LLM_BASE_URL"
    - from: "packages/engine/src/prompt.ts"
      to: "prompts/persona-system-prompt.md"
      via: "readFile at runtime — buildSystemPrompt(persona, template)"
      pattern: "buildSystemPrompt"
    - from: "apps/web"
      to: "@echomind/engine"
      via: "pnpm workspace protocol"
      pattern: "workspace:*"
---

<objective>
Bootstrap the pnpm monorepo and implement the complete engine package skeleton — types, persona loader, tool schema, prompt renderer, LLM adapter interface, and the validate() entrypoint.

Purpose: The engine is the critical path for both surfaces. Day 1 morning priority. Web scaffold is included here (shell only, no validator call yet) so apps/web/ exists for Plan 05 to build on.

Output:
- Working pnpm workspace at repo root
- @echomind/engine package with full type-correct implementation skeleton
- apps/web/ Vue 3 + Vuetify shell (App.vue renders app bar + placeholder layout)
- pnpm build produces dist/; pnpm --filter @echomind/web dev serves on 5173
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/01-demo-sliver/01-CONTEXT.md
@.planning/phases/01-demo-sliver/01-RESEARCH.md
@.planning/phases/01-demo-sliver/01-UI-SPEC.md

<interfaces>
<!-- Key types from RESEARCH.md — implement these exactly -->

PersonaYaml (from personas/_template.yaml + RESEARCH.md):
```typescript
interface PersonaYaml {
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
```

ValidationResult (from RESEARCH.md §Validator Output Schema):
```typescript
export interface ValidationResult {
  fit: string[];
  friction: string[];
  questions: string[];
  refinements: string[];
}
```

LlmClient interface (from RESEARCH.md §ACV LLM Gateway Integration):
```typescript
export interface LlmClient {
  complete(systemPrompt: string, userMessage: string): Promise<ValidationResult>;
}
```

validate() public API (from CONTEXT.md D-04, RESEARCH.md §Engine / Library Shape):
```typescript
export async function validate(
  persona: PersonaYaml,
  prd: string,
  opts?: ValidateOptions
): Promise<ValidationResult>

export interface ValidateOptions {
  replay?: boolean;
}
```

Tool schema (from RESEARCH.md §Validator Output Schema):
```typescript
const submitValidationTool = {
  name: 'submit_validation',
  description: 'Submit the structured persona validation result.',
  input_schema: {
    type: 'object',
    properties: {
      fit:          { type: 'array', items: { type: 'string' } },
      friction:     { type: 'array', items: { type: 'string' } },
      questions:    { type: 'array', items: { type: 'string' } },
      refinements:  { type: 'array', items: { type: 'string' } },
    },
    required: ['fit', 'friction', 'questions', 'refinements'],
  },
};
```

Prompt renderer (from RESEARCH.md §Prompt Construction):
```typescript
export function buildSystemPrompt(persona: PersonaYaml, template: string): string {
  return template
    .replace('{{role}}', persona.role)
    .replace('{{goals as bullets}}', toBullets(persona.goals))
    .replace('{{daily_workflow as bullets}}', toBullets(persona.daily_workflow))
    .replace('{{pain_points as bullets}}', toBullets(persona.pain_points))
    .replace('{{pet_peeves as bullets}}', toBullets(persona.pet_peeves))
    .replace('{{vocabulary as bullets}}', toBullets(persona.vocabulary))
    .replace('{{tech_comfort}}', persona.tech_comfort)
    .replace('{{review_lens as bullets}}', toBullets(persona.review_lens));
}

function toBullets(arr: string[]): string {
  return arr.map(s => `- ${s}`).join('\n');
}
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: pnpm monorepo root + engine package scaffold</name>
  <files>
    package.json
    pnpm-workspace.yaml
    .npmrc
    tsconfig.base.json
    packages/engine/package.json
    packages/engine/tsconfig.json
    packages/engine/tsup.config.ts
    packages/engine/src/types.ts
    packages/engine/src/persona.ts
    packages/engine/src/tool.ts
    packages/engine/src/prompt.ts
    packages/engine/src/llm.ts
    packages/engine/src/index.ts
    packages/engine/bin/echomind-validate.ts
  </files>

  <read_first>
    - personas/_template.yaml — canonical schema; derive PersonaYaml fields from this
    - personas/general-manager.yaml — verify fields match template
    - prompts/persona-system-prompt.md — template tokens the engine renders
    - .planning/phases/01-demo-sliver/01-RESEARCH.md — §Engine / Library Shape, §ACV LLM Gateway Integration, §Prompt Construction, §Validator Output Schema
    - .planning/phases/01-demo-sliver/01-CONTEXT.md — D-01, D-02, D-03, D-04, D-06, D-07, D-09
  </read_first>

  <action>
Create the pnpm monorepo root and full engine package with all source files. Follow these exact specifications:

**Root package.json** — name: "echomind-workspace", private: true. Scripts:
```json
{
  "name": "echomind-workspace",
  "private": true,
  "scripts": {
    "build": "pnpm --filter @echomind/engine build",
    "dev:web": "pnpm --filter @echomind/web dev",
    "test": "pnpm --filter @echomind/engine test"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

**pnpm-workspace.yaml:**
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

**.npmrc:**
```
shamefully-hoist=false
strict-peer-dependencies=false
```

**tsconfig.base.json** (strict TS, no emit, ESNext target):
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

**packages/engine/package.json:**
```json
{
  "name": "@echomind/engine",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "bin": {
    "echomind-validate": "./dist/bin/echomind-validate.js"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "commander": "^12.0.0",
    "js-yaml": "^4.1.0"
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.0",
    "@types/node": "^20.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.4.0",
    "vitest": "^1.0.0"
  }
}
```

**packages/engine/tsup.config.ts:**
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'bin/echomind-validate': 'bin/echomind-validate.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'node20',
});
```

**packages/engine/tsconfig.json:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["src/**/*", "bin/**/*"]
}
```

**packages/engine/src/types.ts** — export all shared types:
```typescript
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
```

**packages/engine/src/persona.ts** — YAML loader:
```typescript
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import type { PersonaYaml } from './types.js';

export async function loadPersona(yamlPath: string): Promise<PersonaYaml> {
  const raw = await readFile(yamlPath, 'utf-8');
  return load(raw) as PersonaYaml;
}
```

**packages/engine/src/tool.ts** — Anthropic tool schema and output parser:
```typescript
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
```

**packages/engine/src/prompt.ts** — system prompt renderer:
```typescript
import type { PersonaYaml } from './types.js';

function toBullets(arr: string[]): string {
  return arr.map(s => `- ${s}`).join('\n');
}

export function buildSystemPrompt(persona: PersonaYaml, template: string): string {
  return template
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
```

**packages/engine/src/llm.ts** — LlmClient interface + GatewayClient + FixtureClient:
```typescript
import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import { submitValidationTool, parseToolResult } from './tool.js';
import type { ValidationResult } from './types.js';

export interface LlmClient {
  complete(systemPrompt: string, userMessage: string): Promise<ValidationResult>;
}

export class GatewayClient implements LlmClient {
  private client: Anthropic;
  private model: string;

  constructor() {
    const baseURL = process.env['ECHOMIND_LLM_BASE_URL'];
    const apiKey  = process.env['ECHOMIND_LLM_API_KEY'] ?? 'placeholder';
    this.model    = process.env['ECHOMIND_MODEL'] ?? 'claude-sonnet-4-6';

    if (!baseURL) {
      throw new Error('ECHOMIND_LLM_BASE_URL is required. Set it in .env.local');
    }

    this.client = new Anthropic({ baseURL, apiKey });
  }

  async complete(systemPrompt: string, userMessage: string): Promise<ValidationResult> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
      tools: [submitValidationTool as Parameters<typeof this.client.messages.create>[0]['tools'][number]],
      tool_choice: { type: 'tool', name: 'submit_validation' },
    });

    const toolUse = response.content.find(b => b.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error('submit_validation tool not called in response');
    }

    return parseToolResult(toolUse.input as Record<string, unknown>);
  }
}

export class FixtureClient implements LlmClient {
  private fixturePath: string;

  constructor(fixturePath = 'fixtures/responses/gm-auctions-snapshot.json') {
    this.fixturePath = fixturePath;
  }

  async complete(_systemPrompt: string, _userMessage: string): Promise<ValidationResult> {
    const raw = await readFile(this.fixturePath, 'utf-8');
    return JSON.parse(raw) as ValidationResult;
  }
}

export function createLlmClient(replay: boolean): LlmClient {
  if (replay || process.env['ECHOMIND_REPLAY'] === 'true') {
    return new FixtureClient();
  }
  return new GatewayClient();
}
```

**packages/engine/src/index.ts** — public entrypoint wiring everything:
```typescript
import { readFile } from 'fs/promises';
import { buildSystemPrompt, buildUserMessage } from './prompt.js';
import { createLlmClient } from './llm.js';
import type { PersonaYaml, ValidationResult, ValidateOptions } from './types.js';

export type { PersonaYaml, ValidationResult, ValidateOptions };
export { loadPersona } from './persona.js';
export { buildSystemPrompt } from './prompt.js';

export async function validate(
  persona: PersonaYaml,
  prd: string,
  opts?: ValidateOptions,
): Promise<ValidationResult> {
  const replay = opts?.replay ?? false;
  const client = createLlmClient(replay);

  const templatePath = new URL('../../prompts/persona-system-prompt.md', import.meta.url).pathname;
  const template = await readFile(templatePath, 'utf-8');
  const systemPrompt = buildSystemPrompt(persona, template);
  const userMessage  = buildUserMessage(prd);

  return client.complete(systemPrompt, userMessage);
}
```

Note: The template path uses `import.meta.url` to resolve relative to the compiled dist/ file. Adjust if tsup outputs to a different location — test with `pnpm build && node dist/index.js` after implementation.

**packages/engine/bin/echomind-validate.ts** — CLI binary:
```typescript
#!/usr/bin/env node
import { Command } from 'commander';
import { loadPersona, validate } from '../src/index.js';
import { readFile } from 'fs/promises';

const program = new Command();

program
  .name('echomind-validate')
  .description('Validate a PRD against an EchoMind persona')
  .requiredOption('--persona <yaml-path>', 'Path to persona YAML file')
  .requiredOption('--prd <md-path>', 'Path to PRD markdown file')
  .option('--replay', 'Use fixture replay instead of live gateway call', false);

program.parse();
const opts = program.opts<{ persona: string; prd: string; replay: boolean }>();

async function main() {
  const persona = await loadPersona(opts.persona);
  const prd = await readFile(opts.prd, 'utf-8');
  const result = await validate(persona, prd, { replay: opts.replay });

  // Render as markdown per UI-SPEC.md §Skill Surface
  console.log(`# Validation: ${persona.role} → ACV MAX Auctions PRD\n`);
  console.log('## Fit\n');
  result.fit.forEach(f => console.log(`- ${f}`));
  console.log('\n## Friction\n');
  result.friction.forEach(f => console.log(`- ${f}`));
  console.log('\n## Questions\n');
  result.questions.forEach(f => console.log(`- ${f}`));
  console.log('\n## Refinements\n');
  result.refinements.forEach(f => console.log(`- ${f}`));
}

main().catch(err => {
  console.error('echomind-validate error:', err.message);
  process.exit(1);
});
```

Run `pnpm install` at repo root after creating all files. Then `pnpm --filter @echomind/engine build` to verify compilation.
  </action>

  <verify>
    <automated>cd /Users/cdunbar/Repos/echomind && pnpm install --frozen-lockfile=false 2>&1 | tail -5 && pnpm --filter @echomind/engine build 2>&1 | tail -10</automated>
  </verify>

  <acceptance_criteria>
    - pnpm-workspace.yaml contains "packages/*" and "apps/*"
    - packages/engine/package.json contains `"name": "@echomind/engine"`
    - packages/engine/package.json contains `"echomind-validate"` in the `bin` field
    - packages/engine/src/types.ts exports `ValidationResult`, `PersonaYaml`, `ValidateOptions`
    - packages/engine/src/index.ts exports `validate`, `loadPersona`, `ValidationResult`
    - packages/engine/src/llm.ts contains `ECHOMIND_LLM_BASE_URL` (no hardcoded anthropic.com URLs)
    - packages/engine/src/llm.ts contains `GatewayClient` and `FixtureClient` class definitions
    - packages/engine/src/prompt.ts contains `buildSystemPrompt` function
    - pnpm --filter @echomind/engine build exits 0 and produces packages/engine/dist/index.js
    - packages/engine/dist/bin/echomind-validate.js exists after build
  </acceptance_criteria>

  <done>Engine package builds cleanly with all types exported. CLI binary compiled. No raw Anthropic API keys committed.</done>
</task>

<task type="auto">
  <name>Task 2: Vue 3 + Vuetify web app shell</name>
  <files>
    apps/web/package.json
    apps/web/tsconfig.json
    apps/web/index.html
    apps/web/vite.config.ts
    apps/web/src/main.ts
    apps/web/src/App.vue
  </files>

  <read_first>
    - .planning/phases/01-demo-sliver/01-UI-SPEC.md — §Layout, §App Bar, §Design System, §Color, §Typography, §Spacing Scale
    - .planning/phases/01-demo-sliver/01-CONTEXT.md — D-14 (app shell layout), D-09 (env/proxy config)
    - .planning/phases/01-demo-sliver/01-RESEARCH.md — §Vue 3 + Vuetify Scaffold, §ACV LLM Gateway Integration (Vite proxy)
    - apps/web/package.json (once created in Task 1 — if not yet created, create it here)
  </read_first>

  <action>
Create the Vue 3 + Vuetify web app shell. This is the outer frame only — InputPane, ResultsPane, SectionCard components come in Plan 05.

**apps/web/package.json:**
```json
{
  "name": "@echomind/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@echomind/engine": "workspace:*",
    "@mdi/font": "^7.4.47",
    "vue": "^3.4.0",
    "vuetify": "^3.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vite-plugin-vuetify": "^2.0.0"
  }
}
```

**apps/web/tsconfig.json:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "lib": ["ESNext", "DOM"],
    "useDefineForClassFields": true
  },
  "include": ["src/**/*", "*.ts"]
}
```

**apps/web/index.html:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EchoMind</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**apps/web/vite.config.ts** — Vuetify plugin + dev proxy for gateway:
```typescript
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      vue(),
      vuetify({ autoImport: true }),
    ],
    assetsInclude: ['**/*.md'],
    server: {
      port: 5173,
      proxy: {
        '/api/llm': {
          target: env['ECHOMIND_LLM_BASE_URL'] ?? 'http://localhost:9999',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/llm/, ''),
          headers: {
            Authorization: `Bearer ${env['ECHOMIND_LLM_API_KEY'] ?? ''}`,
          },
        },
      },
    },
  };
});
```

Note: ECHOMIND_LLM_BASE_URL and ECHOMIND_LLM_API_KEY are read from .env.local (server-side in vite config, not VITE_ prefixed — they never reach the browser bundle). Only VITE_REPLAY_MODE is browser-visible.

**apps/web/src/main.ts** — createApp + Vuetify bootstrap:
```typescript
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import App from './App.vue';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1565C0',
          surface: '#FAFAFA',
          'surface-variant': '#F5F5F5',
        },
      },
    },
  },
});

createApp(App).use(vuetify).mount('#app');
```

**apps/web/src/App.vue** — shell with VAppBar + two-column layout (InputPane/ResultsPane slots, placeholder content):
```vue
<template>
  <v-app>
    <v-app-bar elevation="1" color="surface">
      <v-app-bar-title class="text-h5 font-weight-semibold">EchoMind</v-app-bar-title>
    </v-app-bar>

    <v-main style="background: rgb(var(--v-theme-surface))">
      <v-container fluid class="pa-6" style="height: 100%">
        <v-row style="height: 100%" no-gutters class="ga-8">
          <!-- Input pane — 360px fixed, filled by Plan 05 -->
          <v-col style="max-width: 360px; flex: 0 0 360px;">
            <div class="text-body-2 text-medium-emphasis">Input pane (Plan 05)</div>
          </v-col>
          <!-- Results pane — fills remaining width, filled by Plan 05 -->
          <v-col>
            <div class="text-body-2 text-medium-emphasis">Results pane (Plan 05)</div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Components wired in Plan 05
</script>
```

After creating files, run `pnpm install` at repo root (picks up new apps/web deps) and verify `pnpm --filter @echomind/web dev` starts without error.
  </action>

  <verify>
    <automated>cd /Users/cdunbar/Repos/echomind && pnpm install --frozen-lockfile=false 2>&1 | tail -3</automated>
  </verify>

  <acceptance_criteria>
    - apps/web/package.json contains `"name": "@echomind/web"` and `"@echomind/engine": "workspace:*"` in dependencies
    - apps/web/vite.config.ts contains `proxy` configuration for `/api/llm`
    - apps/web/vite.config.ts contains `assetsInclude: ['**/*.md']` (required for ?raw markdown imports in Plan 05)
    - grep "assetsInclude" apps/web/vite.config.ts returns a match
    - apps/web/vite.config.ts does NOT contain `VITE_` prefixed secrets (ECHOMIND_LLM_API_KEY is server-side only)
    - apps/web/src/main.ts contains `createVuetify()` with `primary: '#1565C0'` per UI-SPEC.md
    - apps/web/src/main.ts imports `vuetify/styles` and `@mdi/font/css/materialdesignicons.css`
    - apps/web/src/App.vue contains `v-app-bar` with text "EchoMind" in `text-h5` class
    - apps/web/src/App.vue has two v-col elements (input pane 360px, results pane flex-grow)
    - pnpm install exits 0 at repo root after web package added
  </acceptance_criteria>

  <done>Vue 3 + Vuetify web shell installs and the dev server starts. App bar renders "EchoMind". Placeholder layout columns are in place for Plan 05 to fill.</done>
</task>

</tasks>

<verification>
Run after both tasks complete:

```bash
# Engine compiles
pnpm --filter @echomind/engine build

# Verify key exports present
grep -n "export" /Users/cdunbar/Repos/echomind/packages/engine/dist/index.js | head -20

# Verify no raw Anthropic API key or anthropic.com in source
grep -r "anthropic.com" /Users/cdunbar/Repos/echomind/packages/engine/src/ && echo "FAIL: hardcoded URL" || echo "PASS: no hardcoded URL"
grep -r "sk-ant-" /Users/cdunbar/Repos/echomind/ --include="*.ts" --include="*.vue" && echo "FAIL: leaked key" || echo "PASS: no leaked keys"

# Web deps installed
ls /Users/cdunbar/Repos/echomind/apps/web/node_modules/vuetify 2>/dev/null && echo "PASS: vuetify installed" || echo "FAIL: vuetify missing"
```
</verification>

<success_criteria>
- pnpm install succeeds at repo root
- pnpm --filter @echomind/engine build exits 0, produces dist/index.js and dist/bin/echomind-validate.js
- validate(), loadPersona(), ValidationResult, PersonaYaml exported from engine dist
- No ECHOMIND_LLM_API_KEY or raw Anthropic API keys in committed source
- apps/web/ installed with vuetify, @echomind/engine workspace reference
- App.vue shell renders correctly (verified by Plan 05 after full wiring)
</success_criteria>

<output>
After completion, create `.planning/phases/01-demo-sliver/01-01-monorepo-scaffold-SUMMARY.md` using the summary template. Include: actual files created, any deviations from the plan (e.g., import.meta.url path adjustments), build command output confirmation.
</output>
