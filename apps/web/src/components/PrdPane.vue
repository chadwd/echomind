<template>
  <div
    class="prd-pane h-100 d-flex flex-column"
    style="background-color: rgb(var(--v-theme-surface-container-low)); border: 1px solid rgb(var(--v-theme-outline-variant)); border-radius: 8px; overflow: hidden;"
  >
    <!-- Fixed header -->
    <div class="px-4 pt-4 pb-3" style="border-bottom: 1px solid rgb(var(--v-theme-outline-variant)); flex-shrink: 0;">
      <div class="text-caption text-medium-emphasis mb-1" style="letter-spacing: 0.5px; text-transform: uppercase;">PRD Reference</div>
      <div class="text-subtitle-2 font-weight-bold">ACV MAX Auctions: Mobile Live Bid</div>
    </div>

    <!-- Scrollable content -->
    <div class="pa-4 overflow-y-auto flex-grow-1">
      <template v-for="(block, i) in blocks" :key="i">
        <div v-if="block.type === 'h2'" class="text-caption font-weight-bold mt-4 mb-1" style="text-transform: uppercase; letter-spacing: 0.5px; color: rgb(var(--v-theme-primary));">
          {{ block.text }}
        </div>
        <v-divider v-else-if="block.type === 'hr'" class="my-3" />
        <div v-else-if="block.type === 'meta'" class="text-caption text-disabled mb-1">{{ block.text }}</div>
        <p v-else class="text-body-2 mb-2 prd-para" v-html="bold(block.text)" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import raw from '../../../../fixtures/prds/acvmax-auctions.md?raw';

type Block = { type: 'h2' | 'hr' | 'meta' | 'p'; text: string };

function bold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

const blocks = computed<Block[]>(() =>
  raw.split('\n').reduce<Block[]>((acc, line) => {
    const t = line.trim();
    if (!t || t.startsWith('# ')) return acc;          // skip blank + h1 (shown in header)
    if (t === '---') return [...acc, { type: 'hr', text: '' }];
    if (t.startsWith('## ')) return [...acc, { type: 'h2', text: t.slice(3) }];
    if (t.startsWith('**')) return [...acc, { type: 'meta', text: t.replace(/\*\*/g, '') }];
    return [...acc, { type: 'p', text: t }];
  }, [])
);
</script>

<style scoped>
.prd-para {
  line-height: 1.6;
  color: rgb(var(--v-theme-on-surface));
}
</style>
