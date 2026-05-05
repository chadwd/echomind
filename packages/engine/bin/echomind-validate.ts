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
  .option('--replay', 'Use fixture replay instead of live gateway call', false)
  .option('--output-format <format>', 'Output format: markdown or json', 'markdown');

program.parse();
const opts = program.opts<{ persona: string; prd: string; replay: boolean; outputFormat: string }>();

async function main() {
  const persona = await loadPersona(opts.persona);
  const prd = await readFile(opts.prd, 'utf-8');
  const result = await validate(persona, prd, { replay: opts.replay });

  const outputFormat = opts.outputFormat;
  if (outputFormat === 'json') {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

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
