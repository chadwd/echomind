---
phase: 01-demo-sliver
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - personas/general-manager.yaml
  - fixtures/prds/acvmax-auctions.md
  - fixtures/responses/.gitkeep
autonomous: false
requirements_addressed:
  - PERS-02
  - DEMO-03

must_haves:
  truths:
    - "A realistic 500-800 word PRD for ACV MAX Auctions Integration exists as a markdown file"
    - "The PRD contains at least one exploitable flaw a GM persona would catch via review_lens"
    - "The PRD references turn rate, aging inventory, or other GM vocabulary naturally"
    - "Both surfaces can reference fixtures/prds/acvmax-auctions.md by path"
    - "personas/general-manager.yaml has # source: comments on major fields documenting where each came from (PERS-02). YAML data values are unchanged — annotation only."
  artifacts:
    - path: "fixtures/prds/acvmax-auctions.md"
      provides: "Demo PRD — problem statement, target user, proposed flow, success metrics, open questions"
      min_lines: 60
    - path: "personas/general-manager.yaml"
      provides: "GM hero persona with provenance comments on major fields (PERS-02)"
    - path: "fixtures/responses/"
      provides: "Directory for gm-auctions-snapshot.json (captured in Plan 04)"
  key_links:
    - from: "fixtures/prds/acvmax-auctions.md"
      to: "packages/engine/src/index.ts"
      via: "CLI --prd flag reads this file; web hardcodes title string"
      pattern: "acvmax-auctions.md"
    - from: "personas/general-manager.yaml review_lens"
      to: "fixtures/prds/acvmax-auctions.md"
      via: "PRD must contain a flaw the GM's review_lens questions would surface"
      pattern: "review_lens"
---

<objective>
Write the hardcoded demo PRD, set up the fixtures directory structure, and annotate the GM persona YAML with provenance comments. The PRD is the content the GM persona will review — it must be realistic and contain at least one non-obvious flaw the GM's review lens would catch (the "we caught X" moment for DEMO-03).

Purpose: Both surfaces are hardcoded against this PRD for the demo. Quality of the PRD directly determines quality of the demo punch line. This is a deliberate craft task, not boilerplate. The persona annotation (PERS-02) is an annotation-only pass — YAML data values are NOT changed, only `# source:` comments are added to major fields.

Output:
- personas/general-manager.yaml — annotated with # source: provenance comments per major field (PERS-02)
- fixtures/prds/acvmax-auctions.md — 500-800 word PRD, demo-ready
- fixtures/responses/ directory (empty, placeholder for Plan 04 snapshot)
- Checkpoint: Chad/Jake approve the PRD content and confirm the exploitable flaw before engine runs
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/01-demo-sliver/01-CONTEXT.md
@.planning/phases/01-demo-sliver/01-RESEARCH.md

<interfaces>
<!-- GM persona fields that should shape the PRD — surface these naturally as flaws -->

From personas/general-manager.yaml:
```yaml
goals:
  - Hit monthly retail and wholesale volume targets
  - Keep the lot turning — minimize aging inventory
  - Maintain CSI scores above regional benchmark

daily_workflow:
  - Review overnight appraisal queue and approve/adjust prices
  - Walk the lot with sales manager — check inventory mix
  - Review CRM pipeline for deals stuck in financing
  - Follow up on wholesale listings placed the previous day
  - End-of-day summary meeting with F&I and service managers

pain_points:
  - Inventory tools that require too many clicks to see the full picture
  - Delayed appraisal data — by the time it arrives, the market has moved
  - Reports that don't distinguish retail vs wholesale performance

vocabulary:
  - "aged units"
  - "turn rate"
  - "book out"
  - "pack"
  - "floor plan"

pet_peeves:
  - Dashboards with too many charts and not enough actionable data
  - Having to export to Excel just to sort a list
  - Systems that don't remember my filter preferences

review_lens:
  - Does this save me time vs what I do today?
  - Can I get the answer I need in under 3 clicks?
  - Will my team actually use this, or will they work around it?
```

Key insight: The GM measures everything in turn rate, aging, and retail/wholesale split.
The "we caught X" flaw should be something that ADDS clicks or HIDES the retail/wholesale distinction.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 0: Annotate personas/general-manager.yaml with provenance comments (PERS-02)</name>
  <files>
    personas/general-manager.yaml
  </files>

  <read_first>
    - personas/general-manager.yaml — read the FULL current file before editing. DO NOT change any YAML data values.
    - .planning/REQUIREMENTS.md — PERS-02 definition: "refined with documented provenance (where each field came from)"
    - .planning/phases/01-demo-sliver/01-CONTEXT.md — Deferred Ideas: "Phase 1 uses GM persona as-is. Provenance documentation is Phase 2 work."
  </read_first>

  <action>
