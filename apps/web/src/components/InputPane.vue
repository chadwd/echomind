<template>
  <v-card variant="flat" rounded="lg" class="pa-6 h-100" style="background-color: rgb(var(--v-theme-surface-container-low)); border: 1px solid rgb(var(--v-theme-outline-variant));">
    <v-card-title class="text-h6 font-weight-semibold pa-0 mb-6">
      Configure
    </v-card-title>

    <div class="d-flex flex-column ga-4">
      <!-- Persona selector (D-14: single GM item, readonly for demo) -->
      <v-select
        :model-value="'General Manager'"
        :items="['General Manager']"
        label="Persona"
        prepend-inner-icon="mdi-account"
        readonly
        variant="outlined"
        density="comfortable"
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
        :loading="isValidating"
        @click="$emit('validate')"
      >
        Get Dealer Insights
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  isValidating: boolean;
}>();

defineEmits<{
  (e: 'validate'): void;
}>();
</script>
