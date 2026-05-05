<template>
  <div class="section-group" :style="sectionVars">
    <!-- Section header -->
    <div class="section-header d-flex align-center ga-2 pb-3 mb-4">
      <v-icon :icon="icon" :color="color" size="18" />
      <span class="text-subtitle-2 font-weight-bold section-label">{{ title }}</span>
      <v-spacer />
      <span class="text-caption section-count font-weight-medium">{{ items.length }}</span>
    </div>

    <!-- Individual finding cards -->
    <div class="d-flex flex-column ga-3">
      <div v-for="(item, i) in items" :key="i" class="finding-card">
        <span class="finding-num text-caption font-weight-bold">{{ i + 1 }}</span>
        <p class="text-body-2 ma-0 finding-text">{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  icon: string;
  items: string[];
  color: string;
}>();

const sectionVars = computed(() => ({
  '--sc':    `rgb(var(--v-theme-${props.color}))`,
  '--sc-bg': `rgb(var(--v-theme-${props.color}) / 0.07)`,
}));
</script>

<style scoped>
.section-header {
  border-bottom: 2px solid var(--sc);
}

.section-label,
.section-count {
  color: var(--sc);
}

.finding-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 16px;
  border-left: 3px solid var(--sc);
  border-radius: 0 8px 8px 0;
  background: var(--sc-bg);
}

.finding-num {
  flex-shrink: 0;
  color: var(--sc);
  width: 18px;
  padding-top: 1px;
  opacity: 0.85;
}

.finding-text {
  line-height: 1.65;
  color: rgb(var(--v-theme-on-surface));
}
</style>