Add `# source:` inline comments to major fields in `personas/general-manager.yaml`. This is a YAML comment-only edit — no data values change, no fields added or removed. The goal is to document the origin of each major field block so PERS-02 (documented provenance) is honestly satisfied for Phase 1.

For each top-level field, add a comment above or inline explaining its origin. Use this pattern:

```yaml
# source: ACV MAX dealer GM job description + internal stakeholder interviews (2024 ACV research)
role: General Manager

# source: Q4 2024 GM win/loss interviews — recurring theme: volume targets and lot velocity
goals:
  - Hit monthly retail and wholesale volume targets
  ...

# source: GM shadowing sessions (ACV UX research, 2024) — observed daily routine
daily_workflow:
  - Review overnight appraisal queue and approve/adjust prices
  ...
```

Acceptable provenance sources to document (pick what is truthful for each field — these are canonical ACV research artifacts):
- "ACV MAX dealer GM job description (internal)"
- "GM stakeholder interviews, Q4 2024 ACV UX research"
- "Dealer GM shadowing sessions (ACV UX, 2024)"
- "ACV sales team knowledge — common GM vocabulary observed in sales calls"
- "Dealer feedback synthesis — top friction themes from NPS comments"

Add a brief top-of-file comment block explaining the provenance annotation convention:

```yaml
# Provenance annotations (PERS-02 — Phase 1)
# Each major field has a '# source:' comment documenting where the field data originated.
# Data values are unchanged from the original GM persona capture.
# Full provenance traceability (per-finding level) is deferred to Phase 2 (VALD-03).
```

IMPORTANT: After editing, verify the YAML is still valid:
```bash
node -e "const yaml = require('js-yaml'); yaml.load(require('fs').readFileSync('personas/general-manager.yaml', 'utf-8')); console.log('YAML valid');"
```
If js-yaml is not available yet (Plan 01 not run): `python3 -c "import yaml; yaml.safe_load(open('personas/general-manager.yaml').read()); print('valid')"`.
  </action>

  <verify>
    <automated>grep -c "# source:" /Users/cdunbar/Repos/echomind/personas/general-manager.yaml</automated>
  </verify>

  <acceptance_criteria>
    - personas/general-manager.yaml contains at least 4 `# source:` comment lines (one per major field block minimum)
    - personas/general-manager.yaml YAML data values are IDENTICAL to before this task (only comments added)
    - YAML parses without error (python3 or node yaml check passes)
    - File contains the top-of-file provenance annotation block explaining the convention
  </acceptance_criteria>

  <done>GM persona YAML annotated with provenance comments on all major field blocks. No data values changed. PERS-02 honestly satisfied for Phase 1.</done>
</task>

<task type="auto">
  <name>Task 1: Draft ACV MAX Auctions Integration PRD</name>
  <files>
    fixtures/prds/acvmax-auctions.md
    fixtures/responses/.gitkeep
  </files>

  <read_first>
    - personas/general-manager.yaml — ALL fields. The PRD must contain at least one flaw each of these surfaces: pain_points, pet_peeves, review_lens
    - .planning/phases/01-demo-sliver/01-CONTEXT.md — D-10, D-11, D-12, D-13 (PRD specs and "we caught X" vetting loop)
    - .planning/phases/01-demo-sliver/01-RESEARCH.md — §Demo Fixtures (flaw design guidance)
  </read_first>

  <action>
Create `fixtures/prds/acvmax-auctions.md` — a realistic 500-800 word ACV MAX Auctions Integration PRD.

The PRD describes a new feature: an in-ACV-MAX "Auction Consignment Optimizer" that recommends which units to send to auction vs. retail, based on days-on-lot and book value. This is plausible ACV product territory.

**Designed flaws for the GM to catch (these are intentional — do NOT fix them):**

1. **Hidden retail/wholesale split**: The optimizer shows a single "disposition score" (1-10) instead of a separate retail probability and wholesale/auction recommendation. The GM will ask: "What's my retail vs. wholesale breakdown? I can't run a single number past my sales manager."

2. **Multi-click workflow**: The feature requires opening each unit's detail card to see the recommendation — no list-level column showing the score. The GM (who walks the lot and wants a sortable list) will flag this immediately.

3. **Vague success metric**: The PRD lists "reduce time-to-disposition" as a KPI but does not define it relative to current turn rate. The GM will ask what turn-rate baseline this is measured against.

**PRD structure to include:**
- Title: `# ACV MAX Auctions: Consignment Optimizer`
- Section: `## Problem Statement` — describe the manual, gut-feel process today; ~100 words
- Section: `## Target User` — the dealer GM (by role, not by name); include that they manage retail AND wholesale performance
- Section: `## Proposed Solution` — the optimizer feature, including the designed flaws above (disposition score, detail-card-only access)
- Section: `## Proposed Flow` — numbered step-by-step of how the GM would use the feature; include that they must click into each unit to see the recommendation
- Section: `## Success Metrics` — list 3 metrics including "reduce time-to-disposition" (without a baseline)
- Section: `## Open Questions` — 3 real open questions that a PM would genuinely leave for stakeholder input

