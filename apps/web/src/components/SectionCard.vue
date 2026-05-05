<template>
  <v-card variant="elevated" elevation="1" rounded="lg" class="overflow-hidden" :style="sectionVars">
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
        class="finding-row d-flex ga-3 py-2"
        :class="{ 'border-t-thin': i > 0 }"
      >
        <span class="finding-num text-caption font-weight-bold">{{ i + 1 }}</span>
        <p class="text-body-2 ma-0 finding-text">{{ item }}</p>
      </div>
    </div>
  </v-card>
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
  '--sc': `rgb(var(--v-theme-${props.color}))`,
}));
</script>

<style scoped>
.section-label,
.section-count {
  color: var(--sc);
}

.finding-row {
  align-items: flex-start;
}

.border-t-thin {
  border-top: 1px solid rgb(var(--v-theme-outline-variant));
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
