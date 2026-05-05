<template>
  <div class="h-100">
    <!-- Empty state -->
    <div
      v-if="!isValidating && !results"
      class="d-flex flex-column align-center justify-center h-100 text-center empty-state"
      style="min-height: 300px"
    >
      <img
        src="/logo-echomind.png"
        alt="EchoMind"
        style="height: 144px; width: auto; object-fit: contain; opacity: 0.7; margin-bottom: 16px;"
      />
      <div class="text-h6 font-weight-semibold mb-2">Ready when you are.</div>
      <div class="text-body-2 text-medium-emphasis">
        See this PRD through the GM's eyes — fit, friction, open questions, and what to tighten up.
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
        title="Reading GM's profile"
        :complete="step > 1"
        :color="step > 1 ? 'success' : 'primary'"
        :complete-icon="step > 1 ? 'mdi-check-circle' : undefined"
      />
      <v-stepper-item
        :value="2"
        title="Scanning the PRD"
        :complete="step > 2"
        :color="step > 2 ? 'success' : 'primary'"
        :complete-icon="step > 2 ? 'mdi-check-circle' : undefined"
      />
      <v-stepper-item
        :value="3"
        title="Forming a take"
        :complete="step > 3"
        :color="step > 3 ? 'success' : 'primary'"
        :complete-icon="step > 3 ? 'mdi-check-circle' : undefined"
      />
      <v-stepper-item
        :value="4"
        title="Composing insights"
        :complete="step > 4"
        :color="step > 4 ? 'success' : 'primary'"
        :complete-icon="step > 4 ? 'mdi-check-circle' : undefined"
      />
    </v-stepper>

    <!-- Results: vertical report feed, sections stagger in -->
    <TransitionGroup
      v-else-if="results"
      name="card"
      tag="div"
      class="d-flex flex-column ga-8"
    >
      <SectionCard
        v-for="(section, index) in sections"
        :key="section.key"
        :title="section.title"
        :icon="section.icon"
        :color="section.color"
        :items="results[section.key]"
        :style="{ '--stagger': `${index * 120}ms` }"
      />
    </TransitionGroup>
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
  color: string;
}> = [
  { key: 'fit',         title: 'Fit',         icon: 'mdi-check-bold',       color: 'success' },
  { key: 'friction',    title: 'Friction',    icon: 'mdi-alert',            color: 'error'   },
  { key: 'questions',   title: 'Questions',   icon: 'mdi-comment-question', color: 'info'    },
  { key: 'refinements', title: 'Refinements', icon: 'mdi-pencil',           color: 'primary' },
];
</script>

<style scoped>
/* Section group stagger-in */
.card-enter-active {
  animation: card-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--stagger, 0ms);
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Empty state gentle fade */
.empty-state {
  animation: fade-in 0.6s ease both;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .card-enter-active,
  .empty-state {
    animation: none;
  }
}
</style>
