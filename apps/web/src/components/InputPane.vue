<template>
  <v-card variant="flat" rounded="lg" class="pa-6 h-100" style="background-color: rgb(var(--v-theme-surface-container-low)); border: 1px solid rgb(var(--v-theme-outline-variant));">
    <v-card-title class="text-h6 font-weight-semibold pa-0 mb-6">
      Configure
    </v-card-title>

    <div class="d-flex flex-column ga-4">
      <!-- Persona selector: all personas from personas/*.yaml, GM default -->
      <v-select
        :model-value="persona"
        :items="personas"
        label="Persona"
        prepend-inner-icon="mdi-account"
        variant="outlined"
        density="comfortable"
        @update:model-value="$emit('update:persona', $event)"
      />

      <!-- PRD display (D-14: readonly text field showing demo PRD title) -->
      <v-text-field
        model-value="ACV MAX Auctions: Mobile Live Bid"
        label="PRD"
        prepend-inner-icon="mdi-file-document"
        readonly
        variant="outlined"
        density="comfortable"
      />

      <!-- Validate button — the sole active CTA (UI-SPEC: full-width, large, primary fill) -->
      <v-btn
        color="primary"
        size="large"
        block
        elevation="2"
        class="cta-btn"
        :loading="isValidating"
        @click="$emit('validate')"
      >
        Get Dealer Insights
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { personas } from '../composables/usePersonas';

defineProps<{
  isValidating: boolean;
  persona: string;
}>();

defineEmits<{
  (e: 'validate'): void;
  (e: 'update:persona', value: string): void;
}>();
</script>

<style scoped>
.cta-btn {
  transition: transform 0.15s ease, box-shadow 0.2s ease !important;
}

.cta-btn:hover {
  transform: translateY(-2px) !important;
}

.cta-btn:active {
  transform: translateY(0) !important;
  transition-duration: 0.08s !important;
}

@media (prefers-reduced-motion: reduce) {
  .cta-btn,
  .cta-btn:hover,
  .cta-btn:active {
    transform: none !important;
    transition: none !important;
  }
}
</style>
