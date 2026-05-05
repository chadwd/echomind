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