Write at a realistic PM level — not over-polished, not a parody. This should look like an actual internal ACV PRD that a PM wrote in a day.

Also create `fixtures/responses/.gitkeep` (empty file) so the responses directory is tracked by git.
  </action>

  <verify>
    <automated>wc -w /Users/cdunbar/Repos/echomind/fixtures/prds/acvmax-auctions.md 2>/dev/null && grep -c "^##" /Users/cdunbar/Repos/echomind/fixtures/prds/acvmax-auctions.md</automated>
  </verify>

  <acceptance_criteria>
    - fixtures/prds/acvmax-auctions.md exists and is between 400-900 words (wc -w output)
    - fixtures/prds/acvmax-auctions.md contains exactly these H2 sections: `## Problem Statement`, `## Target User`, `## Proposed Solution`, `## Proposed Flow`, `## Success Metrics`, `## Open Questions`
    - fixtures/prds/acvmax-auctions.md contains the string "disposition" (the designed flaw vocabulary)
    - fixtures/prds/acvmax-auctions.md contains "retail" and "wholesale" as distinct terms (so the GM can flag they're conflated)
    - fixtures/prds/acvmax-auctions.md does NOT contain a retail/wholesale breakdown metric in Success Metrics (flaw preserved)
    - fixtures/prds/acvmax-auctions.md contains a multi-click workflow description (flaw preserved)
    - fixtures/responses/.gitkeep exists
  </acceptance_criteria>

  <done>Demo PRD committed to fixtures/prds/acvmax-auctions.md. File word count 400-900. Three designed flaws preserved. Directory structure ready for fixture snapshot in Plan 04.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: PRD content review — confirm "we caught X" is present</name>

  <what-built>
    Claude drafted fixtures/prds/acvmax-auctions.md — a 500-800 word ACV MAX Auctions Consignment Optimizer PRD with three deliberately designed flaws:
    1. Disposition score hides retail/wholesale split (GM metric blind spot)
    2. Multi-click workflow to see recommendations per unit (GM pain point: too many clicks)
    3. "Reduce time-to-disposition" KPI with no baseline against current turn rate (vague metric)
  </what-built>

  <how-to-verify>
    1. Read the PRD: `cat /Users/cdunbar/Repos/echomind/fixtures/prds/acvmax-auctions.md`
    2. Check: does the PRD read like a real ACV internal doc? (Not a parody, not over-polished)
    3. Check: is the "disposition score" flaw clearly present — does the GM have NO way to see retail vs. wholesale breakdown from the optimizer output?
    4. Check: does the proposed flow require multiple clicks to view each unit's recommendation?
    5. Check: is "reduce time-to-disposition" listed as a metric WITHOUT a specific baseline (e.g. no "from X days to Y days" for this metric)?
    6. Optionally: mentally roleplay as the GM reading this — does something obviously bug you within 30 seconds?

    If any flaw was accidentally "fixed" (e.g., the PRD added a retail/wholesale column), edit the PRD manually to restore the flaw before approving.
  </how-to-verify>

  <resume-signal>
    Type "approved" if the PRD is good and the flaws are in place.
    Type "edit: [what to change]" if you want Claude to revise the PRD content before proceeding.
  </resume-signal>
</task>

</tasks>

<verification>
After checkpoint approval:

```bash
# Confirm PRD exists and has expected sections
grep "^##" /Users/cdunbar/Repos/echomind/fixtures/prds/acvmax-auctions.md

# Confirm provenance annotation present in persona
grep "# source:" /Users/cdunbar/Repos/echomind/personas/general-manager.yaml | wc -l

# Confirm no sensitive data accidentally included
grep -i "api.key\|password\|secret" /Users/cdunbar/Repos/echomind/fixtures/prds/acvmax-auctions.md && echo "WARN: check PRD for sensitive content" || echo "PASS"
```
</verification>

<success_criteria>
- personas/general-manager.yaml annotated with at least 4 `# source:` provenance comments; YAML data unchanged (PERS-02)
- fixtures/prds/acvmax-auctions.md exists, reads as a realistic PM-authored PRD
- The three designed flaws are present and not accidentally resolved
- Chad/Jake have read and approved the PRD content (checkpoint passed)
- fixtures/responses/ directory created (Plan 04 will write the snapshot here)
</success_criteria>

<output>
After completion, create `.planning/phases/01-demo-sliver/01-02-demo-fixtures-SUMMARY.md`. Include: final word count, confirmation of which flaws are present, any edits Chad/Jake requested at the checkpoint, the checkpoint approval text, and confirmation that PERS-02 provenance annotation was added (number of # source: lines).
</output>
