<template>
  <div class="h-100">
    <!-- Empty state -->
    <div
      v-if="!isValidating && !results"
      class="d-flex flex-column align-center justify-center h-100 text-center"
      style="min-height: 300px"
    >
      <v-icon icon="mdi-lightning-bolt-outline" size="48" color="secondary" class="mb-4" />
      <div class="text-h6 font-weight-semibold mb-2">Ready for feedback</div>
      <div class="text-body-2 text-medium-emphasis">
        Select a persona and PRD above, then click Get Feedback to see the structured take-away.
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
