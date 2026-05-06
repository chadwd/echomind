<template>
  <v-card variant="flat" rounded="lg" class="overflow-hidden" style="background-color: rgb(var(--v-theme-surface-container-low)); border: 1px solid rgb(var(--v-theme-outline-variant));" :style="sectionVars">
    <!-- Section header -->
    <div class="section-header d-flex align-center ga-2 px-4 py-3">
      <v-icon :icon="icon" :color="color" size="18" />
      <span class="text-subtitle-2 font-weight-bold section-label">{{ title }}</span>
      <v-spacer />
      <span class="text-caption section-count font-weight-medium">{{ items.length }}</span>
    </div>

    <v-divider :color="color" thickness="2" />

    <!-- Findings list -->
    <div class="px-4 pt-1 pb-2">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="finding-row d-flex ga-2 py-1"
      >
        <span class="finding-num text-caption font-weight-bold">{{ i + 1 }}</span>
        <div class="finding-content">
          <p class="text-body-2 ma-0 finding-text" v-html="bold(item.text)" />
          <div
            v-if="item.sources && item.sources.length > 0"
            class="d-flex flex-wrap ga-1 mt-1"
            :aria-label="`Sourced from: ${item.sources.join(', ')}`"
          >
            <v-chip
              v-for="src in item.sources"
              :key="src"
              :color="chipColor(src)"
              size="x-small"
              variant="tonal"
              :ripple="false"
            >
              {{ src }}
            </v-chip>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Finding } from '@echomind/engine';
import { chipColor } from '../utils/provenance';

const props = defineProps<{
  title: string;
  icon: string;
  items: Finding[];
  color: string;
}>();

const sectionVars = computed(() => ({
  '--sc': `rgb(var(--v-theme-${props.color}))`,
}));

function bold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
</script>

<style scoped>
.section-label,
.section-count {
  color: var(--sc);
}

.finding-row {
  align-items: flex-start;
}


.finding-num {
  flex-shrink: 0;
  width: 18px;
  padding-top: 2px;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.5;
}

.finding-text {
  line-height: 1.65;
  color: rgb(var(--v-theme-on-surface));
}
</style>
